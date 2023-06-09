<script lang="ts" setup>
import { useActions } from '@/scripts/actions';
import { Stage, type GlobalState } from '@/types';
import { computed, inject } from 'vue';

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
});

const state = inject('state') as GlobalState;
const { analyzeSolvability } = useActions();

const trySelect = () => {
  if (state.stage === Stage.LuckyDogSelecting) {
    state.lucky = props.index;
    analyzeSolvability();
  }
};

const backgroundSrc = computed(() => {
  for (let i = 0; i < 9; i++) {
    if (props.index.toString(10) === state.target[i]) {
      return state.backgrounds[i];
    }
  }

  return '';
});
</script>

<template>
  <div
    class="checker"
    :style="{ left: `${x * 134 + 16}px`, top: `${y * 134 + 16}px` }"
    @click="trySelect"
  >
    <img v-if="backgroundSrc" class="checker-background" :src="backgroundSrc" />
    <div v-else class="checker-background" />
    <div class="checker-index">
      <span>{{ props.index }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.checker {
  position: absolute;
  width: 128px;
  height: 128px;
  font-size: 3rem;
  color: #fff;
  border: 2px solid #000;
  transition: all 0.5s;

  .checker-background {
    width: 100%;
    height: 100%;
    background-color: #fff;
  }

  .checker-index {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0, 20%);
    transform: translate(-50%, -50%);
  }
}
</style>
