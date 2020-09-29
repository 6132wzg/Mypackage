<template>
  <st-modal title="使用记录" v-model="show" :footer="false" width="878px">
    <st-table
      :page="page"
      :dataSource="list"
      :loading="loading.getCabinetUseRecord"
      :columns="columns"
      :scroll="{
        x: 830
      }"
      rowKey="id"
      simplePage
      @change="onPageChange"
    >
      <template slot="cabinet_type" slot-scope="text">
        {{ text | enumFilter('cabinet.cabinet_type') }}
      </template>
      <template slot="action_type" slot-scope="text">
        {{ text | enumFilter('cabinet.action_type') }}
      </template>
    </st-table>
  </st-modal>
</template>
<script>
import { MessageService } from '@/services/message.service'
import { UseRecordService } from './use-record.service'
import { columns } from './use-record.config'
import { CABINET_REASONS } from '@/constants/reception/cabinet'
export default {
  name: 'cabinet-use-record',
  serviceInject() {
    return {
      messageService: MessageService,
      useRecordService: UseRecordService
    }
  },
  rxState() {
    return {
      loading: this.useRecordService.loading$,
      page: this.useRecordService.page$,
      list: this.useRecordService.list$
    }
  },
  data() {
    return {
      show: false
    }
  },
  props: {
    cabinet_id: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    columns
  },
  mounted() {
    console.log('useRecordService', this.useRecordService)
    this.useRecordService
      .getCabinetUseRecord({ cabinet_id: this.cabinet_id })
      .subscribe()
  },
  methods: {
    onPageChange(page) {
      this.useRecordService
        .getCabinetUseRecord({
          cabinet_id: this.cabinet_id,
          current_page: page.current,
          size: page.pageSize
        })
        .subscribe()
    }
  }
}
</script>
