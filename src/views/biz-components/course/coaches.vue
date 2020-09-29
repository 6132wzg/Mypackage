<template>
  <!-- 上课教练 -->
  <a-popover title="上课教练" trigger="click">
    <template slot="content">
      <div>{{ list.join('、') }}</div>
    </template>
    <st-link :disabled="disabled" :value="text"></st-link>
  </a-popover>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    disabled() {
      return this.list.length <= 1
    },
    text() {
      const { list } = this
      return list.length <= 1 ? list[0] || '' : `共${list.length}人`
    }
  }
}
</script>
