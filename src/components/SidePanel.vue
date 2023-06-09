<script lang="ts" setup>
import AuthorCard from './AuthorCard.vue';
import ControlCard from './ControlCard.vue';
</script>

<template>
  <div class="side-panel">
    <ControlCard />
    <AuthorCard />
  </div>
</template>

<style lang="scss" scoped>
.side-panel {
  margin-left: 12px;
}
</style>
