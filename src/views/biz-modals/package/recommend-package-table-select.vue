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
          <a-select
            class="mg-r16"
            style="width: 145px"
            v-model="searchQuery.type"
            @change="onSingleSearch('type', $event)"
          >
            <a-select-option :value="-1">全部课程包</a-select-option>
            <a-select-option
              v-for="item in package_type"
              :value="item.value"
              :key="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <st-input-search
            style="width: 240px"
            @change="onSingleSearch('keywords', $event.target.value)"
            placeholder="搜索"
          ></st-input-search>
        </template>
      </st-header-actions>
      <st-container>
        <st-table
          rowKey="id"
          :loading="loading.getPackageList"
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
          <template slot="package_type" slot-scope="text">
            {{ text | enumFilter('package_course.package_type') }}
          </template>
        </st-table>
      </st-container>
    </div>
  </st-modal>
</template>

<script>
import { Packagecolumns as columns } from './recommend-package-table-select.config'
import { RecommendPackageTableSelectService } from './recommend-package-table-select.service'
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
      service: RecommendPackageTableSelectService
    }
  },
  rxState() {
    return {
      loading: this.service.loading$,
      list: this.service.list$,
      page: this.service.page$,
      package_type: this.service.package_type$
    }
  },

  data() {
    return {
      show: false,
      customQuery: {
        type: -1
      }
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
      console.log('我是新的推荐课程包')
      this.service.getPackageList(this.searchQuery).subscribe()
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
