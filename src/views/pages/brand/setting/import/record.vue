<template>
  <st-panel app :class="b()">
    <div class="page-header">
      <st-t2>
        导入记录
      </st-t2>
      <div class="row-tip-btn">
        <st-refresh-btn :action="refresh" />
      </div>
    </div>
    <st-table
      :page="page"
      @change="onTableChange"
      :loading="loading.getList"
      :columns="columns"
      :dataSource="list"
      rowKey="id"
    >
      <template slot="excel_operate_status" slot-scope="text, record">
        <span
          :class="{
            import: record.excel_operate_status.id === IMPORT_STATUS.IMPORTING,
            error: record.excel_operate_status.id === IMPORT_STATUS.ERROR
          }"
        >
          {{ record.excel_operate_status.name }}
        </span>
        <st-help-popover
          v-if="
            record.excel_operate_status.id === 3 &&
              record.excel_operate_status.content
          "
        >
          <span slot="content">{{ record.excel_operate_status.content }}</span>
        </st-help-popover>
      </template>
      <template slot="import_type" slot-scope="text, record">
        <span>{{ record.import_type.name }}</span>
      </template>
      <template slot="input_error_num" slot-scope="text, record">
        <span>{{ text }}</span>
        <a
          v-if="record.input_error_num > 0"
          @click="downloadErrorData(record.input_file_error_resource)"
        >
          下载错误数据
        </a>
      </template>
    </st-table>
  </st-panel>
</template>
<script>
import { RecordService } from './record.service'
import { MessageService } from '@/services/message.service'
import tableMixin from '@/mixins/table.mixin'
import { columns } from './record.config.ts'
import { IMPORT_STATUS } from '@/constants/setting/import'
export default {
  bem: {
    b: 'page-setting-record'
  },
  mixins: [tableMixin],
  serviceInject() {
    return {
      recordService: RecordService,
      messageService: MessageService
    }
  },
  rxState() {
    return {
      list: this.recordService.list$,
      page: this.recordService.page$,
      loading: this.recordService.loading$
    }
  },
  data() {
    return {
      IMPORT_STATUS
    }
  },
  computed: {
    columns
  },
  methods: {
    downloadErrorData(url) {
      window.open(url)
    },
    getList() {
      this.$router.reload()
    },
    refresh() {
      return this.recordService.getList()
    }
  }
}
</script>
