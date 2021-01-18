<template>
  <div class="container">
    <GlobalHeader :user="currentUser" />
    <ColumnList :list="list" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'

import ColumnList, { ColumnPrpos } from './components/ColumnList.vue'
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'

const currentUser: UserProps = {
  isLogin: true,
  name: 'derrick'
}
const testData: ColumnPrpos[] = [
  {
    id: 1,
    title: 'asdasd',
    description: 'dsads',
    avatar: 'https://avatarfiles.alphacoders.com/218/thumb-218516.jpg'
  },
  {
    id: 2,
    title: 'asdasd',
    description: 'dsads',
    avatar: 'https://avatarfiles.alphacoders.com/105/thumb-105223.jpg'
  },
  {
    id: 3,
    title: 'asdasd',
    description: 'dsads'
    // avatar: 'https://avatarfiles.alphacoders.com/105/thumb-105223.jpg'
  },
  {
    id: 4,
    title: 'asdasd',
    description: 'dsads',
    avatar: 'https://avatarfiles.alphacoders.com/105/thumb-105223.jpg'
  },
  {
    id: 5,
    title: 'asdasd',
    description: 'dsads',
    avatar: 'https://avatarfiles.alphacoders.com/105/thumb-105223.jpg'
  }
]

export default defineComponent({
  name: 'App',
  components: {
    ColumnList,
    GlobalHeader
  },
  setup () {
    return {
      list: testData,
      currentUser
    }
  }
})
</script>
