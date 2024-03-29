<template>
  <div :class="shelves()">
    <portal to="BRAND_PRODUCT_CARD_MEMBER_KEYWORDS_SEARCH">
      <st-input-search
        v-model="$searchQuery.card_name"
        @search="onKeywordsSearch('card_name', $event)"
        :placeholder="`请输入${$c('member_card')}名称查找`"
        maxlength="50"
      />
    </portal>
    <div :class="shelves('search')" class="mg-b16">
      <div>
        <a-select
          :class="shelves('search__select')"
          class="mg-r8"
          v-model="$searchQuery.card_type"
          @change="onSingleSearch('card_type', $event)"
        >
          <a-select-option
            v-for="(item, index) in cardType"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
        <a-select
          :class="shelves('search__select')"
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
          :class="shelves('search__select')"
          showSearch
          placeholder="输入门店名称搜索"
          optionFilterProp="children"
          v-model="$searchQuery.shop_id"
          @change="onSingleSearch('shop_id', $event)"
          :filterOption="filterOption"
        >
          <a-select-option :value="-1">所有门店</a-select-option>
          <a-select-option
            v-for="(item, index) in shopList"
            :key="index"
            :value="item.id"
          >
            {{ item.shop_name }}
          </a-select-option>
        </a-select>
      </div>
      <st-button
        type="primary"
        v-if="auth.batchDown"
        :disabled="isSelectedDisabled"
        @click="onBatchShelfDown"
      >
        批量下架
      </st-button>
    </div>
    <st-table
      :scroll="{ x: 1450 }"
      :page="page"
      :alertSelection="{ onReset: onSelectionReset }"
      @change="onTableChange"
      :rowSelection="{ selectedRowKeys, onChange: onSelectionChange }"
      :loading="loading.getShopList"
      :columns="columns"
      :dataSource="list"
      rowKey="shelf_id"
    >
      <!-- 售卖门店 -->
      <template slot="shop_name" slot-scope="text">
        {{ text }}
      </template>
      <!-- 会员卡名称 -->
      <template slot="card_name" slot-scope="text">
        {{ text }}
      </template>
      <!-- 类型 -->
      <template slot="card_type" slot-scope="text">
        {{ text.name }}
      </template>
      <!-- 有效期/有效次数 -->
      <template slot="time_gradient" slot-scope="text">
        {{ text }}
      </template>
      <!-- 支持入场门店 -->
      <template slot="admission_range" slot-scope="text, record">
        <!-- 发布渠道为门店 -->
        <template v-if="record.publish_channel.id === PUBLISH_CHANNEL.SHOP">
          <span class="use_num">{{ record.shop_name }}</span>
        </template>
        <!-- 发布渠道为品牌 -->
        <template v-else>
          <a
            v-if="text.id === ADMISSION_RANGE.GENERAL_STORE"
            v-modal-link="{
              name: 'card-brand-member-shop-table',
              props: { id: record.id, type: 'Consume', title: '支持入场门店' }
            }"
          >
            {{ text.name }}
          </a>
          <span v-else class="use_num">{{ text.name }}</span>
        </template>
      </template>
      <!-- 售卖时间 -->
      <template slot="sell_time" slot-scope="text, record">
        {{ record.start_time }}&nbsp;~&nbsp;{{ record.end_time }}
      </template>
      <!-- 售卖价格 -->
      <template slot="price_gradient" slot-scope="text, record">
        <card-specs
          :value="record.price_gradients.name"
          :list="record.price_gradients.list"
        />
      </template>
      <!-- 发布渠道 -->
      <template slot="publish_channel" slot-scope="text">
        {{ text.name }}
      </template>
      <!-- 操作 -->
      <div slot="action" slot-scope="text, record">
        <st-table-actions>
          <router-link
            v-if="record.auth['brand:product:member_card|get']"
            :to="{
              path: `/brand/product/card/member/${
                CARD_TYPE[record.card_type.id]
              }/info`,
              query: { id: record.id }
            }"
          >
            详情
          </router-link>
          <a
            v-if="record.auth['brand:product:member_card|down']"
            @click="onShelfDown(record)"
          >
            下架
          </a>
          <a
            v-if="record.auth['brand:product:member_card|update']"
            @click="onUpdateShelf(record)"
          >
            变更上架信息
          </a>
        </st-table-actions>
      </div>
    </st-table>
  </div>
</template>
<script>
import { ShelvesService } from './shelves.service'
import { columns, CARD_TYPE } from './shelves.config.ts'
import tableMixin from '@/mixins/table.mixin'
import CardBrandMemberShopTable from '@/views/biz-modals/card/brand-member/shop-table'
import { ADMISSION_RANGE, PUBLISH_CHANNEL } from '@/constants/card/member'
import CardSpecs from '@/views/biz-components/card/specs'
import CardBrandMemberShelf from '@/views/biz-modals/card/brand-member/shelf'
export default {
  mixins: [tableMixin],
  bem: {
    shelves: 'page-brand-product-member-list-shelves'
  },
  components: {
    CardSpecs
  },
  modals: {
    CardBrandMemberShelf,
    CardBrandMemberShopTable
  },
  serviceInject() {
    return {
      shelvesService: ShelvesService
    }
  },
  rxState() {
    return {
      // 服务数据订阅
      publishChannel: this.shelvesService.publishChannel$,
      cardType: this.shelvesService.cardType$,
      auth: this.shelvesService.auth$,
      loading: this.shelvesService.loading$,
      shopList: this.shelvesService.shopList$,
      list: this.shelvesService.list$,
      page: this.shelvesService.page$
    }
  },
  data() {
    return {
      CARD_TYPE,
      ADMISSION_RANGE,
      PUBLISH_CHANNEL
    }
  },
  computed: {
    columns
  },
  methods: {
    // 门店下拉名称搜索
    filterOption(input, option) {
      return option.componentOptions.children[0].text
        .toLowerCase()
        .includes(input)
    },
    // 批量下架
    onBatchShelfDown() {
      let params = []
      this.selectedRows.forEach(i => {
        params.push({
          card_id: i.id,
          shop_id: i.shop_id
        })
      })
      this.$confirm({
        title: '批量下架',
        content: `确定下架所选的${this.selectedRowKeys.length}张${this.$c(
          'member_card'
        )}吗？`,
        onOk: () => {
          return this.shelvesService
            .setCardShelfDown({ card_shop: params })
            .toPromise()
            .then(() => {
              this.onSelectionReset()
              this.$router.push({
                query: { ...this.$searchQuery, current_page: 1 }
              })
            })
        }
      })
    },
    // 单个下架
    onShelfDown(record) {
      this.$confirm({
        title: '单个下架',
        content: `确定下架${record.card_name}${this.$c('member_card')}吗？`,
        onOk: () => {
          return this.shelvesService
            .setCardShelfDown({
              card_shop: [{ card_id: record.id, shop_id: record.shop_id }]
            })
            .toPromise()
            .then(() => {
              this.$router.push({
                query: { ...this.$searchQuery, current_page: 1 }
              })
            })
        }
      })
    },
    // 变更上架
    onUpdateShelf(record) {
      this.$modalRouter.push({
        name: 'card-brand-member-shelf',
        props: {
          title: '变更上架信息',
          id: record.id,
          shelf_id: record.shelf_id,
          actionType: 'updateShelf'
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    }
  }
}
</script>
