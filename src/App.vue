<template>
  <div class="page-container">
    <div class="base-wallet">
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/base-wallet">base wallet</router-link>
      </nav>
    </div>
    <router-view />
  </div>
</template>

<style lang="less" scoped>
.page-container {
  margin-bottom: 160px;
  .base-wallet {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    nav {
      padding: 30px;

      a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
          color: #42b983;
        }
      }
    }
  }
}
</style>
