<template>
  <div>这是App.vue</div>
</template>

<script>
import {ref} from "vue";
export default {
  name: "App",
  setup() {
    const test = ref("");
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