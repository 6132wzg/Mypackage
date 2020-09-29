<template>
  <div :class="module({ active: isActive })">
    <div
      v-if="!info.list.length"
      :class="module('header')"
      class="module-title"
    >
      {{ moduleName }}
    </div>
    <!-- direction: row -->
    <div v-if="info.show_direction === 1" :class="module1()">
      <swiper
        v-if="info.list.length"
        :class="module1('list')"
        :options="banner2Options"
      >
        <swiper-slide
          :class="module1('coupon')"
          v-for="coupon in info.list"
          :key="coupon.id"
        >
          <div :class="module1('coupon-item')">
            <div :class="module1('coupon-value')">
              <span class="h5-phone-coupon-component-1__coupon-value-text">
                <span>{{ coupon.price.split('.')[0] }}</span>
                <span style="font-size:26px">
                  {{
                    coupon.price.split('.').length > 1
                      ? `.${coupon.price.split('.')[1]}`
                      : ''
                  }}
                </span>
              </span>
              元
            </div>
            <div :class="module1('coupon-name')">
              {{ coupon.activity_name }}
            </div>
            <img
              :class="module1('coupon-bg')"
              :src="imgFilter(rowBg, { w: 200, h: 240 })"
              width="200"
              height="240"
              alt=""
              srcset=""
            />
          </div>
        </swiper-slide>
      </swiper>
      <slot name="empty"></slot>
    </div>
    <!-- direction: column -->
    <div v-if="info.show_direction === 2" :class="module2()">
      <div
        :class="module2('coupon')"
        v-for="coupon in info.list"
        :key="coupon.id"
      >
        <img
          :class="module2('coupon-bg')"
          :src="imgFilter(columnBg, { w: 750, h: 200 })"
          width="670"
          height="176"
          alt=""
          srcset=""
        />
        <div :class="module2('coupon-value')">
          <span class="h5-phone-coupon-component-2__coupon-value-text">
            <span>{{ coupon.price.split('.')[0] }}</span>
            <span style="font-size:32px">
              {{
                coupon.price.split('.').length > 1
                  ? `.${coupon.price.split('.')[1]}`
                  : ''
              }}
            </span>
          </span>
          元
        </div>
        <div :class="module2('coupon-name-date')">
          <div :class="module2('coupon-name')">{{ coupon.activity_name }}</div>
          <div :class="module2('coupon-date')">
            有效期{{ coupon.valid_days }}天
          </div>
        </div>
      </div>
      <slot name="empty"></slot>
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { imgFilter } from '@/filters/resource.filters'

export default {
  name: 'h5PhoneCouponComponent',
  bem: {
    module: 'h5-phone-coupon-component',
    module1: 'h5-phone-coupon-component-1',
    module2: 'h5-phone-coupon-component-2'
  },
  components: {
    swiper,
    swiperSlide
  },
  props: {
    info: {
      type: Object,
      default: function() {
        return {}
      }
    },
    isActive: {
      type: Boolean,
      default: false
    },
    moduleName: {
      type: String
    }
  },
  computed: {
    selfInfo: function() {
      return this.info
    }
  },
  data() {
    return {
      banner2Options: {
        freeMode: true,
        slidesPerView: 'auto',
        spaceBetween: 24
      },
      columnBg:
        'https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/index-coupon.png',
      rowBg:
        'https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/index-coupon-scroll.png'
    }
  },
  methods: {
    imgFilter
  }
}
</script>
