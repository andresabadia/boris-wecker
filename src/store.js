import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      id: null,
      name: null,
      data: null,
      guest: null
    }
  },
  getters: {
    user: state => {
      return state.user
    },
    uniqueID: () =>{
      let text = ""
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

      for (let i = 0; i < 8; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      }
      return text + new Date().getTime().toString(36)
    }
  },
  mutations: {
    user: (state, payload) => {
      state.user = payload
    },
    userId: (state, payload) => {
      state.user.id = payload
    },
    userName: (state, payload) => {
      state.user.name = payload
    },
    userData: (state, payload) => {
      state.user.data = payload
    },
    userGuest: (state, payload) => {
      state.user.guest = payload
    }
  },
  actions: {

  }
})
