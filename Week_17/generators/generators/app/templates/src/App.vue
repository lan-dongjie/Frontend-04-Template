<template>
  <div class="app">{{ msg }}</div>
</template>
<script>
export default {
  data() {
    return {
      msg: "Hi",
    };
  },
};
</script>
<style scoped>
.app {
  font-size: 20px;
  text-align: center;
}
</style>