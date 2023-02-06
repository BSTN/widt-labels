import { acceptHMRUpdate, defineStore } from 'pinia'
import comments from '@/data/comments.yml'
import { v4 as uid } from 'uuid'
import {cloneDeep} from 'lodash'

export const useLabelStore = defineStore('labelstore', {
  state: () => ({
    position: 0,
    length: comments.length - 1,
    userid: false,
    labels: [],
    customlabels: [],
  }),

  getters: {
    current():String { 
      return comments[this.position]
    },
    watchPosition():number {
      return this.position
    }
  },

  actions: {
    start() {
      this.userid = uid()
      this.$router.push('/test')
    },
    // prev() {
    //   if ( this.position === 0 ) return false
    //   this.position--
    // },
    async next() {
      const data = {
        position: this.position,
        reactie: this.current,
        labels: this.labels,
        customlabels: this.customlabels,
        userid: this.userid,
      }
      const alldata = cloneDeep(data)
      const result = await $fetch(window.location.host.match(/localhost/) ? "http://localhost:4445/" : "/api", {
        method: "PUT",
        body: alldata,
      }).catch(err => {
        console.warn(err)
      });
      // check if it has a result
      if (!result) { return false } // if not, nothing happens

      // go to end
      if (this.position === (comments.length - 1)) {
        this.$router.push('/klaar')
        return false
      }

      // reset and continue with next
      this.labels = []
      this.customlabels = []
      this.position++
    }
  },

 
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLabelStore, import.meta.hot))
}
