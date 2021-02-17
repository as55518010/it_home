<template>
  <div class="file-upload">
    <div class="file-upload-container" @click.prevent="triggerUpload" v-bind="$attrs">
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上傳中...</button>
      </slot>
      <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
        <button class="btn btn-primary" disabled>上傳成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary" disabled>點擊上傳</button>
      </slot>
    </div>
    <input type="file" class="file-input d-none" ref="fileInput" @change="handleFileChange"/>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent, PropType, ref } from 'vue'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error';
type CheckFunction = (file: File) => boolean
export default defineComponent({
  props: {
    action: {
      type: String,
      required: true
    },
    beforUpload: {
      type: Function as PropType<CheckFunction>
    }
  },
  inheritAttrs: false,
  emits: ['file-uploaded', 'file-uploaded-error'],
  setup (props, context) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const fileStatus = ref<UploadStatus>('ready')
    const uploadedData = ref()
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    const handleFileChange = (e: Event) => {
      const currentTarger = e.target as HTMLInputElement
      if (currentTarger.files) {
        const files = Array.from(currentTarger.files)
        if (props.beforUpload) {
          const result = props.beforUpload(files[0])
          if (!result) {
            return
          }
        }
        fileStatus.value = 'loading'
        const formData = new FormData()
        formData.append('file', files[0])
        axios.post(props.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(resp => {
          fileStatus.value = 'success'
          uploadedData.value = resp.data
          context.emit('file-uploaded', resp.data)
        }).catch((error) => {
          fileStatus.value = 'error'
          context.emit('file-uploaded-error', { error })
        }).finally(() => {
          if (fileInput.value) {
            fileInput.value.value = ''
          }
        })
      }
    }
    return {
      fileInput,
      triggerUpload,
      fileStatus,
      handleFileChange,
      uploadedData
    }
  }
})
</script>
