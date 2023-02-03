<template>
  <div class="klaar">
    <div class="textframe">
      <div class="text" v-html="html"></div>
      <button @click="done">Klik hier om opnieuw te beginnen.</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { html } from "@/data/finished.md";
const router = useRouter();
function done() {
  router.push("/");
}
</script>
<style lang="less" scoped>
.klaar {
}
</style>
