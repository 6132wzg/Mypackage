<template>
  <st-modal :title="title" v-model="show" @ok="onSubmit" @cancel="onCancel">
    <div>
      <st-header-actions type="small">
        <template slot="left">
          <div class="color-danger" v-if="selectedRowKeys.length > max">
            最多选择{{ max }}项
          </div>
          <div v-else>已选{{ selectedRowKeys.length }}项</div>
        </template>
        <template slot="right">
          <st-input-search
            style="width: 240px"
            @change="onSingleSearch('keywords', $event.target.value)"
            placeholder="搜索"
          ></st-input-search>
        </template>
      </st-header-actions>
      <st-container>
        <st-table
          rowKey="activity_id"
          :loading="loading.getWheelList"
          :columns="columns"
          :dataSource="list"
          :page="page"
          :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectionChange
          }"
          :scroll="{ x: 600 }"
          :simplePage="true"
          @change="onTableChange"
        >
          <template slot="activity_time" slot-scope="text, record">
            {{ record.activity_start_time }}~{{ record.activity_end_time }}
          </template>
        </st-table>
      </st-container>
    </div>
  </st-modal>
</template>

<script>
import { Wheelcolumns as columns } from './lucky-wheel-table-select.config'
import { LuckyWheelTableSelectService } from './lucky-wheel-table-select.service'
import { MessageService } from '@/services/message.service'
import tableMixin from '@/mixins/table2.mixin'
import moment from 'moment'

export default {
  mixins: [tableMixin],
  bem: {
    b: 'custom-decorate-product-table-select'
  },
  props: {
    title: {
      type: String
    },
    /**
     * 最大选择数量
     */
    max: {
      type: Number,
      default: 10
    }
  },

  serviceInject() {
    return {
      messageService: MessageService,
      service: LuckyWheelTableSelectService
    }
  },
  rxState() {
    return {
      loading: this.service.loading$,
      list: this.service.list$,
      page: this.service.page$,
      activityStatus: this.service.activityStatus$
    }
  },

  data() {
    return {
      show: false
    }
  },
  computed: {
    columns
  },
  mounted() {
    this.init()
  },
  methods: {
    moment,
    getList() {
      console.log('我是新的大转盘')
      this.service.getWheelList(this.searchQuery).subscribe()
    },
    onSubmit() {
      const data = {
        selected: this.selectedRowKeys,
        selectedRows: this.selectedRows || []
      }
      if (this.handlerValidate && !this.handlerValidate(data)) return
      this.show = false
      console.log('complete', data)
      this.handlerSubmit && this.handlerSubmit(data)
      this.$emit('complete', data)
    },
    onCancel() {
      this.show = false
    },
    handlerValidate() {
      if (this.selectedRowKeys.length > this.max) {
        this.messageService.error({
          content: '当前数量已达上限，请在删除后重新添加'
        })
        return false
      }
      return true
    }
  }
}
</script>
