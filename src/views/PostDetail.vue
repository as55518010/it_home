<template>
  <div class="post-detail-page">
    <modal
      title="刪除文章"
      :visible="modalIsVisible"
      @modal-on-close="modalIsVisible = false"
      @modal-on-confirm="hideAndDelete"
    >
      <p>確定要刪除文章</p>
    </modal>
    <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
      <img
        :src="currentImageUrl"
        alt="currentPost.title"
        class="rounded-lg img-fluid my-4"
        v-if="currentImageUrl"
      />
      <h2 class="mb-4">{{ currentPost.title }}</h2>
      <div
        class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0"
      >
        <div class="col">
          <user-profile
            :user="currentPost.author"
            v-if="typeof currentPost.author === 'object'"
          ></user-profile>
        </div>
        <span class="text-muted col text-right font-italic"
          >发表于：{{ currentPost.createdAt }}</span
        >
      </div>
      <div v-html="currentHTML"></div>
      <div v-if="showEditArea" class="btn-group mt-5">
        <router-link
          class="btn btn-success"
          :to="{ name: 'update', query: { id: currentPost._id } }"
          >編輯</router-link
        >
        <button type="button" class="btn btn-danger" @click.prevent="modalIsVisible = true">刪除</button>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { GlobalDataProps, PostProps, ImageProps, UserProps, ResponseType } from '../store'
import UserProfile from '@/components/UserProfile.vue'
import modal from '@/components/Modal.vue'
import createMessage from '@/hooks/createMessage'

export default defineComponent({
  name: 'post-detail',
  components: {
    UserProfile,
    modal
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const router = useRouter()
    const modalIsVisible = ref(false)
    const currentId = route.params.id
    const md = new MarkdownIt()
    onMounted(() => {
      store.dispatch('fetchPost', currentId)
    })
    const currentPost = computed<PostProps>(() => {
      return store.getters.getCurrentPost(currentId)
    })
    const currentHTML = computed(() => {
      // const { content, isHTML } = currentPost.value
      const { content } = currentPost.value
      if (currentPost.value && content) {
        return md.render(content)
        // return isHTML ? content : md.render(content)
      }
    })
    // 顯示修改權限
    const showEditArea = computed(() => {
      const { isLogin, _id } = store.state.user
      if (currentPost.value && currentPost.value.author && isLogin) {
        const postAuthor = currentPost.value.author as UserProps
        // 文章作者必須要等於登入者，才能修改
        return postAuthor._id === _id
      } else {
        return false
      }
    })
    const currentImageUrl = computed(() => {
      if (currentPost.value && currentPost.value.image) {
        const { image } = currentPost.value
        return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
      } else {
        return null
      }
    })
    const hideAndDelete = () => {
      modalIsVisible.value = false
      store.dispatch('deletePost', currentId).then((rawData: ResponseType<PostProps>) => {
        createMessage('刪除成功2秒後跳轉到專欄首頁', 'success')
        setTimeout(() => {
          router.push({ name: 'column', params: { id: rawData.data.column } })
        }, 2000)
      })
    }
    return {
      currentPost,
      currentImageUrl,
      currentHTML,
      showEditArea,
      modalIsVisible,
      hideAndDelete
    }
  }
})
</script>
