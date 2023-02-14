<template>
  <div class="context">
    <div class="textframe">
    <div v-html="html"></div>
    <button @click="store.start()">Start</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {html} from '@/data/article.md'
const store = useLabelStore()
</script>
<style lang="less" scoped>
.context {
} 
</style>