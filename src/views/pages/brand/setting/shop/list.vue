<template>
  <st-panel app>
    <a-row class="mg-b16">
      <a-col :span="8">
        <router-link to="./add">
          <st-button v-if="auth.add" type="primary" icon="add">
            新增门店
          </st-button>
        </router-link>
        <span class="st-des mg-l8">
          （已开店{{ count.count_opened }}家门店/可开店{{
            count.count_can_opened
          }}家门店）
        </span>
      </a-col>
      <a-col :span="16" class="ta-r">
        <a-select
          style="width: 160px"
          class="mg-r8"
          v-model="$searchQuery.shop_status"
          @change="onSingleSearch('shop_status', $event)"
        >
          <a-select-option
            v-for="(item, index) in shopStatusList"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
        <a-select
          style="width: 160px"
          v-model="$searchQuery.is_valid"
          @change="onSingleSearch('is_valid', $event)"
        >
          <a-select-option
            v-for="(item, index) in isValidList"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <st-table
      :page="page"
      @change="onTableChange"
      :loading="loading.getList"
      :columns="columns"
      :dataSource="list"
      rowKey="shop_id"
    >
      <!-- 运营状态 -->
      <template slot="shop_status" slot-scope="text, record">
        {{ record.shop_status | enumFilter('shop.shop_status') }}
        <st-help-popover v-if="record.has_holiday_setting" title="放假时间">
          <div slot="content">
            {{
              record.holiday_start_time
                | dateFilter(appConfig.DATE_FORMAT.datetime)
            }}
            <br />
            {{
              record.holiday_end_time
                | dateFilter(appConfig.DATE_FORMAT.datetime)
            }}
          </div>
        </st-help-popover>
      </template>
      <!-- 系统状态 -->
      <template slot="is_valid" slot-scope="text">
        <st-text
          :status="{
            success: text === 1,
            error: text === 0
          }"
        >
          {{ text | enumFilter('shop.is_valid') }}
        </st-text>
      </template>
      <!-- 操作 -->
      <div slot="action" slot-scope="text, record">
        <st-table-actions>
          <router-link
            v-if="record.auth['brand:shop:shop|get']"
            :to="`./info?id=${record.shop_id}`"
          >
            详情
          </router-link>
          <router-link
            v-if="record.auth['brand:shop:shop|edit']"
            :to="`./edit?id=${record.shop_id}`"
          >
            编辑
          </router-link>
          <a
            v-if="record.auth['brand:shop:shop_type|edit']"
            v-modal-link="{
              name: 'brand-setting-shop-status',
              props: {
                shopId: record.shop_id,
                shopName: record.shop_name,
                shopStatus: record.shop_status
              },
              on: {
                change: onListChange
              }
            }"
          >
            更改运营状态
          </a>
          <a
            v-if="record.auth['brand_shop:shop:shop_holiday|edit']"
            v-modal-link="{
              name: 'brand-setting-shop-holiday',
              props: {
                shopId: record.shop_id,
                shopName: record.shop_name,
                shopStatus: record.shop_status,
                isHoliday: record.has_holiday_setting,
                holidayTime: {
                  start: record.holiday_start_time,
                  end: record.holiday_end_time
                }
              },
              on: {
                change: onListChange
              }
            }"
          >
            {{ record.has_holiday_setting ? '管理' : '' }}门店放假
          </a>
        </st-table-actions>
      </div>
    </st-table>
  </st-panel>
</template>
<script>
import { ListService } from './list.service'
import { columns } from './list.config.ts'
import { dateFilter } from '@/filters/date.filters'
import tableMixin from '@/mixins/table.mixin'
import { AppConfig } from '@/constants/config'
import BrandSettingShopHoliday from '@/views/biz-modals/brand/setting/shop/holiday'
import BrandSettingShopStatus from '@/views/biz-modals/brand/setting/shop/status'
export default {
  mixins: [tableMixin],
  name: 'PageBrandSettingShopList',
  serviceInject() {
    return {
      appConfig: AppConfig,
      listService: ListService
    }
  },
  rxState() {
    return {
      loading: this.listService.loading$,
      list: this.listService.list$,
      page: this.listService.page$,
      count: this.listService.count$,
      auth: this.listService.auth$,
      shopStatusList: this.listService.shopStatusList$,
      isValidList: this.listService.isValidList$
    }
  },
  filters: {
    dateFilter
  },
  modals: {
    BrandSettingShopHoliday,
    BrandSettingShopStatus
  },
  computed: {
    columns
  },
  methods: {
    onListChange() {
      this.$router.push({ query: this.$searchQuery })
    }
  }
}
</script>
