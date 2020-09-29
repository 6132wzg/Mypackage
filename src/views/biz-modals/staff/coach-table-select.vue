<template>
  <st-modal :title="title" v-model="show" @ok="onSubmit" @cancel="onCancel">
    <div :class="b()">
      <div :class="b('header')">
        <div :class="b('header-warn')" v-if="selectedRowKeys.length > max">
          最多选择{{ max }}项
        </div>
        <div :class="b('header-select')" v-else>
          已选{{ selectedRowKeys.length }}项
        </div>
        <div :class="b('header-filter')">
          <a-select
            class="mg-r16"
            style="width: 145px"
            v-if="isCoachFilter"
            v-model="searchQuery.coach_identity"
            @change="onSingleSearch('coach_identity', $event)"
          >
            <a-select-option :value="-1">全部教练</a-select-option>
            <a-select-option
              v-for="item in coach_type"
              :value="item.value"
              :key="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <st-input-search
            style="width: 240px"
            :class="b('search')"
            @change="onSingleSearch('keywords', $event.target.value)"
            placeholder="搜索"
          ></st-input-search>
        </div>
      </div>
      <div :class="b('body')">
        <st-table
          rowKey="id"
          :loading="loading.getCoachList"
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
          <template slot="identity" slot-scope="text, record">
            <template v-for="item in record.identity">
              <span :key="item.id" class="mg-r8">{{ item.name }}</span>
            </template>
          </template>
          <template slot="shop" slot-scope="text, record">
            <a-tooltip>
              <template slot="title">
                {{ record.shop.map(i => i.name).join(', ') }}
              </template>
              <span :class="b('more-shop')">
                {{ record.shop.map(i => i.name).join(',') }}
              </span>
            </a-tooltip>
          </template>
        </st-table>
      </div>
    </div>
  </st-modal>
</template>

<script>
import { Coachcolumns as columns } from './coach-table-select.config'
import { CoachTableSelectService } from './coach-table-select.service'
import { MessageService } from '@/services/message.service'
import tableMixin from '@/mixins/table2.mixin'
import moment from 'moment'

export default {
  mixins: [tableMixin],
  bem: {
    b: 'coach-table-select'
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
    },
    // 是否使用教练过滤条件
    isCoachFilter: {
      type: Boolean,
      default: true
    }
  },

  serviceInject() {
    return {
      messageService: MessageService,
      service: CoachTableSelectService
    }
  },
  rxState() {
    return {
      loading: this.service.loading$,
      list: this.service.list$,
      page: this.service.page$,
      coach_type: this.service.coach_type$
    }
  },

  data() {
    return {
      show: false,
      customQuery: {
        coach_identity: -1
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
      console.log('我是新的教练风采')
      this.service.getCoachList(this.searchQuery).subscribe()
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
