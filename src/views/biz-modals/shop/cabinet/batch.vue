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
import { Modal } from 'ant-design-vue'
import { BATCH_TYPE } from '@/constants/common/batch-operation'
import { BatchService } from './batch.service'
import { MessageService } from '@/services/message.service'
export default {
  name: 'cabinet-batch',
  serviceInject() {
    return {
      cabinetService: BatchService,
      messageService: MessageService
    }
  },
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
      default: () => []
    },
    searchQuery: {
      type: Object,
      default: () => {}
    },
    total: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: '批量操作'
    },
    useType: {
      type: String,
      default: ''
    }
  },
  methods: {
    /**
     * 批量删除储物柜
     */
    onCabinetBatchDel() {
      // 删除柜子的二次确认
      let count = this.ids.length
      if (this.batch_type === 2) {
        count = this.total
      }
      this.$confirm({
        title: '确认删柜',
        content: `当前选中共${count}个柜子，请问确认进行删柜操作？`,
        icon: h => {
          return h('st-icon', {
            attrs: {
              type: 'question',
              size: '22px'
            },
            style: {
              display: 'inline-block',
              float: 'left',
              marginRight: '16px'
            }
          })
        },
        onOk: () => {
          this.cabinetService
            .del({
              ids: this.batch_type === 2 ? [] : this.ids,
              batch_type: this.batch_type,
              cabinet_type: this.$searchQuery.type === 'temporary' ? 2 : 1,
              cabinet_area_id: this.$searchQuery.id,
              keywords: this.$searchQuery.keywords,
              battery: this.$searchQuery.battery,
              cabinet_business_type: this.$searchQuery.cabinet_business_type
            })
            .subscribe(res => {
              Modal.destroyAll()
              this.show = false
              this.messageService.success({
                content: '删除成功'
              })
              this.$emit('success')
            })
        }
      })
    },
    /**
     * 批量清柜
     */
    onCabinetBatchClean() {
      let count = this.ids.length
      if (this.batch_type === 2) {
        count = this.total
      }
      this.$confirm({
        title: '确认清柜',
        content: `当前选中共${count}个柜子，请问确认进行清柜操作？`,
        icon: h => {
          return h('st-icon', {
            attrs: {
              type: 'question',
              size: '22px'
            },
            style: {
              display: 'inline-block',
              float: 'left',
              marginRight: '16px'
            }
          })
        },
        onOk: res => {
          this.cabinetService
            .clearCabinet({
              cabinet_ids: this.batch_type === 2 ? [] : this.ids,
              batch_type: this.batch_type,
              ...this.searchQuery
            })
            .subscribe(res => {
              Modal.destroyAll()
              this.show = false
              this.messageService.success({
                content: '批量清柜成功!'
              })
              this.$emit('success')
            })
        }
      })
    },
    onSubmit(e) {
      e.preventDefault()
      switch (this.useType) {
        case 'del':
          this.onCabinetBatchDel()
          break
        case 'clear':
          this.onCabinetBatchClean()
          break
      }
    },
    onCancel() {
      this.show = false
    }
  }
}
</script>
