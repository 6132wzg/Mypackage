<template>
  <div v-if="isActive == 1">
    <div :class="module()">
      <div :class="module('index')">
        <div :class="module('index__header')">
          <img src="@/assets/img/brand/setting/mina/phone_header.png" alt="" />
        </div>
        <div :class="module('index__content')">
          <swiper
            :class="module('index__swiper')"
            :options="sliderOptions"
            ref="phoneSwiper"
          >
            <swiper-slide
              style="height: auto;"
              :class="module('index__slider')"
              v-for="(item, index) in moduleDatas"
              :key="index"
            >
              <div
                :class="module('index__slider-content')"
                @click="tapSlide(index)"
                v-show="item.module_is_display && !item.module_is_delete"
              >
                <component
                  :moduleName="item.module_name"
                  :info="item.content"
                  :isActive="index === sliderIndex"
                  :is="componentList[item.module_type]"
                  :currentShopInfo="currentShopInfo"
                >
                  <div
                    v-if="
                      !item.content.list.length || item.content.is_open === 0
                    "
                    slot="empty"
                    :class="module('index__slider-nodata')"
                  >
                    未填充内容时
                    <br />
                    不显示在手机端小程序
                  </div>
                </component>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="isActive == 2">
    <div :class="module()">
      <div :class="module('reserve')">
        <div :class="module('reserve__content')">
          <h5-reserve-component :moduleDatas="moduleDatas" />
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="isActive == 3">
    <div :class="module()">
      <div :class="module('reserve')">
        <div :class="module('reserve__content')">
          <h5-my-component
            :moduleDatas="moduleDatas"
            :selectIndex="selectIndex"
            :isMy="isMy"
            :sortListParent="sortListParent"
            @tapSlide="myTapSlide"
          />
        </div>
      </div>
    </div>
    <div
      :class="[
        'h5-phone-component__nav',
        { 'h5-phone-component__border-select': !isMy }
      ]"
      v-if="courseList.length > 0 && !isMy"
    >
      <div
        v-for="(li, index) in courseList"
        class="nav-li"
        :key="index"
        v-show="li.checked"
      >
        <img
          :src="
            (index === tabSelect
              ? li.selected_icon.image_url
              : li.icon.image_url) | imgFilter({ w: 32, h: 32 })
          "
        />
        <p>{{ li.title || li.default_title }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import h5PhoneShopinfoComponent from './phone-components#/h5-phone.shopinfo.component'
import h5PhoneFnComponent from './phone-components#/h5-phone.fn.component'
import h5PhoneCoachComponent from './phone-components#/h5-phone.coach.component'
import h5PhoneActivityComponent from './phone-components#/h5-phone.activity.component'
import h5PhoneTurntableComponent from './phone-components#/h5-phone.turntable.component'
import h5PhoneInvitationComponent from './phone-components#/h5-phone.invitation.component'
import h5PhoneCouponComponent from './phone-components#/h5-phone.coupon.component'
import h5PhoneGroupComponent from './phone-components#/h5-phone.group.component'
import h5PhoneRecommendCardComponent from './phone-components#/h5-phone.recommend.card.component'
import h5PhoneRecommendCourseComponent from './phone-components#/h5-phone.recommend.course.component'
import h5PhoneRecommendPackageComponent from './phone-components#/h5-phone.recommend.package.component'
import h5PhoneDiscountComponent from './phone-components#/h5-phone.discount.component'
import h5PhoneSeckillComponent from './phone-components#/h5-phone.seckill.component'
// 预约组件
import h5ReserveComponent from './h5-reserve.component'
// 我的组件
import h5MyComponent from './h5-my.component'
import { imgFilter } from '@/filters/resource.filters'

export default {
  name: 'h5PhoneComponent',
  bem: {
    module: 'h5-phone-component'
  },
  components: {
    swiper,
    swiperSlide,
    h5PhoneShopinfoComponent,
    h5PhoneCoachComponent,
    h5PhoneActivityComponent,
    h5PhoneTurntableComponent,
    h5PhoneInvitationComponent,
    h5PhoneCouponComponent,
    h5PhoneGroupComponent,
    h5PhoneDiscountComponent,
    h5PhoneSeckillComponent,
    h5PhoneRecommendCardComponent,
    h5PhoneRecommendCourseComponent,
    h5PhoneRecommendPackageComponent,
    h5PhoneFnComponent,
    h5ReserveComponent,
    h5MyComponent
  },
  props: {
    // 显示，1-首页，2-预约，3-我的、底部导航
    isActive: {
      type: [String, Number],
      default: 1
    },
    // 我的和自定义tab使用同一页面布局，作区分，true-我的，false-tabbar
    isMy: {
      type: Boolean,
      default: true
    },
    // 我的手机屏排序
    sortListParent: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 自定义tab选中，0-首页，1-预约，2-我的
    tabSelect: {
      type: [String, Number],
      default: -1
    },
    moduleDatas: {
      type: Array,
      default: function() {
        return []
      }
    },
    selectIndex: {
      type: [String, Number],
      default: -1
    },
    sliderIndex: {
      type: [String, Number],
      default: 0
    },
    isBorderSelect: {
      type: Boolean,
      default: true
    },
    currentShopInfo: {
      type: Object
    }
  },
  watch: {
    moduleDatas: {
      handler(val) {
        if (val.length === 0) return
        this.courseList = val[0].content.list
        if (this.isActive == 1) {
          if (this.$refs.phoneSwiper) this.$refs.phoneSwiper.swiper.update()
        }
      },
      deep: true,
      immediate: true
    },
    selectIndex: function(newVal, oldVal) {
      if (this.isActive == 1) {
        this.$refs.phoneSwiper.swiper.slideTo(newVal)
      }
    }
  },
  data() {
    return {
      sliderOptions: {
        // 竖向
        direction: 'vertical',
        // 不贴边，可以自由滚动
        freeMode: true,
        // 不自动播放
        autoplay: false,
        // 显示slide数量为自动
        slidesPerView: 'auto',
        // 显示小手
        grabCursor: true,
        // 取消 active slide 为最左
        normalizeSlideIndex: false,
        // 鼠标控制滚动
        mousewheel: true
      },
      componentList: {
        1: 'h5PhoneShopinfoComponent',
        2: 'h5PhoneFnComponent',
        3: 'h5PhoneCoachComponent',
        4: 'h5PhoneRecommendCardComponent',
        5: 'h5PhoneRecommendCourseComponent',
        6: 'h5PhoneRecommendPackageComponent',
        12: 'h5PhoneCouponComponent',
        13: 'h5PhoneInvitationComponent',
        14: 'h5PhoneTurntableComponent',
        15: 'h5PhoneActivityComponent',
        16: 'h5PhoneGroupComponent',
        17: 'h5PhoneDiscountComponent',
        18: 'h5PhoneSeckillComponent'
      },
      courseList: []
    }
  },
  methods: {
    tapSlide(index) {
      console.log('tapSlide', this.$refs.phoneSwiper.swiper)
      let { clickedIndex = index } = this.$refs.phoneSwiper.swiper
      // this.sliderIndex = clickedIndex
      this.$refs.phoneSwiper.swiper.slideTo(clickedIndex)
      this.$emit('tapSlide', { sliderIndex: clickedIndex })
    },
    myTapSlide(index) {
      this.$emit('tapSlide', index)
    },
    imageFilter(key, opts) {
      return imgFilter(key, opts)
    }
  }
}
</script>
