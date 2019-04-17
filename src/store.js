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
