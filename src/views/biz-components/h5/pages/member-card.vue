<template>
  <div :class="h5()">
    <div :class="card()">
      <div :class="card('img-corner')"></div>
      <img
        :class="card('img')"
        :src="data.card_bg.image_url | imgFilter({ w: 494, h: 278 })"
        alt=""
      />
      <div :class="card('name')">{{ data.card_name }}</div>
      <div :class="card('sub')">{{ data.special_note }}</div>
    </div>
    <div :class="select()">
      <div :class="select('title')">挑选卡片</div>
      <div :class="select('list')" v-if="cardType === MEMBER_CARD.PERIOD_CARD">
        <div
          :class="select('li')"
          v-for="(li, index) in data.price_gradient"
          :key="index"
        >
          <div :class="select('li__price')">{{ `￥${li.sale_price}` }}</div>
          <div :class="select('li__month')">{{ li.validity_period }}</div>
        </div>
      </div>
      <div :class="select('list')" v-if="cardType === MEMBER_CARD.NUMBER_CARD">
        <div
          :class="select('li')"
          v-for="(li, index) in data.price_gradient"
          :key="index"
        >
          <div :class="select('li__price')">{{ `￥${li.sale_price}` }}</div>
          <div :class="select('li__month')">{{ li.validity_times }}</div>
        </div>
      </div>
      <div :class="select('list')" v-if="cardType === MEMBER_CARD.DEPOSIT_CARD">
        <div :class="[select('li'), select('li_only')]">
          <div :class="[select('li__price'), select('li__price_only')]">
            {{ `￥${data.price.card_price}` }}
          </div>
        </div>
      </div>
    </div>
    <div
      :class="other()"
      v-if="
        cardType === MEMBER_CARD.PERIOD_CARD ||
          cardType === MEMBER_CARD.NUMBER_CARD
      "
    >
      <div :class="other('top')">
        <div :class="other('top__title')">
          <span :class="other('top__icon')"></span>
          卡生效时间
        </div>
        <div :class="other('top__right')">立即生效</div>
      </div>
      <div :class="other('item')">
        即时开卡
      </div>
    </div>
    <div
      :class="other()"
      v-if="
        cardType === MEMBER_CARD.PERIOD_CARD ||
          cardType === MEMBER_CARD.NUMBER_CARD
      "
    >
      <div :class="other('top')">
        <div :class="other('top__title')">
          <span :class="other('top__icon')"></span>
          支持入场场馆
        </div>
        <div
          :class="other('top__right')"
          v-if="
            data.admission_range.id === 2 && data.admission_shop_list.length > 0
          "
        >
          查看全部{{ `(${data.admission_shop_list.length})` }}
        </div>
      </div>
      <div v-if="data.admission_range.id !== 2" :class="other('item')">
        {{ data.admission_range.name }}
      </div>
      <div
        v-else
        :class="other('item')"
        v-for="(item, index) in data.admission_shop_list.slice(0, 2)"
        :key="index"
      >
        {{ item.shop_name }}
      </div>
    </div>
    <div :class="other()" v-if="cardType === MEMBER_CARD.DEPOSIT_CARD">
      <div :class="other('top')">
        <div :class="other('top__title')">
          <span :class="other('top__icon')"></span>
          支持入场场馆
        </div>
        <div
          :class="other('top__right')"
          v-if="data.consumption_range.id === 2 && data.can_use_shop.length > 0"
        >
          查看全部{{ `(${data.can_use_shop.length})` }}
        </div>
      </div>
      <div v-if="data.consumption_range.id !== 2" :class="other('item')">
        {{ data.consumption_range.name }}
      </div>
      <div
        v-else
        :class="other('item')"
        v-for="(item, index) in data.can_use_shop.slice(0, 2)"
        :key="index"
      >
        {{ item.shop_name }}
      </div>
    </div>
    <div
      :class="other()"
      v-if="cardType === MEMBER_CARD.DEPOSIT_CARD && data.consumerList"
    >
      <div :class="other('top')">
        <div :class="other('top__title')">
          <span :class="other('top__icon')"></span>
          消费类目
        </div>
      </div>
      <div
        :class="other('item')"
        v-for="(item, index) in data.consumerList"
        :key="index"
      >
        {{ item | enumFilter('deposit_card.consumer_type') }}
      </div>
    </div>
    <div
      :class="other()"
      v-if="
        cardType === MEMBER_CARD.PERIOD_CARD ||
          cardType === MEMBER_CARD.NUMBER_CARD
      "
    >
      <div :class="other('top')">
        <div :class="other('top__title')">
          <span :class="other('top__icon')"></span>
          更多说明
        </div>
      </div>
      <div :class="other('item')" v-html="data.card_introduction"></div>
      <div :class="other('item')">
        {{ data.card_contents }}
      </div>
    </div>
    <div :class="other()" v-if="cardType === MEMBER_CARD.DEPOSIT_CARD">
      <div :class="other('top')">
        <div :class="other('top__title')">
          <span :class="other('top__icon')"></span>
          有效期限
        </div>
      </div>
      <div :class="other('item')">
        {{ data.price.deadline.number
        }}{{ data.price.deadline.type | typeFilter }}内有效
      </div>
    </div>
    <div :class="other()" v-if="cardType === MEMBER_CARD.DEPOSIT_CARD">
      <div :class="other('top')">
        <div :class="other('top__title')">
          <span :class="other('top__icon')"></span>
          更多说明
        </div>
      </div>
      <div :class="other('item')" v-html="data.card_contents"></div>
      <div :class="other('item')">
        {{ data.description }}
      </div>
    </div>
  </div>
</template>
<script>
import { MEMBER_CARD, MEMBER_CARD_SPECIAL_NOTE } from './member-card.config'
export default {
  bem: {
    h5: 'brand-card-h5',
    card: 'brand-card-h5__card',
    select: 'brand-card-h5__select',
    other: 'brand-card-h5__other'
  },
  props: {
    data: Object,
    cardType: Number,
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectCard0: [],
      selectCard1: [],
      selectCard2: [],
      MEMBER_CARD: MEMBER_CARD
    }
  },
  filters: {
    typeFilter(val) {
      const types = {
        1: '天',
        2: '月',
        3: '年'
      }
      return types[val]
    }
  },
  created() {
    this.selectCard0 = [
      { price: '300', month: '1个月' },
      { price: '600', month: '3个月' },
      { price: '1000', month: '6个月' },
      { price: '1300', month: '12个月' }
    ]
    this.selectCard1 = [
      { price: '300', frequency: '10次' },
      { price: '600', frequency: '30次' },
      { price: '1000', frequency: '60次' },
      { price: '1300', frequency: '120次' }
    ]
    this.selectCard2 = [{ price: '300' }]

    // 卡项特殊说明初始值
    if (this.isAdd) {
      switch (this.cardType) {
        case this.MEMBER_CARD.PERIOD_CARD:
          return (this.data.special_note = MEMBER_CARD_SPECIAL_NOTE.PERIOD_CARD)
        case this.MEMBER_CARD.NUMBER_CARD:
          return (this.data.special_note = MEMBER_CARD_SPECIAL_NOTE.NUMBER_CARD)
        case this.MEMBER_CARD.DEPOSIT_CARD:
          return (this.data.special_note =
            MEMBER_CARD_SPECIAL_NOTE.DEPOSIT_CARD)
      }
    }
  }
}
</script>
