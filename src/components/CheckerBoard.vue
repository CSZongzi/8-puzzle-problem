<script lang="ts" setup>
import { Stage, type GlobalState } from '@/types';
import { computed, inject } from 'vue';
import OneChecker from './OneChecker.vue';

const state = inject('state') as GlobalState;

const showSolved = computed(() => {
  if (state.stage === Stage.ManualControl && state.current === state.target) {
    return true;
  } else {
    return false;
  }
});

const showPlaySolution = computed(() => {
  if (state.stage === Stage.SearchEnd && state.solution.length > 0) {
    return true;
  } else {
    return false;
  }
});

const handlePlaySolution = async () => {
  state.stage = Stage.PlayingSolution;

  for (const item of state.solution) {
    state.current = item;

    // Sleep 750ms
    const sleep750ms = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 750);
    });
    await sleep750ms;
  }

  state.stage = Stage.Solvable;
};

const showNotSolvable = computed(() => {
  if (state.stage === Stage.NotSolvable) {
    return true;
  } else if (state.stage === Stage.SearchEnd && state.steps === -1) {
    return true;
  } else {
    return false;
  }
});
</script>

<template>
  <div class="checker-board">
    <OneChecker :index="1" :x="state.x[1]" :y="state.y[1]" />
    <OneChecker :index="2" :x="state.x[2]" :y="state.y[2]" />
    <OneChecker :index="3" :x="state.x[3]" :y="state.y[3]" />
    <OneChecker :index="4" :x="state.x[4]" :y="state.y[4]" />
    <OneChecker :index="5" :x="state.x[5]" :y="state.y[5]" />
    <OneChecker :index="6" :x="state.x[6]" :y="state.y[6]" />
    <OneChecker :index="7" :x="state.x[7]" :y="state.y[7]" />
    <OneChecker :index="8" :x="state.x[8]" :y="state.y[8]" />
    <OneChecker :index="9" :x="state.x[9]" :y="state.y[9]" />
    <Transition name="fade">
      <div v-if="showSolved" class="board-mask">
        <p>Solved</p>
        <p>Congratulations!</p>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="showPlaySolution" class="board-mask" @click="handlePlaySolution">
        <p>Click to play solution</p>
        <p>Awesome algorithm!</p>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="showNotSolvable" class="board-mask">
        <p>Not Solvable</p>
        <p>Try another one?</p>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.checker-board {
  position: relative;
  width: 432px;
  height: 432px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 2px 2px 3px rgb(0, 0, 0, 20%);
}

.board-mask {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 432px;
  height: 432px;
  font-size: 24px;
  color: #333;
  background-color: rgb(255, 255, 255, 80%);
  border-radius: 6px;

  p:not(:last-child) {
    margin-bottom: 12px;
    font-size: 28px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
