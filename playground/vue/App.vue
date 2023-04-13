<template>
  <div>这是App.vue{{test}}</div>
</template>

<script>
import {ref} from "vue";
export default {
  name: "App",
  setup() {
    const test = ref("测试测试");
    return {
      test
    }
  }
}
</script>

<style>
.app-wrapper {
  font-size: 20px;
}
</style>