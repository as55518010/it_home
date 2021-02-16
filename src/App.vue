<template>
  <div class="container">
    <GlobalHeader :user="currentUser" />
    <Loader v-if="isLoading"/>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'

import GlobalHeader from '@/components/GlobalHeader.vue'
import Loader from '@/components/Loader.vue'

import createMessage from '@/hooks/createMessage'

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
  },
  setup () {
    const stort = useStore<GlobalDataProps>()
    const currentUser = computed(() => stort.state.user)
    const isLoading = computed(() => stort.state.loading)
    const token = computed(() => stort.state.token)
    const error = computed(() => stort.state.error)
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        createMessage(message, 'error')
      }
    })
    onMounted(() => {
      // 檢測未登入，local storage 有tokern
      if (!currentUser.value.isLogin && token.value) {
        axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
        stort.dispatch('fetchCurrentUser')
      }
    })
    return {
      currentUser,
      isLoading,
      error
    }
  }
})
</script>
