<template>
  <div class="help">
    <div class="bg" v-if="showHelp" @click="showHelp = false"></div>
    <button @click="showHelp = true">?</button>
    <div class="helpframe" v-if="showHelp" @click.stop="showHelp = false">
      <!-- <div class="helpframe" @click.stop="showHelp = false"> -->
      <button>X</button>
      <div class="contentframe">
        <div class="intro">
          Hieronder kun je een omschrijvingen lezen van de labels:
        </div>
        <div v-for="item in flatLabels" class="item" :class="item.type">
          <label>{{ item.title }}</label>
          <div class="description" v-html="item.description"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import labels from "@/data/labels.yml";
const showHelp = ref(false);
const flatLabels = computed((val) => {
  let options: Array<object> = [];
  for (let i in labels) {
    const l = labels[i];
    l.options.map((x) => {
      const option = {
        type: i,
        title: Object.keys(x)[0],
        description: Object.values(x)[0],
      };
      options.push(option);
    });
  }
  return options;
});
</script>
<style lang="less" scoped>
.help {
}
.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg2);
  opacity: 0;
  animation: fadein 0.5s linear 0s 1 forwards;
  @keyframes fadein {
    100% {
      opacity: 0.8;
    }
  }
}
button {
  position: fixed;
  top: 0;
  right: 0;
  background: var(--fg);
  color: var(--bg);
  border-radius: 1em;
  padding: 0;
  height: 1.5em;
  width: 1.5em;
  z-index: 9;
  line-height: 1.5em;
  margin: 0.5em;
}
.helpframe {
  position: fixed;
  top: 0;
  right: 0;
  width: 30rem;
  max-width: 100%;
  background: var(--bg1);
  color: var(--fg);
  padding: 3em 2em;
  z-index: 9;
  height: 100vh;
  overflow: auto;
  // text-align: center;
  .contentframe {
    width: 16rem;
    max-width: 100%;
  }
  .intro {
    color: var(--fg2);
    margin-bottom: 2em;
    font-size: 1rem;
    line-height: 1.4em;
  }
  label {
    padding: 0.75em 1em;
    // border: 1px solid var(--bg);
    border: 0;
    display: inline-block;
    margin: 0 auto;
    background: var(--bg2);
    border-radius: 0.25em;
    // border: 2px solid var(--bbg);
    background: var(--bbg);
  }
  .description {
    font-size: 0.75rem;
    margin: 0.5em 0 2em;
    line-height: 1.4em;
    text-align: left;
    color: var(--fg2);
  }
}
</style>
