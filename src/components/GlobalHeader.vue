<template>
  <nav class="navbar navbar-dark bg-primary justifly-content-between mb-4 px-4">
    <a class="navbar-brand" href="#">IT HOME</a>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><a href="#" class="btn btn-outline-light my-2">登入</a></li>
      <li class="list-inline-item"><a href="#" class="btn btn-outline-light my-2">註冊</a></li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <Dropdown :title="`你好${user.name}`">
          <DropdownItem><a class="dropdown-item" href="#">新建文章</a></DropdownItem>
          <DropdownItem :disabled="true"><a class="dropdown-item" href="#">編輯資料</a></DropdownItem>
          <DropdownItem><a class="dropdown-item" href="#">退出登入</a></DropdownItem>
        </Dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
export interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
}

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
  }
})
</script>
