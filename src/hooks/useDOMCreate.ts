import { onUnmounted } from 'vue'

const useDOMCreate = (nodeId: string) => {
  // 創建MOD
  const node = document.createElement('div')
  node.id = nodeId
  document.body.appendChild(node)
  // 卸載DOM
  onUnmounted(() => {
    document.body.removeChild(node)
  })
}

export default useDOMCreate
