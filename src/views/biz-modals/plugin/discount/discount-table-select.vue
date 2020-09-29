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
          <st-select
            class="mg-r12"
            v-model="searchQuery.activity_status"
            :options="activityStatus"
            @change="onSingleSearch('activity_status', $event)"
          ></st-select>
          <st-input-search
            style="width: 240px"
            @change="onSingleSearch('activity_name', $event.target.value)"
            placeholder="搜索"
          ></st-input-search>
        </template>
      </st-header-actions>
      <st-container>
        <st-table
          rowKey="activity_id"
          :loading="loading.getDiscountList"
          :columns="columns"
          :dataSource="list"
          :page="page"
          :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectionChange,
            getCheckboxProps: record => ({
              props: {
                disabled: record.activity_status === 3
              }
            })
          }"
          :scroll="{ x: 600 }"
          :simplePage="true"
          @change="onTableChange"
        >
          <span slot="product_type" slot-scope="text">
            {{ text | enumFilter('mina_setting.mina_product_type') }}
          </span>
          <span slot="activity_status" slot-scope="text">
            {{ text | enumFilter('limited_time_discount.activity_status') }}
          </span>
        </st-table>
      </st-container>
    </div>
  </st-modal>
</template>

<script>
import { Discountcolumns as columns } from './discount-table-select.config'
import { DiscountTableSelectService } from './discount-table-select.service'
import { MessageService } from '@/services/message.service'
import tableMixin from '@/mixins/table2.mixin'

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
      service: DiscountTableSelectService
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
      console.log('我是新增的限时打折')
      this.service.getDiscountList(this.searchQuery).subscribe()
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
