<template>
  <div class="author-card">
    <img src="/avatar.png" />
    <p>CSZongzi % CS106A @ CUIT</p>
  </div>
</template>

<style lang="scss" scoped>
.author-card {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 240px;
  height: 22px;
  padding: 12px;
  margin-top: 12px;
  font-size: 14px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 2px 2px 3px rgb(0, 0, 0, 20%);

  img {
    height: 100%;
  }

  p {
    margin-left: 6px;
  }
}
</style>
