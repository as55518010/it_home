<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar && column.avatar.fitUrl" :alt="column.title" class="rounded-circle border w-100">
      </div>
      <div class="col-9">
        <h4>{{column.title}}</h4>
        <p class="text-muted">{{column.description}}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PostList from '@/components/PostList.vue'
import { useStore } from 'vuex'
import store, { GlobalDataProps, ColumnProps } from '@/store'
import { generateFitUrl } from '@/helper'

export default defineComponent({
  components: {
    PostList
  },
  setup () {
    const stort = useStore<GlobalDataProps>()
    const route = useRoute()
    const currentId = route.params.id
    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', currentId)
    })
    const column = computed(() => {
      const selectColumn = stort.getters.getColumnById(currentId) as ColumnProps
      if (selectColumn) {
        if (selectColumn.avatar) {
          generateFitUrl(selectColumn.avatar, 100, 100)
        }
      }
      return selectColumn
    })
    const list = computed(() => stort.getters.getPostByCid(currentId))
    return {
      column,
      list
    }
  }
})
</script>
