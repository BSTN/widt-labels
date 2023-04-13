<template>
  <div class="results">
    <!-- {{ alldata.length }} -->
    <div class="users">
      <div class="stickyframe">
        <div class="label">Deelnemers:</div>
        <div
          v-for="(date, userid) in userIds"
          :class="{
            active: activeUsers.includes(userid),
            hovered: hoverUsers.includes(userid),
          }"
          class="user"
          @click="toggleActiveUser(userid)"
        >
          <div class="date">{{ date }}</div>
          <!-- <div class="userid">{{ userid }}</div> -->
        </div>
      </div>
    </div>
    <div class="data" v-if="perComment">
      <div class="label">Data:</div>
      <div
        v-for="(c, k) in perComment"
        :key="k + 'keycomments'"
        class="comment"
      >
        <div class="nr">{{ k + 1 }}</div>
        <div class="count">{{ c.count }} <span>☻</span></div>
        <div class="reactie">
          {{ c.reactie }}
        </div>
        <div class="labels">
          <div v-for="item in c.labels" @mouseenter="hoverUsers = item.items">
            <span>{{ item.length }}</span> {{ item.name }}
          </div>
        </div>
        <div class="customlabels" v-if="c.customlabels.length > 0">
          <div
            v-for="item in c.customlabels"
            @mouseenter="hoverUsers = item.items"
          >
            {{ item.length }} {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import comments from "@/data/comments.yml";
import { uniq, orderBy } from "lodash";
import moment from "moment";

const alldata = ref([]);
const activeUsers = ref([]);
const hoverUsers = ref([]);

String.prototype.hashCode = function () {
  var hash = 0;
  for (var i = 0; i < this.length; i++) {
    var char = this.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

function toggleActiveUser(userid) {
  if (activeUsers.value.indexOf(userid) < 0) {
    activeUsers.value.push(userid);
  } else {
    activeUsers.value.splice(activeUsers.value.indexOf(userid), 1);
  }
}

async function loadResults() {
  const data = await $fetch("/api/results");

  const filteredData = data.filter((x) => x.reactie !== null);

  // set all active users at load
  filteredData.map((x) => {
    if (activeUsers.value.indexOf(x.userid) < 0) {
      activeUsers.value.push(x.userid);
    }
  });

  alldata.value = filteredData;
}

const userIds = computed(() => {
  const ids = {};
  alldata.value.map((x) => {
    ids[x.userid] = moment(x.createdAt).format("DD.MM.YYYY");
  });
  return ids;
});

const perComment = computed(() => {
  let collection: Array<Object> = [];

  const data = alldata.value;

  const filteredData = data.filter((x) => {
    return !(activeUsers.value.indexOf(x.userid) < 0);
  });

  filteredData.map((x) => {
    const hash: String = (x.reactie + "").hashCode();
    // collect unique users:
    userIds.value[x.userid] = moment(x.createdAt).format("DD.MM.YYYY");
    // get index
    const index =
      collection.findIndex((xx) => xx.hash === hash) > -1
        ? collection.findIndex((xx) => xx.hash === hash)
        : collection.length;
    // construct new
    if (index === collection.length) {
      collection[index] = {
        hash,
        reactie: x.reactie,
        count: 0,
        labels: {},
        customlabels: {},
      };
    }
    collection[index].count = collection[index].count + 1;

    if (x.labels) {
      x.labels.map((label) => {
        if (!collection[index].labels.hasOwnProperty(label)) {
          collection[index].labels[label] = [x.userid];
        } else {
          collection[index].labels[label].push(x.userid);
        }
      });
    }
    if (x.customlabels) {
      x.customlabels.map((label) => {
        if (!collection[index].customlabels.hasOwnProperty(label)) {
          collection[index].customlabels[label] = [x.userid];
        } else {
          collection[index].customlabels[label].push(x.userid);
        }
      });
    }
  });

  // sort
  collection.sort((a, b) => {
    return (
      comments.findIndex((x) => x === a.reactie) -
      comments.findIndex((x) => x === b.reactie)
    );
  });

  collection = collection.map((x) => {
    let labels = [];
    for (let i in x.labels) {
      labels.push({ name: i, items: x.labels[i], length: x.labels[i].length });
    }
    x.labels = orderBy(labels, ["length"], ["desc"]);

    let customlabels = [];
    for (let i in x.customlabels) {
      customlabels.push({
        name: i,
        items: x.customlabels[i],
        length: x.customlabels[i].length,
      });
    }
    x.customlabels = orderBy(customlabels, ["length"], ["desc"]);
    return x;
  });

  return collection;
});
onMounted(async () => {
  await loadResults();
});
</script>
<style lang="less" scoped>
.results {
  font-size: 0.7rem;
  display: flex;
}
.users {
  .stickyframe {
    position: sticky;
    top: 1rem;
  }
  width: 16rem;
  margin-bottom: 1rem;
  padding-right: 2rem;
  user-select: none;
  .user {
    padding: 0.5em 0.75em;
    margin-bottom: 2px;
    border-radius: 0.25em;
    line-height: 1rem;
    cursor: pointer;
    background: var(--bg);
    .date {
      font-weight: bold;
    }
    .userid {
      font-size: 0.8em;
    }
    &.active {
      background: var(--fg);
      color: var(--bg);
    }
    &.hovered {
      .date:before {
        content: "☜";
        float: right;
        font-size: 1.5em;
      }
    }
  }
}
.label {
  padding-bottom: 1em;
  color: var(--fg2);
}
.comment {
  display: flex;
  border-top: 1px solid var(--bg);
  padding: 0.75em 0;
  line-height: 1.4em;
  > * {
    padding-right: 1rem;
    span {
      opacity: 0.5;
    }
  }
  .nr {
    color: var(--fg2);
    opacity: 0.5;
  }
  .reactie {
    width: 16rem;
    color: var(--fg);
  }
  .labels,
  .customlabels {
    flex: 0;
    min-width: 16rem;
    cursor: pointer;
    > * {
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
