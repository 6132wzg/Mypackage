<template>
  <st-modal
    title="任务明细"
    v-model="show"
    :footer="null"
    wrapClassName="scroll-modal"
  >
    <st-table
      rowKey="id"
      :loading="loading.getDetailList"
      :dataSource="list"
      :columns="columns"
      :scroll="{ x: 700, y: 230 }"
      @change="onPageChange"
      :page="page"
      :simplePage="true"
      :class="list.length > 0 ? 'st-scroll-data' : ''"
    >
      <span slot="customTitle">
        {{ task_type === 6 ? '场馆' : '合同编号' }}
      </span>
      <span slot="customName">{{ task_type === 6 ? '场地' : '会员名称' }}</span>
    </st-table>
  </st-modal>
</template>
<script>
import { DetailService } from './detail.service'
import { columns } from './detail.config'
export default {
  name: 'ModalSettingTaskDetail',
  serviceInject() {
    return {
      detailService: DetailService
    }
  },
  rxState() {
    return {
      loading: this.detailService.loading$,
      list: this.detailService.list$,
      page: this.detailService.page$
    }
  },
  computed: {
    columns
  },
  props: {
    task_id: {
      type: [String, Number]
    },
    task_type: {
      type: [String, Number]
    },
    popup_type: {
      type: String
    }
  },
  data() {
    return {
      show: false
    }
  },
  created() {
    this.getDetailList({
      task_id: this.task_id,
      popup_type: this.popup_type,
      size: 10,
      current_page: 1
    })
  },
  methods: {
    getDetailList(query) {
      return this.detailService.getDetailList(query).subscribe()
    },
    onPageChange(data) {
      this.getDetailList({
        task_id: this.task_id,
        popup_type: this.popup_type,
        size: data.pageSize,
        current_page: data.current
      })
    }
  }
}
</script>
