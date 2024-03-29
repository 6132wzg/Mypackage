<template>
  <div :class="all()">
    <portal to="SHOP_PRODUCT_CARD_MEMBER_KEYWORDS_SEARCH">
      <st-input-search
        v-model="$searchQuery.card_name"
        @search="onKeywordsSearch('card_name', $event)"
        :placeholder="`请输入${$c('member_card')}名称查找`"
        maxlength="50"
      />
    </portal>
    <div :class="all('search')">
      <router-link v-if="auth.add" to="../add-select">
        <st-button type="primary" icon="add">
          新增{{ $c('member_card') }}
        </st-button>
      </router-link>
      <div>
        <a-select
          :class="all('search__select')"
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
          class="mg-r8"
          v-model="$searchQuery.shelf_status"
          @change="onSingleSearch('shelf_status', $event)"
        >
          <a-select-option
            v-for="(item, index) in shelfStatus"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
        <a-select
          style="width: 160px"
          class="mg-r8"
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
        <a-select
          style="width: 160px"
          v-model="$searchQuery.card_number_type"
          :options="cardNumberTypeOptions"
          @change="onSingleSearch('support_member_num', $event)"
        ></a-select>
      </div>
    </div>
    <st-table
      :scroll="{ x: 1300 }"
      :page="page"
      :columns="columns"
      @change="onTableChange"
      :loading="loading.getList"
      :dataSource="list"
      rowKey="id"
    >
      <!-- 卡名称 -->
      <template slot="card_name" slot-scope="text, record">
        <st-link
          :value="text"
          :disabled="!record.auth['shop:product:member_card|get']"
          @click="goToCardInfo(record)"
        ></st-link>
      </template>
      <!-- 卡类型 -->
      <template slot="card_type" slot-scope="text">{{ text.name }}</template>
      <!-- 有效期/有效次数 -->
      <template slot="time_gradient" slot-scope="text">{{ text }}</template>
      <!-- 售卖价格 -->
      <template slot="price_gradient" slot-scope="text, record">
        <card-specs
          :value="record.price_gradients.name"
          :list="record.price_gradients.list"
        />
      </template>
      <!-- 支持入场门店 -->
      <template slot="admission_range" slot-scope="text, record">
        <a
          v-if="text.id === ADMISSION_RANGE.GENERAL_STORE"
          v-modal-link="{
            name: 'card-shop-member-shop-table',
            props: { id: record.id, type: 'Sale', title: '支持入场门店' }
          }"
        >
          {{ text.name }}
        </a>
        <span v-else class="use_num">{{ text.name }}</span>
      </template>
      <!-- 支持售卖门店 -->
      <template slot="support_sales" slot-scope="text, record">
        <a
          v-if="text.is_clickable"
          v-modal-link="{
            name: 'card-shop-member-shop-table',
            props: { id: record.id, type: 'Consume', title: '支持售卖门店' }
          }"
        >
          {{ text.name }}
        </a>
        <span v-else class="use_num">{{ text.name }}</span>
      </template>
      <!-- 支持售卖时间 -->
      <template slot="sell_time" slot-scope="text, record">
        <span class="word-break">
          {{ record.start_time }} ~ {{ record.end_time }}
        </span>
      </template>
      <!-- 定价方式 -->
      <template slot="price_setting" slot-scope="text">
        {{ text.name }}
      </template>
      <!-- 发布渠道 -->
      <template slot="publish_channel" slot-scope="text">
        {{ text.name }}
      </template>
      <!-- 上架状态 -->
      <template slot="shelf_status" slot-scope="text">{{ text.name }}</template>
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
            操作人：{{ record.stop_sale.operator_name }} 操作时间：{{
              record.stop_sale.stop_time
            }}
          </span>
          <span slot="content">{{ record.stop_sale.stop_reason }}</span>
        </st-help-popover>
      </template>
      <!-- 操作 -->
      <div slot="action" slot-scope="text, record">
        <st-table-actions>
          <a
            v-if="record.auth['shop:product:member_card|get']"
            @click="goToCardInfo(record)"
          >
            详情
          </a>
          <a
            v-if="record.auth['shop:product:member_card|edit']"
            @click="onEdit(record)"
          >
            编辑
          </a>
          <a
            v-if="record.auth['shop:product:member_card|up']"
            @click="onShelf(record)"
          >
            上架
          </a>
          <a
            v-if="record.auth['shop:product:member_card|pause']"
            @click="onStopSale(record)"
          >
            停售
          </a>
          <a
            v-if="record.auth['shop:product:member_card|restore']"
            @click="onRecoverSale(record)"
          >
            恢复售卖
          </a>
          <a
            v-if="record.auth['shop:product:member_card|del']"
            @click="onDelete(record)"
          >
            删除
          </a>
          <a
            v-if="record.auth['shop:product:member_card|sync_rights']"
            @click="
              soldMemberCardActions.onUpdateRights(record.id, {
                isSync: true
              })
            "
          >
            修改售出权益
          </a>
        </st-table-actions>
      </div>
    </st-table>
  </div>
</template>
<script>
import { columns, CARD_TYPE } from './all.config.ts'
import { AllService } from './all.service'
import tableMixin from '@/mixins/table.mixin'
import CardShopMemberRecoverSale from '@/views/biz-modals/card/shop-member/recover-sale'
import CardShopMemberShelf from '@/views/biz-modals/card/shop-member/shelf'
import CardShopMemberShopTable from '@/views/biz-modals/card/shop-member/shop-table'
import CardShopMemberStopSale from '@/views/biz-modals/card/shop-member/stop-sale'
import CardSpecs from '@/views/biz-components/card/specs'
import soldMemberCardActions from '@/hooks/sold/member-card-actions.hook'
import {
  ADMISSION_RANGE,
  SUPPORT_SALES,
  SELL_STATUS,
  PUBLISH_CHANNEL
} from '@/constants/card/member'
export default {
  mixins: [tableMixin],
  name: 'PageShopProductMemberAll',
  bem: {
    all: 'page-shop-product-member-list-all'
  },
  components: {
    CardSpecs
  },
  modals: {
    CardShopMemberRecoverSale,
    CardShopMemberShelf,
    CardShopMemberShopTable,
    CardShopMemberStopSale
  },
  serviceInject() {
    return {
      allService: AllService
    }
  },
  rxState() {
    return {
      list: this.allService.list$,
      page: this.allService.page$,
      loading: this.allService.loading$,
      publishChannel: this.allService.publishChannel$,
      cardType: this.allService.cardType$,
      sellStatus: this.allService.sellStatus$,
      shelfStatus: this.allService.shelfStatus$,
      cardNumberTypeOptions: this.allService.cardNumberTypeOptions$,
      auth: this.allService.auth$
    }
  },
  computed: {
    columns
  },
  data() {
    return {
      CARD_TYPE,
      ADMISSION_RANGE,
      SUPPORT_SALES,
      SELL_STATUS,
      PUBLISH_CHANNEL
    }
  },
  hooks() {
    return {
      soldMemberCardActions: soldMemberCardActions(this)
    }
  },
  methods: {
    /**
     * 查看详情
     */
    goToCardInfo(record) {
      this.$router.push({
        path: `/shop/product/card/member/${
          CARD_TYPE[record.card_type.id]
        }/info`,
        query: { id: record.id }
      })
    },
    // 上架
    onShelf(record) {
      this.$modalRouter.push({
        name: 'card-shop-member-shelf',
        props: {
          id: record.id,
          title: `上架${this.$c('member_card')}`
        },
        on: {
          success: () => {
            this.$router.push({ query: this.$searchQuery })
          }
        }
      })
    },
    // 编辑
    onEdit(record) {
      const query = {
        id: record.id
      }
      if (record.card_number_type.id === 2) {
        query.type = 'family-card'
      }
      this.$router.push({
        path: `/shop/product/card/member/${
          this.CARD_TYPE[record.card_type.id]
        }/edit`,
        query
      })
    },
    // 停售
    onStopSale(record) {
      this.$modalRouter.push({
        name: 'card-shop-member-stop-sale',
        props: {
          id: +record.id,
          cardType: record.card_type.id,
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
        name: 'card-shop-member-recover-sale',
        props: {
          id: record.id,
          cardType: record.card_type.id,
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
