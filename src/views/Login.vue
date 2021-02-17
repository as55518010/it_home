<template>
  <validate-form @form-submit="onFormSubmit">
    <div class="mb-3">
      <label for="exampleInputEmail1">郵箱地址</label>
      <validate-input
        v-model="emailVal"
        :rules="emailRules"
        placeholder="請輸入郵箱地址"
        type="test"
      ></validate-input>
    </div>
    <div class="form-group">
      <label for="exampleInputPassword1">密碼</label>
      <validate-input
        type="password"
        v-model="passwordVal"
        :rules="passwordRules"
        placeholder="請輸入密碼"
      ></validate-input>
    </div>
    <template #submit>
      <span class="btn btn-danger">submit</span>
    </template>
  </validate-form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useRouter } from 'vue-router'
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import createMessage from '@/hooks/createMessage'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'

export default defineComponent({
  name: 'App',
  components: {
    ValidateInput,
    ValidateForm
  },
  setup () {
    const router = useRouter()
    const stort = useStore<GlobalDataProps>()
    const emailVal = ref('')
    const passwordVal = ref('')
    const emailRules: RulesProp = [
      { type: 'required', message: '電子信箱不能為空' },
      { type: 'email', message: '請輸入正確電子信箱格式' }
    ]
    const passwordRules: RulesProp = [
      { type: 'required', message: '密碼不能為空' }
    ]
    const emailRef = reactive({
      val: '',
      error: false,
      message: ''
    })
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const payload = {
          email: emailVal.value,
          password: passwordVal.value
        }
        stort.dispatch('loginAndFetch', payload).then(() => {
          createMessage('登入成功 2秒後跳轉首頁', 'success')
          setTimeout(() => {
            router.push('/')
          }, 2000)
        }).catch(e => {
          console.log(e)
        })
      }
    }
    return {
      emailRef,
      emailRules,
      emailVal,
      passwordVal,
      passwordRules,
      onFormSubmit
    }
  }
})
</script>
