<template>
  <li class="dropdown-option" :class="{ 'is-disabled': disabled }">
    <slot ></slot>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'DropdownItem',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    console.log(props)
  }
})
</script>

<style>
.dropdown-option.is-disabled * {
  color: #6c757d;
  pointer-events: none;
  background-color: transparent;
}
</style>
