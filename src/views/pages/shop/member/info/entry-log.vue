<template>
  <div class="member-info-sold">
    <st-t4>入场记录</st-t4>
    <a-row :gutter="24" class="mg-t16">
      <a-col :lg="24">
        <st-table
          :columns="admission"
          rowKey="id"
          :dataSource="entranceList$"
          @change="onTableChange"
          :page="entrancePage$"
        ></st-table>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { EntryLogService } from './entry-log.service'
import { admission } from './entry-log.config'
import tableMixin from '@/mixins/table.mixin'
export default {
  mixins: [tableMixin],
  serviceInject() {
    return {
      service: EntryLogService
    }
  },
  rxState() {
    const { entranceList$, entrancePage$ } = this.service
    return { entranceList$, entrancePage$ }
  },
  computed: {
    admission
  }
}
</script>
