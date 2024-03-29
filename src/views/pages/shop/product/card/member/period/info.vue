<template>
  <st-mina-panel class="page-shop-card-info page-shop-period-card-info">
    <h5-container slot="preview" fixed>
      <template v-slot:title>购卡</template>
      <template v-slot:default>
        <member-card
          :data="cardInfo"
          :cardType="MEMBER_CARD.PERIOD_CARD"
        ></member-card>
      </template>
    </h5-container>

    <div class="page-content">
      <div :class="item('card_name')" class="mg-b24">
        <!-- 卡名称 -->
        <img
          v-if="cardInfo.card_bg"
          :class="item('card_bg')"
          :src="cardInfo.card_bg.image_url | imgFilter({ w: 192, h: 108 })"
          width="192"
          height="108"
          alt=""
        />
        <div :class="item('name_time')">
          <p :class="item('name')">
            <st-tag type="period-card" />
            <span>{{ cardInfo.card_name }}</span>
            <span
              :class="{
                'shop-card__selling':
                  cardInfo.sell_status.id === SELL_STATUS.CAN_SELL,
                'shop-card__sellstop':
                  cardInfo.sell_status.id === SELL_STATUS.NO_SELL
              }"
            >
              {{ cardInfo.sell_status.name }}
              <a-popover
                v-if="cardInfo.sell_status.id === SELL_STATUS.NO_SELL"
                trigger="hover"
                placement="bottomRight"
                arrowPointAtCenter
              >
                <div slot="content">
                  {{ cardInfo.sell_status.addition }}
                </div>
                <a-icon type="info-circle"></a-icon>
              </a-popover>
            </span>
            <span :class="item('shelf-status')">
              {{
                cardInfo.shelf_status | enumFilter('member_card.shelf_status')
              }}
            </span>
          </p>
          <p :class="item('time')">
            <span class="label">售卖时间：</span>
            <span class="value">
              {{ cardInfo.start_time }} ~ {{ cardInfo.end_time }}
            </span>
          </p>
          <p :class="item('note')">
            <span class="label">特殊说明：</span>
            <span class="value">
              {{ cardInfo.special_note }}
            </span>
          </p>
        </div>
      </div>
      <div :class="item('admission_range')" class="mg-b24">
        <p class="mg-b24">
          <span class="label">支持入场人数：</span>
          <span class="value">{{ cardInfo.support_member_num }}</span>
        </p>
        <!-- 支持入场范围 -->
        <p class="mg-b8">
          <span class="label">支持入场门店：</span>
          <span class="value">
            {{ cardInfo.admission_range.name }}
          </span>
        </p>
        <st-container
          :class="item('scroll-container')"
          v-if="cardInfo.admission_range.id === ADMISSION_RANGE.GENERAL_STORE"
        >
          <st-table
            rowKey="shop_id"
            :columns="shop_columns"
            :dataSource="cardInfo.admission_shop_list"
            :pagination="false"
            :scroll="{ y: 230 }"
          />
        </st-container>
      </div>
      <div :class="item('support_sales')" class="mg-b24">
        <!-- 售卖门店 -->
        <p class="mg-b8">
          <span class="label">售卖门店：</span>
          <span class="value">{{ cardInfo.shop_name }}</span>
        </p>
        <st-container
          :class="item('scroll-container')"
          v-if="cardInfo.support_sales.id !== SUPPORT_SALES.ALL_STORE"
        >
          <st-table
            rowKey="shop_id"
            :columns="shop_columns"
            :dataSource="cardInfo.sell_shop_list"
            :pagination="false"
            :scroll="{ y: 230 }"
          />
        </st-container>
      </div>
      <div :class="item('price_setting')" class="mg-b24">
        <!-- 定价方式 -->
        <p class="mg-b8">
          <span class="label">定价方式：</span>
          <span class="value">{{ cardInfo.price_setting.name }}</span>
        </p>
      </div>
      <div :class="item('price_gradient')" class="mg-b24">
        <!-- 售卖定价 -->
        <p class="mg-b8">
          <span class="label">售卖定价：</span>
        </p>
        <st-container :class="item('scroll-container')">
          <st-table
            rowKey="id"
            :columns="price_gradient_columns"
            :dataSource="cardInfo.price_gradient"
            :pagination="false"
            :scroll="{ y: 230 }"
          ></st-table>
        </st-container>
      </div>
      <div class="mg-b24">
        <!-- 售卖方式 -->
        <p class="mg-b8">
          <span class="label">售卖方式：</span>
          <span
            class="value"
            v-for="(item, index) in cardInfo.sell_type"
            :key="index"
          >
            <i v-if="index > 0">/</i>
            {{ item.name }}
          </span>
        </p>
      </div>
      <div class="mg-b24">
        <!-- 支持开卡方式 -->
        <p class="mg-b8">
          <span class="label">支持开卡方式：</span>
          <span
            v-if="cardInfo.shelf_status === SHELF_STATUS.NOT_ON"
            class="value"
          >
            无
          </span>
          <template v-else>
            <span
              class="value"
              v-for="(item, index) in cardInfo.activate_type"
              :key="index"
            >
              {{ item | enumFilter('member_card.activate_type')
              }}{{
                item === ACTIVATE_TYPE.ARRIVE
                  ? `(${cardInfo.automatic_num}天内未开卡，则自动开卡)`
                  : ''
              }}&nbsp;&nbsp;
            </span>
          </template>
        </p>
      </div>
      <div class="mg-b24">
        <!-- 约课权益 -->
        <p class="mg-b8">
          <span class="label">约课权益：</span>
          <span
            v-if="cardInfo.shelf_status === SHELF_STATUS.NOT_ON"
            class="value"
          >
            无
          </span>
          <span v-else>
            {{
              cardInfo.course_interests
                | enumFilter('member_card.course_interests')
            }}
          </span>
        </p>
        <st-container
          :class="item('scroll-container')"
          v-if="
            cardInfo.course_interests === COURSE_INTERESTS.APPOINT &&
              cardInfo.shelf_status !== SHELF_STATUS.NOT_ON
          "
        >
          <st-table
            rowKey="id"
            :columns="courses_columns"
            :dataSource="cardInfo.courses"
            :pagination="false"
            :scroll="{ y: 230 }"
          />
        </st-container>
      </div>
      <div class="mg-b24">
        <!-- 入场时段 -->
        <p class="mg-b8">
          <span class="label">入场时段：</span>
          <span
            v-if="cardInfo.shelf_status === SHELF_STATUS.NOT_ON"
            class="value"
          >
            无
          </span>
          <template v-else>
            <span class="value">
              {{
                cardInfo.inout_type | enumFilter('member_card.inout_type')
              }}&nbsp;&nbsp;
            </span>
          </template>
        </p>
        <st-container
          v-if="
            cardInfo.inout_type === INOUT_TYPE.CUSTOM &&
              cardInfo.shelf_status !== SHELF_STATUS.NOT_ON
          "
        >
          <a-list
            :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }"
            :dataSource="cardInfo.inout_time"
          >
            <a-list-item slot="renderItem" slot-scope="item">
              <a-card :title="weekList[item.week_day]">
                <p
                  v-for="(innerItem, innerIndex) in item.duration"
                  :key="innerIndex"
                >
                  {{ innerItem.start_time }}&nbsp;~&nbsp;{{
                    innerItem.end_time
                  }}
                </p>
              </a-card>
            </a-list-item>
          </a-list>
        </st-container>
      </div>
      <div class="mg-b24">
        <!-- VIP场地通行 -->
        <p class="mg-b8">
          <span class="label">VIP场地通行：</span>
          <span
            v-if="
              cardInfo.shelf_status === SHELF_STATUS.NOT_ON ||
                !cardInfo.areas.length
            "
            class="value"
          >
            无
          </span>
          <template v-else>
            <span
              class="value"
              v-for="(item, index) in cardInfo.areas"
              :key="index"
            >
              {{ item.area_name }}&nbsp;&nbsp;
            </span>
          </template>
        </p>
      </div>
      <div :class="item('transfer')" class="mg-b24">
        <!-- 转让设置 -->
        <p class="mg-b8">
          <span class="label">转让设置：</span>
          <span class="value">{{ cardInfo.is_transfer.name }}</span>
        </p>
      </div>
      <div :class="item('card_introduction')" class="mg-b24">
        <!-- 会员卡介绍 -->
        <p class="mg-b8">
          <span class="label">{{ $c('member_card') }}介绍：</span>
        </p>
        <st-container>
          <div v-html="cardInfo.card_introduction || '无'"></div>
        </st-container>
      </div>
      <div :class="item('card_contents')" class="mg-b24">
        <!-- 备注 -->
        <p class="mg-b8">
          <span class="label">内部备注：</span>
        </p>
        <st-container>
          <div v-html="cardInfo.card_contents || '无'"></div>
        </st-container>
      </div>
    </div>
  </st-mina-panel>
</template>
<script>
import { InfoService } from './info.service'
import MemberCard from '@/views/biz-components/h5/pages/member-card'
import H5Container from '@/views/biz-components/h5/h5-container'
import { MEMBER_CARD } from '@/views/biz-components/h5/pages/member-card.config'
import {
  ADMISSION_RANGE,
  PRICE_SETTING,
  SUPPORT_SALES,
  SELL_STATUS,
  INOUT_TYPE,
  SHELF_STATUS,
  ACTIVATE_TYPE,
  COURSE_INTERESTS
} from '@/constants/card/member'
import {
  weekList,
  shop_columns,
  price_gradient_columns,
  courses_columns
} from './info.config'
export default {
  name: 'PageShopPeriodCardInfo',
  bem: {
    item: 'shop-card'
  },
  components: {
    MemberCard,
    H5Container
  },
  serviceInject() {
    return {
      infoService: InfoService
    }
  },
  rxState() {
    return {
      cardInfo: this.infoService.cardInfo$
    }
  },
  data() {
    return {
      // week
      INOUT_TYPE,
      ACTIVATE_TYPE,
      COURSE_INTERESTS,
      SHELF_STATUS,
      ADMISSION_RANGE,
      PRICE_SETTING,
      SUPPORT_SALES,
      SELL_STATUS,
      MEMBER_CARD,
      weekList,
      // 门店表头
      shop_columns,
      // 售卖定价表头
      price_gradient_columns,
      // 约课权益表头
      courses_columns
    }
  }
}
</script>
