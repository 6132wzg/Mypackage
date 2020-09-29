<template>
  <div :class="b()">
    <div :class="b('content')">
      <div :class="b('content-bg')">
        <div class="bg-img">
          <div class="default-bg" v-if="!tableData.is_bgimage"></div>
          <img :src="bgUrl" alt="背景图" class="bg-url" />
          <img
            class="radian-img"
            src="~@/assets/img/shop/schedule/timeTable_radian.png"
          />
        </div>
        <div class="bg-footer"></div>
      </div>
      <div :class="b('content-info')">
        <div :class="b('header')">
          <div class="shop-logo">
            <img :src="tableData.brand_log" alt="logo" />
          </div>
          <div class="shop-info">
            <div class="shop-name">
              <span v-if="tableData.is_show_shop">
                {{ tableData.shop_name }}
              </span>
            </div>
            <div class="table-time">{{ rangeTime }}</div>
          </div>
        </div>
        <div :class="b('table')">
          <div :class="b('table-title')">
            {{ title }}
          </div>
          <div :class="b('table-content')">
            <img src="~@/assets/img/shop/schedule/timeTable-bg.png" alt="" />
            <div
              class="table-block"
              v-for="i in 12"
              :key="i"
              :class="'table-block__' + i"
            >
              <div class="course-title">健康调理体验课程</div>
              <div class="level-star">
                <template v-if="tableData.is_show_strength_level">
                  <st-icon
                    type="star"
                    color="#FCC912"
                    size="5px"
                    v-for="z in 3"
                    :key="z"
                  ></st-icon>
                </template>
              </div>
              <div class="coach-name">
                <span v-if="tableData.is_show_nickname">小野</span>
              </div>
              <div class="site-name">
                <span v-if="tableData.is_show_court">瑜伽馆</span>
              </div>
            </div>
          </div>
          <div :class="b('table-footer')" class="mg-t8">
            <div class="qrcode mg-r16" v-if="codeUrl">
              <img :src="codeUrl" alt="二维码" />
            </div>
            <div class="message">
              <div class="message-title" v-if="tableData.prompt_message">
                温馨提示
              </div>
              <div class="message-info">
                <span class="message-info-text">
                  {{ tableData.prompt_message }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="st-des mg-t8">图片仅供参考，课程信息请以下载课表为准</div>
  </div>
</template>
<script>
export default {
  name: 'TimeTable',
  bem: {
    b: 'time-table'
  },
  data() {
    return {}
  },
  props: {
    title: {
      type: String
    },
    bgUrl: {
      type: String
    },
    codeUrl: {
      type: String
    },
    rangeTime: {
      type: String
    },
    tableData: {
      type: Object
    }
  }
}
</script>
