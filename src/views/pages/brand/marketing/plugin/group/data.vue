<template>
  <st-panel-layout :class="activities()">
    <st-panel class="mg-b12">
      <!-- 这里是动态 -->
      <st-t2>{{ info.activity_name }}</st-t2>
      <div :class="activities('desc')">
        <p :class="activities('activity')">活动商品：{{ info.product_name }}</p>
        <p :class="activities('activity')">
          活动时间：{{ info.start_time }}~{{ info.end_time }}
        </p>
      </div>
    </st-panel>
    <st-panel app>
      <div :class="activities('block')">
        <a-row :class="activities('acount')">
          <a-col :span="4">
            <p :class="activities('acount-title')">
              开团数
              <st-help-tooltip id="TBPTSJ001" />
            </p>
            <p class="number-up font-number">
              {{ collect.group_total }}
            </p>
          </a-col>
          <a-col :span="4">
            <p :class="activities('acount-title')">
              成团数
              <st-help-tooltip id="TBPTSJ002" />
            </p>
            <p class="number-up font-number">
              {{ collect.group_success_total }}
            </p>
          </a-col>
          <a-col :span="4">
            <p :class="activities('acount-title')">
              参与人数
              <st-help-tooltip id="TBPTSJ003" />
            </p>
            <p class="number-up font-number">
              {{ collect.join_total }}
            </p>
          </a-col>
          <a-col :span="4">
            <p :class="activities('acount-title')">
              新用户数
              <st-help-tooltip id="TBPTSJ004" />
            </p>
            <p class="number-up font-number">
              {{ collect.new_total }}
            </p>
          </a-col>
          <a-col :span="4">
            <p :class="activities('acount-title')">
              成单数
              <st-help-tooltip id="TBPTSJ005" />
            </p>
            <p class="number-up font-number">
              {{ collect.success_order_total }}
            </p>
          </a-col>
          <a-col :span="4">
            <p :class="activities('acount-title')">
              成交金额
              <st-help-tooltip id="TBPTSJ006" />
            </p>
            <p class="number-up font-number">
              {{ collect.success_amount_total }}
            </p>
          </a-col>
        </a-row>
      </div>
      <div :class="activities('search')">
        <a-select
          :class="activities('select')"
          v-model="groupStatus"
          placeholder="活动状态"
          @change="onSingleSearch('group_status', $event)"
          style="width: 130px"
        >
          <a-select-option v-for="item in groupStatusEnums" :key="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
        <st-input-search
          v-model="searchWhere"
          @search="onSingleSearch('search_where', $event)"
          placeholder="请输入会员名或手机号"
          maxlength="50"
        />
      </div>
      <st-table
        rowKey="id"
        :page="page"
        :columns="columns"
        :scroll="{ x: 1240 }"
        :dataSource="list"
        @change="onTableChange"
      ></st-table>
    </st-panel>
  </st-panel-layout>
</template>
<script>
import { UserService } from '@/services/user.service'
import { DataService } from './data.service.ts'
import { columns } from './data.config.ts'
import { State, Effect } from 'rx-state'
import tableMixin from '@/mixins/table.mixin'
import Header from '../lottery/info/components#/header'
let Color = ''
export default {
  name: 'PageBrandMarketingPluginGroupListData',
  bem: {
    activities: 'brand-marketing-plugin-group-data'
  },
  mixins: [tableMixin],
  serviceInject() {
    return {
      dataService: DataService,
      userService: UserService
    }
  },
  rxState() {
    return {
      list: this.dataService.list$,
      page: this.dataService.page$,
      collect: this.dataService.collect$,
      loading: this.dataService.loading$,
      info: this.dataService.info$,
      groupStatusEnums: this.dataService.groupStatusEnums$
    }
  },
  data() {
    return {
      showList: [],
      flag: true,
      searchWhere: '',
      groupStatus: -1,
      columns
    }
  },
  watch: {
    $searchQuery(newVal) {
      this.setSearchData()
    }
  },
  mounted() {
    this.setSearchData()
  },
  methods: {
    setSearchData() {
      let { search_where, group_status } = this.$searchQuery
      this.searchWhere = search_where
      this.groupStatus = group_status || -1
    },
    rowClassName(record, index) {
      let id = record && record.id
      let has = this.showList.includes(id)
      let className = ''
      if (index % 2 !== 0) {
        className = has ? 'evengb shadow' : 'evengb'
      } else {
        className = has ? 'shadow' : ''
      }
      if (record && record.children) {
        Color = className
        return className
      } else {
        let name = Color
        return name.indexOf('shadow') === -1 ? name : name.replace('shadow', '')
      }
    },
    onShow(list) {
      this.showList = list
      this.rowClassName()
    }
  }
}
</script>
