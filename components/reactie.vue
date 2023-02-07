<template>
  <div class="reactie">
    <div class="overlay" :class="{ active: overlayActive }">
      <div class="position">
        <span>{{ store.position + 1 }} / {{ store.length + 1 }}</span>
      </div>
    </div>
    <!-- main -->
    <div class="head" @click="test()">
      <!-- <div class="position">
        <span>{{ store.position + 1 }} / {{ store.length + 1 }}</span>
      </div> -->
      <h1>Welk(e) label(s) vind jij het beste bij deze reactie passen?</h1>
    </div>
    <div class="reactieframe">
      <div class="text">{{ store.current }}</div>
    </div>
    <!-- buttons -->
    <div class="buttons">
      <div class="groep" :class="k" v-for="(v, k) in labels" :key="k">
        <label>{{ v.title }}</label>
        <button
          v-for="option in v.options"
          :key="option"
          class="selection"
          :class="{ active: store.labels.includes(Object.keys(option)[0]) }"
          @click="toggleOption(option)"
        >
          {{ Object.keys(option)[0] }}
        </button>
      </div>
    </div>
    <!-- suggestions -->
    <div class="suggestion">
      <div class="groep suggesties" v-if="store.customlabels.length > 0">
        <label
          >Eigen suggestie{{
            store.customlabels.length > 1 ? "s" : ""
          }}
          (maximaal 3):</label
        >
        <button
          class="active selection"
          v-for="suggestion in store.customlabels"
        >
          {{ suggestion }}
          <button
            class="remove"
            @click="removeCustomLabel(suggestion)"
          ></button>
        </button>
      </div>
      <label v-if="store.customlabels.length < 3"
        >Suggereer een nieuw label:</label
      >
      <div class="newlabelframe">
        <input
          v-if="store.customlabels.length < 3"
          type="text"
          maxlength="30"
          v-model="newlabel"
          @keydown.enter="addNewlabel()"
        />
        <button @click="addNewlabel()">ok</button>
      </div>
    </div>
    <div class="control">
      <!-- <button @click="store.prev()">vorige</button> -->
      <button @click="next()" class="next">volgende</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onKeyStroke } from "@vueuse/core";
import labels from "@/data/labels.yml";
import { storeToRefs } from "pinia";

const store = useLabelStore();
// const selected = ref([]);
const newlabel = ref("");
// const suggestions = ref([]);
const { watchPosition } = storeToRefs(store);
const overlayActive = ref(false);

// onKeyStroke("ArrowRight", () => {
//   store.next();
// });
// onKeyStroke("ArrowLeft", () => {
//   store.prev();
// });

function next() {
  overlayActive.value = true;
  setTimeout(async () => {
    await store.next();
  }, 500);
}

function toggleOption(option: Object) {
  const value = Object.keys(option)[0];
  if (store.labels.includes(value)) {
    store.labels.splice(store.labels.indexOf(value), 1);
  } else {
    store.labels.push(value);
  }
}
function labelToGroup(label: String) {
  let group = "";
  for (let i in labels) {
    const x = labels[i];
    if (x.options.find((val) => Object.keys(val)[0] === label)) {
      group = i;
    }
  }
  return group;
}
function removeCustomLabel(label) {
  store.customlabels.splice(store.customlabels.indexOf(label), 1);
}
function addNewlabel() {
  if (newlabel.value.length > 0) {
    store.customlabels.push(newlabel.value);
    newlabel.value = "";
  }
}
watch(watchPosition, (val) => {
  setTimeout(() => {
    overlayActive.value = false;
  }, 1000);
  setTimeout(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, 500);
});
</script>
<style lang="less" scoped>
.reactie {
  margin: 0 auto 2em;
  line-height: 1.4em;
  // display: flex;
  align-items: flex-start;
  width: calc(100% - 2em);
  width: 50rem;
  max-width: 100%;
  > * {
    flex: 1;
    border-top: 1px solid var(--bg);
    padding: 2rem 0;
  }
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg2);
  z-index: 99;
  pointer-events: none;
  opacity: 0;
  transition: all 0.5s;
  .position {
    background: var(--fg);
    width: 5em;
    margin: 4rem auto;
    font-size: 3rem;
    text-align: center;
    padding: 0.5em;
    border-radius: 0.5em;
    color: var(--bg2);
  }
  &.active {
    opacity: 1;
  }
}
.head {
  // width: 16em;
  max-width: 100%;
  padding: 2em 1em;
  text-align: center;
  h1 {
    color: var(--fg2);
    font-size: 1rem;
    display: inline;
  }
  .position {
    float: right;
    font-size: 0.75rem;
    margin-left: 1em;
    display: none;
  }
}

.contentframe {
  max-width: 100%;
}

.reactieframe {
  // background: var(--bg);
  font-family: "Source Serif Pro", Georgia, "Times New Roman", Times, serif;
  letter-spacing: 0;
  // font-size: 1.25rem;
  line-height: 1.4em;
  margin-bottom: 1em;
  padding-bottom: 3rem;
  padding-top: 3rem;
  @media (max-width: 40rem) {
    padding: 1rem 0;
  }
  // border-radius: 1rem;
  // max-width: 30em;
  // min-height: 30vh;
  // font-size: 1.25rem;
  @media (min-width: 60rem) {
    font-size: 1.25rem;
  }
  .text {
    width: 34em;
    max-width: 100%;
    margin: 0 auto;
    // min-height: 12rem;
    // text-align: center;
  }
  span {
    font-weight: inherit;
    font-family: inherit;
  }
  button {
    font-size: 0.5em;
  }
}

label {
  color: var(--fg2);
  padding-left: 1em;
}

.buttons {
  text-align: center;
  .groep {
    display: inline-block;
    width: 12rem;
    vertical-align: top;
    margin-bottom: 2em;
    // border: 1px solid var(--bg);
    // margin-right: 0.5rem;
    padding: 0 0.75em;
    > button {
      display: block;
    }
  }
  label {
    display: block;
    text-align: center;
    margin-bottom: 1.5em;
  }
}
button.selection {
  // text-align: left;
  // background: var(--bbg);
  background: transparent;
  border: 0;
  margin: 0 0.5em 0.5em 0;
  font-size: 0.7em;
  border: 0.125em solid var(--bbg);
  color: var(--fg);
  width: 100%;
  position: relative;
  padding: 0.75em 1em;
  &:hover {
    color: var(--fg);
    // background: var(--bbgh);
    border-color: var(--bbgh);
  }
  &.active {
    color: var(--fg);
    background: var(--bbg);
    border-color: var(--bbg);
    &:before {
      color: var(--fg);
    }
    &:hover {
      // border-color: var(--bbg);
    }
  }
}

.suggestion {
  border-top: 1px solid var(--bg);
  text-align: center;
  .groep {
    margin-bottom: 1em;
    button {
      display: inline-block;
      width: auto;
      padding-right: 2rem;
      .remove {
        position: absolute;
        right: 0;
        top: 0;
        width: 1rem;
        height: 1rem;
        border-radius: 100%;
        background: var(--fg);
        padding: 0;
        border: 0;
        top: 0.6em;
        right: 0.5em;
        opacity: 0.5;
        &:before,
        &:after {
          content: "";
          position: absolute;
          top: calc(50% - 1px);
          left: 0;
          border-top: 2px solid var(--bbg);
          width: 0.5rem;
          left: 0.25rem;
          transform-origin: center;
          transform: rotate(45deg);
        }
        &:after {
          transform: rotate(-45deg);
        }
        &:hover {
          opacity: 1;
        }
      }
    }
  }
  label {
    text-align: center;
    padding: 0;
    margin-bottom: 1.5em;
  }
  .newlabelframe {
    width: 16rem;
    max-width: 100%;
    margin: 0 auto;
    button {
      font-size: 0.8rem;
      padding: 0.75em;
      border: 0.125em solid var(--bg);
      background: var(--bg);
      border-radius: 0 0.5em 0.5em 0;
    }
  }
  input {
    width: 12rem;
    font-size: 0.8rem;
    border: 0.125em solid var(--bg);
    border-radius: 0.5em 0 0 0.5em;
  }
}

.control {
  text-align: center;
  padding: 2rem 0;
  border-top: 1px solid var(--bg);
  button {
    background: var(--fg2);
    color: var(--bg);
    margin: 0;
    font-size: 1rem;
    width: 8em;
    height: 3em;
    text-align: center;
    &:hover {
      background: var(--fg);
    }
  }
  span {
    margin: 0 1em;
  }
}
</style>
