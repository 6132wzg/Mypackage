<template>
  <st-panel-layout>
    <div :class="basic('receive-info')">
      <p :class="basic('receive-title')">{{ info.coupon_name }}</p>
      <p :class="basic('receive-tip')">{{ info.use_regulation }}</p>
      <label>{{ info.use_time }}</label>
    </div>
    <st-panel app initial :class="basic()">
      <div slot="title" :class="basic('search')">
        <!-- TODO: 导出 -->
        <!-- <div :class="basic('add')" v-if="auth.export">
          <st-button type="primary" @click="onAddCoupon">导出</st-button>
        </div> -->
        <div>
          <a-select
            :class="basic('select')"
            v-model="queryParams.couponStatus"
            @change="onSearch"
            style="width: 160px"
          >
            <a-select-option :value="-1">全部状态</a-select-option>
            <a-select-option :value="1">未使用</a-select-option>
            <a-select-option :value="2">已使用</a-select-option>
            <a-select-option :value="3">已过期</a-select-option>
            <!-- <a-select-option
              v-for="(item,index) in couponStatus"
              :key="index"
              :value="item.value">{{item.label}}</a-select-option> -->
          </a-select>
          <span class="mg-r8 mg-l16" style="font-weight: normal">领券时间</span>
          <a-range-picker
            @change="onChangeDatePicker"
            v-model="queryParams.date"
          />
        </div>
        <st-input-search
          v-model="queryParams.keyword"
          @search="onSearch"
          placeholder="请输入手机号、姓名"
          style="margin-left: 16px"
        />
      </div>
      <div :class="basic('content')">
        <st-table
          :pagination="{
            current: $searchQuery.page,
            total: page.total_counts,
            pageSize: $searchQuery.size
          }"
          rowKey="id"
          :columns="columns"
          @change="onPageChange"
          :dataSource="list"
        >
          <!-- <template slot="is_shop_range" slot-scope="text, record">
            <a-popover placement="right">
              <template slot="content">
                <p v-for="(item, index) in record.shop_list" :key="index" :value="index">{{item}}</p>
              </template>
              <template slot="title">
                <span>可用门店</span>
              </template>
              <a>{{text}}</a>
            </a-popover>
          </template> -->
        </st-table>
      </div>
    </st-panel>
  </st-panel-layout>
</template>

<script>
import { ReceiveService } from './receive.service'
import { UserService } from '@/services/user.service'
import { cloneDeep } from 'lodash-es'
import { columns } from './receive.config'
import moment from 'moment'
export default {
  name: 'PageBrandMarketingPluginCouponReceive',
  bem: {
    basic: 'page-brand-plugin-coupon'
  },
  serviceInject() {
    return {
      receiveService: ReceiveService,
      userService: UserService
    }
  },
  rxState() {
    return {
      list: this.receiveService.list$,
      page: this.receiveService.page$,
      loading: this.receiveService.loading$,
      info: this.receiveService.info$,
      auth: this.receiveService.auth$
    }
  },
  data() {
    return {
      columns: columns(),
      queryParams: {
        keyword: '',
        couponStatus: -1,
        date: []
      }
    }
  },
  mounted() {
    this.setSearchData()
  },
  watch: {
    query(newVal) {
      this.setSearchData()
    }
  },
  methods: {
    onChangeDatePicker(event) {
      this.queryParams.date = event
      this.onSearch()
    },
    onPageChange(data) {
      this.$router.push({
        query: { ...this.$searchQuery, page: data.current, size: data.pageSize }
      })
    },
    // 查询
    onSearch() {
      let params = {
        id: this.$searchQuery.id,
        coupon_status: this.queryParams.couponStatus || -1,
        keyword: this.queryParams.keyword,
        start_time: this.queryParams.date[0]
          ? moment(this.queryParams.date[0]).format('YYYY-MM-DD 00:00:00')
          : '',
        end_time: this.queryParams.date[1]
          ? moment(this.queryParams.date[1]).format('YYYY-MM-DD 23:59:59')
          : ''
      }
      this.$router.push({ query: { ...this.$searchQuery, ...params } })
    },
    // 重置
    onReset() {
      let query = {
        id: this.$searchQuery.id,
        keyword: '',
        coupon_status: '',
        start_time: '',
        end_time: ''
      }
      this.queryParams.date = []
      this.$router.push({ query: { ...this.$searchQuery, ...query } })
    },
    // 设置searchData
    setSearchData() {
      this.queryParams.keyword = this.$searchQuery.keyword
      this.queryParams.couponStatus = this.$searchQuery.coupon_status
        ? +this.$searchQuery.coupon_status
        : -1
      if (this.$searchQuery.start_time) {
        this.queryParams.date[0] = cloneDeep(
          moment(this.$searchQuery.start_time)
        )
      }
      if (this.$searchQuery.end_time) {
        this.queryParams.date[1] = cloneDeep(moment(this.$searchQuery.end_time))
      }
    },
    // 编辑
    onEdit(record) {
      this.$router.push({
        path: '/brand/marketing/plugin/coupon/add',
        query: { id: record.id }
      })
    },
    // 停止优惠券模板
    onStop(record) {
      this.listService.stopMarketingCoupon(record.id).subscribe(res => {
        this.$router.reload()
      })
    },
    // 新增优惠券活动
    onAddCoupon() {
      this.$router.push({ path: '/brand/marketing/plugin/coupon/add' })
    }
  },
  components: {}
}
</script>
