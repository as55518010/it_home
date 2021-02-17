<template>
  <nav class="navbar navbar-dark bg-primary justifly-content-between mb-4 px-4">
    <router-link to="/" class="navbar-brand">IT HOME</router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登入</router-link></li>
      <li class="list-inline-item"><router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link></li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <Dropdown :title="`你好${user.nickName}`">
          <DropdownItem><router-link class="dropdown-item" to="create">新建文章</router-link></DropdownItem>
          <DropdownItem :disabled="true"><a class="dropdown-item" href="#">編輯資料</a></DropdownItem>
          <DropdownItem><a class="dropdown-item" href="#" @click="logout">退出登入</a></DropdownItem>
        </Dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
import store, { UserProps } from '@/store'
import router from '@/router'
import createMessage from '@/hooks/createMessage'

export default defineComponent({
  name: 'GlobalHeader',
  components: {
    Dropdown,
    DropdownItem
  },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup () {
    const logout = () => {
      store.commit('logout')
      createMessage('登出成功 2秒後跳轉首頁', 'success')
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
    return {
      logout
    }
  }
})
</script>
