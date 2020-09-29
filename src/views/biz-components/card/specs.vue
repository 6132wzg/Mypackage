<template>
  <st-link
    :value="value"
    :disabled="list.length <= 1"
    @click="onShowSpecs"
  ></st-link>
</template>
<script>
import CardSpecsModal from '@/views/biz-modals/card/specs'
export default {
  modals: {
    CardSpecsModal
  },
  props: {
    title: {
      type: String,
      default: '规格'
    },
    value: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    onShowSpecs() {
      const { title, list } = this
      this.$modalRouter.push({
        name: 'card-specs-modal',
        props: {
          title,
          list
        }
      })
    }
  }
}
</script>
