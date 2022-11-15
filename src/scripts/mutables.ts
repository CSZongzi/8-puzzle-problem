import { Stage, type GlobalState } from '@/types';
import { computed, inject, ref } from 'vue';

export const useMutables = () => {
  const state = inject('state') as GlobalState;

  const initialStateInputValidity = ref(true);
  const targetStateInputValidity = ref(true);

  const inputDisabled = computed(() => {
    if (
      state.stage === Stage.Initialized ||
      state.stage === Stage.Solvable ||
      state.stage === Stage.NotSolvable
    ) {
      return false;
    } else {
      return true;
    }
  });

  const searchConsumption = computed(() => {
    if (state.stage === Stage.SearchEnd || state.stage === Stage.PlayingSolution) {
      return `${state.spaceConsumption.toString(10)} / ${state.timeConsumption.toFixed(1)}s`;
    } else if (state.stage === Stage.UninformedSearching || state.stage === Stage.AStarSearching) {
      return 'Searching...';
    } else {
      return 'N/A';
    }
  });

  const solutionSteps = computed(() => {
    if (
      state.stage === Stage.SearchEnd ||
      state.stage === Stage.PlayingSolution ||
      state.stage === Stage.ManualControl
    ) {
      return state.steps === -1 ? 'N/A' : state.steps.toString(10);
    } else if (state.stage === Stage.UninformedSearching || state.stage === Stage.AStarSearching) {
      return 'Searching...';
    } else {
      return 'N/A';
    }
  });

  const randomInitDisabled = computed(() => {
    if (
      state.stage === Stage.UninformedSearching ||
      state.stage === Stage.AStarSearching ||
      state.stage === Stage.PlayingSolution ||
      state.stage === Stage.ManualControl
    ) {
      return true;
    } else {
      return false;
    }
  });

  const searchDisabled = computed(() => {
    if (state.stage === Stage.Solvable || state.stage === Stage.SearchEnd) {
      return false;
    } else {
      return true;
    }
  });

  const manualControlState = computed(() => {
    if (state.stage === Stage.ManualControl) {
      return 'Enable';
    } else {
      return 'Disable';
    }
  });

  const manualControlDisabled = computed(() => {
    if (state.stage === Stage.Solvable || state.stage === Stage.ManualControl) {
      return false;
    } else {
      return true;
    }
  });

  const luckyDogState = computed(() => {
    if (state.stage === Stage.Initialized) {
      return 'Wait for selection';
    } else if (state.stage === Stage.LuckyDogSelecting) {
      return 'Selecting...';
    } else {
      return `Selected ${state.lucky}`;
    }
  });

  const luckyDogDisabled = computed(() => {
    if (
      state.stage === Stage.Initialized ||
      state.stage === Stage.Solvable ||
      state.stage === Stage.NotSolvable
    ) {
      return false;
    } else {
      return true;
    }
  });

  const uploadBackgroundDisabled = computed(() => {
    if (
      state.stage === Stage.Initialized ||
      state.stage === Stage.Solvable ||
      state.stage === Stage.NotSolvable
    ) {
      return false;
    } else {
      return true;
    }
  });

  return {
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
  };
};
