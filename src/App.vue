<template>
  <div class="container">
    <GlobalHeader :user="currentUser" />
    <Loader v-if="isLoading"/>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
import 'bootstrap/dist/css/bootstrap.min.css'

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
    const error = computed(() => stort.state.error)
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        createMessage(message, 'error')
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
