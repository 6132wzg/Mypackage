<template>
  <div :class="all()">
    <portal to="BRAND_PRODUCT_CARD_DEPOSIT_KEYWORDS_SEARCH">
      <st-input-search
        v-model="$searchQuery.card_name"
        @search="onKeywordsSearch('card_name', $event)"
        placeholder="请输入储值卡名称搜索"
        maxlength="50"
      />
    </portal>
    <div :class="all('search')">
      <router-link v-if="auth.add" to="../add">
        <st-button type="primary" icon="add">新增储值卡</st-button>
      </router-link>
      <div>
        <a-select
          :class="all('search__select')"
          class="mg-r8"
          v-model="$searchQuery.publish_channel"
          @change="onSingleSearch('publish_channel', $event)"
        >
          <a-select-option
            v-for="(item, index) in publishChannel"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
        <a-select
          :class="all('search__select')"
          v-model="$searchQuery.sell_status"
          @change="onSingleSearch('sell_status', $event)"
        >
          <a-select-option
            v-for="(item, index) in sellStatus"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </div>
    </div>
    <st-table
      :scroll="{ x: 1500 }"
      :page="page"
      @change="onTableChange"
      :loading="loading.getList"
      :columns="columns"
      :dataSource="list"
      rowKey="id"
    >
      <!-- 卡名称 -->
      <template slot="card_name" slot-scope="text">
        {{ text }}
      </template>
      <!-- 有效期 -->
      <template slot="num" slot-scope="text, record">
        {{ text }}{{ record.unit | enumFilter('deposit_card.unit') }}
      </template>
      <!-- 储值金额 -->
      <template slot="card_price" slot-scope="text">
        {{ text }}
      </template>
      <!-- 售卖价格 -->
      <template slot="sell_price" slot-scope="text">
        {{ text }}
      </template>
      <!-- 支持售卖门店 -->
      <template slot="support_sales" slot-scope="text, record">
        <a
          v-if="text.id === SUPPORT_SALES.SPECIFIED_STORE"
          v-modal-link="{
            name: 'card-brand-deposit-shop-table',
            props: { id: record.id, type: 'Sale', title: '支持售卖门店' }
          }"
        >
          {{ text.name }}
        </a>
        <span v-else class="use_num">{{ text.name }}</span>
      </template>
      <!-- 支持消费门店 -->
      <template slot="consumption_range" slot-scope="text, record">
        <a
          v-if="text.id === CONSUMPTION_RANGE.GENERAL_STORE"
          v-modal-link="{
            name: 'card-brand-deposit-shop-table',
            props: { id: record.id, type: 'Consume', title: '支持消费门店' }
          }"
        >
          {{ text.name }}
        </a>
        <span v-else class="use_num">{{ text.name }}</span>
      </template>
      <!-- 支持售卖时间 -->
      <template slot="sell_time" slot-scope="text, record">
        {{ record.start_time }}&nbsp;~&nbsp;{{ record.end_time }}
      </template>
      <!-- 上架门店数 -->
      <template slot="upper_lower_num" slot-scope="text, record">
        {{ record.upper_shelf_num }}/{{ record.lower_shelf_num }}
      </template>
      <!-- 发布渠道 -->
      <template slot="publish_channel" slot-scope="text">
        {{ text.name }}
      </template>
      <!-- 售卖状态 -->
      <template slot="sell_status" slot-scope="text, record">
        <st-text
          :status="{
            success: text.id === 1,
            error: text.id === 2
          }"
        >
          {{ text.name }}
        </st-text>
        <st-help-popover v-if="text.id === SELL_STATUS.NO_SELL">
          <span slot="title">
            操作人：{{ record.stop_sale.operator_name }}
            <br />
            操作时间：{{ record.stop_sale.stop_time }}
          </span>
          <span slot="content">
            {{ record.stop_sale.stop_reason }}
          </span>
        </st-help-popover>
      </template>
      <!-- 操作 -->
      <div slot="action" slot-scope="text, record">
        <st-table-actions>
          <router-link
            v-if="record.auth['brand:product:deposit_card|get']"
            :to="{
              path: `/brand/product/card/deposit/info`,
              query: { id: record.id }
            }"
          >
            详情
          </router-link>
          <a
            v-if="record.auth['brand:product:deposit_card|edit']"
            @click="onEdit(record)"
          >
            编辑
          </a>
          <a
            v-if="record.auth['brand:product:deposit_card|up']"
            @click="onShelf(record)"
          >
            上架
          </a>
          <a
            v-if="record.auth['brand:product:deposit_card|pause']"
            @click="onStopSale(record)"
          >
            停售
          </a>
          <a
            v-if="record.auth['brand:product:deposit_card|restore']"
            @click="onRecoverSale(record)"
          >
            恢复售卖
          </a>
          <a
            v-if="record.auth['brand:product:deposit_card|del']"
            @click="onDelete(record)"
          >
            删除
          </a>
        </st-table-actions>
      </div>
    </st-table>
  </div>
</template>
<script>
import { AllService } from './all.service'
import { columns } from './all.config.ts'
import tableMixin from '@/mixins/table.mixin'
import CardBrandDepositRecoverSale from '@/views/biz-modals/card/brand-deposit/recover-sale'
import CardBrandDepositShopTable from '@/views/biz-modals/card/brand-deposit/shop-table'
import CardBrandDepositStopSale from '@/views/biz-modals/card/brand-deposit/stop-sale'
import {
  SUPPORT_SALES,
  CONSUMPTION_RANGE,
  SELL_STATUS
} from '@/constants/card/deposit'
export default {
  mixins: [tableMixin],
  name: 'PageBrandProductDepositAll',
  bem: {
    all: 'page-brand-product-deposit-list-all'
  },
  serviceInject() {
    return {
      allService: AllService
    }
  },
  modals: {
    CardBrandDepositRecoverSale,
    CardBrandDepositShopTable,
    CardBrandDepositStopSale
  },
  rxState() {
    return {
      sellStatus: this.allService.sellStatus$,
      loading: this.allService.loading$,
      publishChannel: this.allService.publishChannel$,
      list: this.allService.list$,
      page: this.allService.page$,
      auth: this.allService.auth$
    }
  },
  data() {
    return {
      SUPPORT_SALES,
      CONSUMPTION_RANGE,
      SELL_STATUS
    }
  },
  computed: {
    columns
  },
  methods: {
    // 编辑
    onEdit(record) {
      this.$router.push({
        path: `/brand/product/card/deposit/edit`,
        query: { id: record.id }
      })
    },
    // 上架
    onShelf(record) {
      this.$confirm({
        title: '上架',
        content: `确认上架${record.card_name}储值卡至${record.wait_shelf_num}家门店？`,
        onOk: () => {
          return this.allService
            .setShelf(record.id)
            .toPromise()
            .then(() => {
              this.$router.reload()
            })
        }
      })
    },
    // 停售
    onStopSale(record) {
      this.$modalRouter.push({
        name: 'card-brand-deposit-stop-sale',
        props: {
          id: +record.id,
          cardName: record.card_name
        },
        on: {
          success: () => {
            this.$router.push({ query: this.$searchQuery })
          }
        }
      })
    },
    // 恢复售卖
    onRecoverSale(record) {
      this.$modalRouter.push({
        name: 'card-brand-deposit-recover-sale',
        props: {
          id: record.id,
          cardName: record.card_name
        },
        on: {
          success: () => {
            this.$router.push({ query: this.$searchQuery })
          }
        }
      })
    },
    // 删除
    onDelete(record) {
      this.$confirm({
        title: '确认要删除',
        content: `确认删除${record.card_name}${this.$c('member_card')}？`,
        onOk: () => {
          return this.allService
            .deleteCard(record.id)
            .toPromise()
            .then(() => {
              this.$router.reload()
            })
        }
      })
    }
  }
}
</script>
