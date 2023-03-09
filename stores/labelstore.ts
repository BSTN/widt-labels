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
    async load () {
      const labels = localStorage.getItem('labels')
      // check if empty
      if (!labels) { return false }
      // parse
      const {userid, position} = JSON.parse(labels)
      if (userid && typeof position === 'number') {
        this.userid = userid
        this.position = position
      }
    },
    reset () {
      const sure = confirm('Weet je zeker dat je deze sessie wilt afbreken en helemaal opnieuw wilt beginnen?')
      if (sure) {
        localStorage.clear()
        this.position = 0
        this.labels = []
        this.customlabels = []
        this.userid = false
        this.$router.push('/')
      }
    },
    store () {
      const position = this.position
      const userid = this.userid
      localStorage.setItem('labels', JSON.stringify({position, userid}))
    },
    start() {
      this.userid = uid()
      this.$router.push('/test')
    },
    async next() {
      if (this.labels.length < 1 && this.customlabels.length < 1) {
        throw(new Error('no labels defined'))
      } 
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
        localStorage.clear();
        this.$router.push('/klaar')
        return false
      }

      // reset and continue with next
      this.labels = []
      this.customlabels = []
      this.position++
      // store
      this.store()
    }
  },

 
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLabelStore, import.meta.hot))
}
