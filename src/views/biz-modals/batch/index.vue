<template>
  <st-modal
    :title="title"
    size="small"
    v-model="show"
    @ok="onSubmit"
    @cancel="onCancel"
  >
    <st-form labelWidth="80px">
      <st-form-item label="选择" required>
        <st-batch-select-radio
          :ids="ids"
          v-model="batch_type"
          :total="total"
        ></st-batch-select-radio>
      </st-form-item>
    </st-form>
  </st-modal>
</template>
<script>
import { BATCH_TYPE } from '@/constants/common/batch-operation'
export default {
  name: 'batch-modal',
  data() {
    return {
      show: false,
      BATCH_TYPE,
      batch_type: BATCH_TYPE.SELECTED
    }
  },
  props: {
    ids: {
      type: Array,
      default() {
        return []
      }
    },
    total: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: '批量操作'
    },
    batchShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onSubmit(e) {
      e.preventDefault()
      this.$emit('success', {
        batch_type: this.batch_type
      })
    },
    onCancel() {
      this.show = false
    }
  }
}
</script>
