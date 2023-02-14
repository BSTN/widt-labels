<template>
  <div class="index">
    <div class="textframe">
      <div v-html="html" class="text"></div>
      <button @click="store.start()">Start</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { html } from "@/data/introduction.md";
const store = useLabelStore();
// const $router = useRouter()
</script>
<style lang="less" scoped>
.index {
  min-height: 90vh;
}
</style>
