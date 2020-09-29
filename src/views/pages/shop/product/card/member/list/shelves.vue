<template>
  <div :class="shelves()">
    <portal to="SHOP_PRODUCT_CARD_MEMBER_KEYWORDS_SEARCH">
      <st-input-search
        v-model="$searchQuery.card_name"
        @search="onKeywordsSearch('card_name', $event)"
        :placeholder="`请输入${$c('member_card')}名称查找`"
        maxlength="50"
      />
    </portal>
    <div :class="shelves('search')">
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
    </div>
    <st-table
      :page="page"
      @change="onTableChange"
      :loading="loading.getList"
      :columns="columns"
      :dataSource="list"
      rowKey="id"
    >
      <!-- 会员卡名称 -->
      <template slot="card_name" slot-scope="text, record">
        <st-link
          :value="text"
          :disabled="!record.auth['shop:product:member_card|get']"
          @click="goToCardInfo(record)"
        ></st-link>
      </template>
      <!-- 类型 -->
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
      <!-- 售卖时间 -->
      <template slot="sell_time" slot-scope="text, record">
        <span class="word-break">
          {{ record.start_time }} ~ {{ record.end_time }}
        </span>
      </template>
      <!-- 发布渠道 -->
      <template slot="publish_channel" slot-scope="text">
        {{ text.name }}
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
            v-if="record.auth['shop:product:member_card|down']"
            @click="onShelfDown(record)"
          >
            下架
          </a>
          <a
            v-if="record.auth['shop:product:member_card|update']"
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
import { MessageService } from '@/services/message.service'
import { ShelvesService } from './shelves.service'
import { columns, CARD_TYPE } from './shelves.config.ts'
import tableMixin from '@/mixins/table.mixin'
import CardShopMemberShelf from '@/views/biz-modals/card/shop-member/shelf'
import CardShopMemberShopTable from '@/views/biz-modals/card/shop-member/shop-table'
import { ADMISSION_RANGE } from '@/constants/card/member'
import CardSpecs from '@/views/biz-components/card/specs'
export default {
  mixins: [tableMixin],
  name: 'PageShopProductMemberShelves',
  bem: {
    shelves: 'page-shop-product-member-list-shelves'
  },
  components: {
    CardSpecs
  },
  modals: {
    CardShopMemberShelf,
    CardShopMemberShopTable
  },
  serviceInject() {
    return {
      messageService: MessageService,
      shelvesService: ShelvesService
    }
  },
  rxState() {
    return {
      loading: this.shelvesService.loading$,
      publishChannel: this.shelvesService.publishChannel$,
      cardType: this.shelvesService.cardType$,
      list: this.shelvesService.list$,
      page: this.shelvesService.page$
    }
  },
  computed: {
    columns
  },
  data() {
    return {
      CARD_TYPE,
      ADMISSION_RANGE
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
    // 下架
    onShelfDown(record) {
      this.$confirm({
        title: `下架${this.$c('member_card')}`,
        content: `确定下架${record.card_name}${this.$c('member_card')}吗？`,
        onOk: () => {
          return this.shelvesService
            .setCardShelfDown(record.id)
            .toPromise()
            .then(() => {
              this.messageService.success({
                content: '下架成功'
              })
              this.$router.reload()
            })
        }
      })
    },
    /**
     * 变更上架
     */
    onUpdateShelf(record) {
      this.$modalRouter.push({
        name: 'card-shop-member-shelf',
        props: {
          title: '变更上架信息',
          id: record.id,
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
