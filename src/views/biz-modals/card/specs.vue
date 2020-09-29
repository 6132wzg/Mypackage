<template>
  <st-modal
    :title="title"
    v-model="show"
    :footer="null"
    wrapClassName="scroll-modal"
  >
    <st-table
      rowKey="key"
      :dataSource="list"
      :columns="columns"
      :scroll="{ y: 230 }"
      :page="false"
    />
  </st-modal>
</template>
<script>
import { columns } from './specs.config'
export default {
  computed: {
    columns,
    title() {
      return `共${this.list.length}个规格`
    }
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      show: false
    }
  }
}
</script>
