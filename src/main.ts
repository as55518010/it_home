import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store, { GlobalErrorProps } from '@/store'
import axios from 'axios'

const app = createApp(App)
axios.defaults.baseURL = 'api'
// 請求攔截器
axios.interceptors.request.use(config => {
  const error: GlobalErrorProps = {
    status: false,
    message: ''
  }
  // 增加Load數據
  store.commit('setLoading', true)
  store.commit('setError', error)
  return config
})
// 響應攔截器
axios.interceptors.response.use(config => {
  // 增加Load數據
  store.commit('setLoading', false)
  return config
}, e => {
  const error: GlobalErrorProps = {
    status: true,
    message: e.response.data.error
  }
  store.commit('setError', error)
  store.commit('setLoading', false)
  return Promise.reject(error)
})
app.use(router)
app.use(store)
app.mount('#app')
