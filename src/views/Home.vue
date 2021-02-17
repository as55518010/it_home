<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50" />
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <router-link to="/create" class="btn btn-primary my-2"
              >开始写文章</router-link
            >
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <column-list :list="list"></column-list>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import ColumnList from '@/components/ColumnList.vue'
import { useStore } from 'vuex'
import { GlobalDataProps, ImageProps, ResponseType } from '@/store'
import createMessage from '@/hooks/createMessage'

export default defineComponent({
  name: 'Home',
  components: {
    ColumnList
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    onMounted(() => {
      store.dispatch('fetchColumns')
    })
    const list = computed(() => store.state.columns)
    const biggerColumnsLen = computed(() => store.getters.biggerColumnsLen)
    const beforUpload = (file: File) => {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        createMessage('只能使用JPG格式', 'error')
      }
      return isJPG
    }
    const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
      createMessage(`上傳圖片ID ${rawData.data._id}`, 'success')
    }
    const onFileUploadedError = (rawData: ResponseType<ImageProps>) => {
      createMessage(`上傳圖片ID ${rawData.data._id}`, 'error')
    }
    return {
      list,
      biggerColumnsLen,
      beforUpload,
      onFileUploaded,
      onFileUploadedError
    }
  }
})
</script>
