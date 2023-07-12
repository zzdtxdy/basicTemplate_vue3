import { defineStore } from 'pinia'
import type { KeepAliveState } from '@/stores/interface'

// useKeepAliveStore
export const useKeepAliveStore = defineStore({
  id: 'KeepAliveStore',
  state: (): KeepAliveState => ({
    keepAliveName: []
  }),
  actions: {
    // addKeepAliveName
    async addKeepAliveName(name: string) {
      !this.keepAliveName.includes(name) && this.keepAliveName.push(name)
    },
    // removeKeepAliveName
    async removeKeepAliveName(name: string) {
      this.keepAliveName = this.keepAliveName.filter((item) => item !== name)
    },
    // setKeepAliveName
    async setKeepAliveName(keepAliveName: string[] = []) {
      this.keepAliveName = keepAliveName
    }
  }
})
