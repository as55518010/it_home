<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
    <Uploader
      action="/upload"
      :beforUpload="uploadCheck"
      @file-uploaded="handleFileUploaded"
      class="d-flex align-items-center justify-content-center bg-light text-secendary w-100 my-4"
    >
    <h2>典籍上船圖</h2>
    <template #loading>
      <div class="d-flex">
        <div class="spinner-border text-secondary">
        </div>
        <h2>正在上傳</h2>
      </div>
    </template>
    <template #uploaded="{uploadedData}">
      <img :src="uploadedData.data.url" alt="">
    </template>
    </Uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入文章标题"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
          rows="10"
          tag="textarea"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">发表文章</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import Uploader from '@/components/Uploader.vue'
import ValidateForm from '@/components/ValidateForm.vue'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '@/store'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { beforeUploadCheck } from '@/helper'
import createMessage from '@/hooks/createMessage'
export default defineComponent({
  name: 'Login',
  components: {
    ValidateInput,
    ValidateForm,
    Uploader
  },
  setup () {
    const router = useRouter()
    const stort = useStore<GlobalDataProps>()
    const titleVal = ref('')
    let imageId = ''
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column, _id } = stort.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id
          }
          if (imageId) {
            newPost.image = imageId
          }

          stort.dispatch('createPost', newPost).then(() => {
            createMessage('發表成功 2秒後跳轉文章', 'success')
            setTimeout(() => {
              router.push(`/column/${column}`)
            }, 2000)
          })
        }
      }
    }
    const handleFileChange = (e: Event) => {
      const targer = e.target as HTMLInputElement
      const files = targer.files
      if (files) {
        const uploadedFile = files[0]
        const formData = new FormData()
        formData.append(uploadedFile.name, uploadedFile)
        axios
          .post('/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((resp) => {
            console.log(resp)
          })
      }
    }
    const uploadCheck = (file: File) => {
      const { passed, error } = beforeUploadCheck(file, { format: ['image/jpeg'], size: 1 })
      if (error === 'format') {
        createMessage('上傳圖片只能是JPG/PNG 格式', 'error')
      }
      if (error === 'size') {
        createMessage('上傳圖片大小不能超過 1MB', 'error')
      }
      return passed
    }
    return {
      titleVal,
      titleRules,
      contentVal,
      contentRules,
      onFormSubmit,
      handleFileChange,
      uploadCheck,
      handleFileUploaded
    }
  }
})
</script>
<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
  overflow: hidden;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.uploaded-area {
  position: relative;
}
.uploaded-area:hover h3 {
  display: block;
}
.uploaded-area h3 {
  display: none;
  position: absolute;
  color: #999;
  text-align: center;
  width: 100%;
  top: 50%;
}
</style>
