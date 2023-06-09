<script lang="ts" setup>
import type { GlobalState } from '@/types';
import { provide, reactive } from 'vue';
import CheckerBoard from './components/CheckerBoard.vue';
import SidePanel from './components/SidePanel.vue';

// Global shared state
const state = reactive<GlobalState>({
  stage: 0,
  steps: 0,
  solution: [],
  spaceConsumption: 0,
  timeConsumption: 0,
  lucky: 0,
  initial: '123456789',
  target: '123456789',
  current: '123456789',
  x: [null, 0, 1, 2, 0, 1, 2, 0, 1, 2],
  y: [null, 0, 0, 0, 1, 1, 1, 2, 2, 2],
  backgrounds: ['', '', '', '', '', '', '', '', ''],
});

provide('state', state);
</script>

<template>
  <CheckerBoard />
  <SidePanel />
  <div class="viewport-error">
    <p>Your viewport is too small</p>
    <p>This application need 720px x 450px viewport at least</p>
  </div>
</template>

<style lang="scss">
// Remove default padding and margin
* {
  padding: 0;
  margin: 0;
}

// Body styles
body {
  // Let the browser choose the appropriate sans-serif font. This feature has been supported since Chrome 56.
  font-family: system-ui, sans-serif;
}

// Main container
#app {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  color: #1b1b1b;
  user-select: none;
  background-color: #f2f2f2;
}

.viewport-error {
  position: absolute;
  top: 50%;
  left: 50%;
  box-sizing: border-box;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  padding: 12px;
  font-size: 16px;
  background-color: #f2f2f2;
  transform: translate(-50%, -50%);

  p:first-child {
    margin-bottom: 16px;
    font-size: 22px;
    font-weight: bold;
  }
}

@media screen and (max-width: 720px) {
  .viewport-error {
    display: flex;
  }
}

@media screen and (max-height: 450px) {
  .viewport-error {
    display: flex;
  }
}
</style>
