<script lang="ts" setup>
import { useActions } from '@/scripts/actions';
import { useImage } from '@/scripts/image';
import { useMutables } from '@/scripts/mutables';
import { Direction, Stage, type GlobalState } from '@/types';
import { inject, onMounted, watch } from 'vue';

const state = inject('state') as GlobalState;
const { uploadBackground } = useImage();
const {
  puzzleStringValidator,
  analyzeSolvability,
  move,
  getRandomPuzzleString,
  applyCurrentPuzzleString,
} = useActions();
const {
  initialStateInputValidity,
  targetStateInputValidity,
  inputDisabled,
  searchConsumption,
  solutionSteps,
  randomInitDisabled,
  searchDisabled,
  manualControlState,
  manualControlDisabled,
  luckyDogState,
  luckyDogDisabled,
  uploadBackgroundDisabled,
} = useMutables();

// Compute with Web Worker
const worker = new Worker(new URL('@/scripts/algorithm.ts', import.meta.url), {
  type: 'module',
});

worker.onmessage = (e) => {
  const { solution, spaceConsumption, timeConsumption } = e.data;

  state.spaceConsumption = spaceConsumption;
  state.timeConsumption = timeConsumption;
  state.steps = solution.length - 1;
  state.solution = solution.reverse();
  state.stage = Stage.SearchEnd;
};

const handleInitialStateInput = () => {
  if (puzzleStringValidator(state.initial)) {
    initialStateInputValidity.value = true;
    state.current = state.initial;

    // If lucky dog selected, analyze the solvability
    if (state.lucky) analyzeSolvability();
  } else {
    initialStateInputValidity.value = false;
  }
};

const handleTargetStateInput = () => {
  if (puzzleStringValidator(state.target)) {
    targetStateInputValidity.value = true;

    // If lucky dog selected, analyze the solvability
    if (state.lucky) analyzeSolvability();
  } else {
    targetStateInputValidity.value = false;
  }
};

const handleRandomInit = () => {
  state.initial = getRandomPuzzleString();
  state.current = state.initial;

  // If lucky dog selected, analyze the solvability
  if (state.lucky) analyzeSolvability();
};

const handleUninformedSearch = async () => {
  // If not solvable, exit
  analyzeSolvability();
  if (state.stage !== Stage.Solvable) return;

  state.stage = Stage.UninformedSearching;

  worker.postMessage(['bfs', state.initial, state.target, state.lucky.toString(10)]);
};

const handleAStarSearch = async () => {
  // If not solvable, exit
  analyzeSolvability();
  if (state.stage !== Stage.Solvable) return;

  state.stage = Stage.AStarSearching;

  worker.postMessage(['aStar', state.initial, state.target, state.lucky.toString(10)]);
};

const handleManualControl = () => {
  if (state.stage !== Stage.ManualControl) {
    state.stage = Stage.ManualControl;
    state.steps = 0;
  } else {
    state.stage = Stage.Solvable;
    state.current = state.initial;
  }
};

const handleLuckyDogSelect = () => {
  state.stage = Stage.LuckyDogSelecting;
};

const handleUploadBackground = () => {
  uploadBackground();
};

onMounted(() => {
  // Automatically update the view when state.current is updated
  watch(
    () => state.current,
    () => applyCurrentPuzzleString()
  );

  // Global keydown event listener
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (state.stage === Stage.ManualControl) {
      switch (e.key) {
        case 'ArrowUp':
          move(Direction.Up);
          state.steps++;
          break;
        case 'ArrowDown':
          move(Direction.Down);
          state.steps++;
          break;
        case 'ArrowLeft':
          move(Direction.Left);
          state.steps++;
          break;
        case 'ArrowRight':
          move(Direction.Right);
          state.steps++;
          break;
      }
    }
  });
});
</script>

<template>
  <div class="control-card">
    <p>Consumption: {{ searchConsumption }}</p>
    <p>Solution steps: {{ solutionSteps }}</p>
    <div class="input-area">
      <label>Initial state</label>
      <input
        v-model="state.initial"
        type="text"
        placeholder="Yes, it's necessary."
        maxlength="9"
        :disabled="inputDisabled"
        @input="handleInitialStateInput"
        @keydown.enter="handleInitialStateInput"
      />
      <span>{{ initialStateInputValidity ? 'OK' : 'Bad' }}</span>
    </div>
    <div class="input-area">
      <label>Target state</label>
      <input
        v-model="state.target"
        type="text"
        placeholder="Any idea?"
        maxlength="9"
        :disabled="inputDisabled"
        @input="handleTargetStateInput"
        @keydown.enter="handleTargetStateInput"
      />
      <span>{{ targetStateInputValidity ? 'OK' : 'Bad' }}</span>
    </div>
    <button :disabled="randomInitDisabled" @click="handleRandomInit">Randomly initialize</button>
    <button :disabled="searchDisabled" @click="handleUninformedSearch">
      Uninformed search (BFS)
    </button>
    <button :disabled="searchDisabled" @click="handleAStarSearch">A* search</button>
    <button :disabled="manualControlDisabled" @click="handleManualControl">
      Manual control: {{ manualControlState }}
    </button>
    <button :disabled="luckyDogDisabled" @click="handleLuckyDogSelect">
      Lucky dog: {{ luckyDogState }}
    </button>
    <button :disabled="uploadBackgroundDisabled" @click="handleUploadBackground">
      Upload background
    </button>
  </div>
</template>

<style lang="scss" scoped>
.control-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 240px;
  height: 350px;
  padding: 12px;
  font-size: 14px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 2px 2px 3px rgb(0, 0, 0, 20%);

  button {
    box-sizing: border-box;
    width: 100%;
    height: 24px;
    padding: 0;
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: 24px;
    color: inherit;
    background-color: #eee;
    border: none;
    border-radius: 6px;
    transition: all 0.5s;
  }

  button:disabled {
    color: #b1b1b1;
    background-color: #f6f6f6;
  }
}

.input-area {
  position: relative;
  display: flex;
  align-items: center;
  height: 22px;

  label {
    width: 88px;
  }

  input {
    box-sizing: border-box;
    width: calc(100% - 88px);
    color: inherit;
  }

  span {
    position: absolute;
    right: 6px;
    font-size: 12px;
    text-align: end;
  }
}
</style>
