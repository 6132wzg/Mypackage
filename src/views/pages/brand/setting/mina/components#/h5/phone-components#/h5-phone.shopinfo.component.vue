<template>
  <div>
    <div v-show="info.show_style === 1" :class="module1({ active: isActive })">
      <!-- 轮播 -->
      <swiper
        :class="module1('banner')"
        :options="sliderOptions"
        ref="swiperContainer"
      >
        <swiper-slide
          :class="module1('item')"
          v-for="item in info.list"
          :key="item.id"
        >
          <img
            :src="imgFilter(item.image.image_url, { w: 750, h: 422 })"
            width="750"
            height="422"
          />
        </swiper-slide>
        <div
          class="swiper-pagination swiper-pagination-shop"
          slot="pagination"
        ></div>
      </swiper>
      <!-- 门店主要信息 -->
      <div :class="module1('shop')">
        <div :class="module1('logo')">
          <img
            :class="module1('logo-img')"
            :src="
              imgFilter(currentShopInfo.brand_logo[0].image_url, {
                w: 100,
                h: 100
              })
            "
            width="100"
            height="100"
          />
        </div>
        <div :class="module1('shop-info')">
          <div :class="module1('shop-name')">
            <div :class="module1('shop-name-value')">
              {{ currentShopInfo.shop_name }}
            </div>
            <st-icon
              size="22px"
              color="rgba(153, 153, 153, 1)"
              :class="module1('shop-name-icon')"
              type="arrow-right"
            />
          </div>
          <div :class="module1('shop-time')">
            营业时间 {{ currentShopInfo.business_start_time }} ~
            {{ currentShopInfo.business_end_time }}
          </div>
        </div>
      </div>
      <!-- 联系 -->
      <div :class="module1('contact')">
        <div :class="module1('contact-phone')">
          <div>
            <div>联系电话</div>
            <div>{{ currentShopInfo.shop_phones[0] }}</div>
          </div>
          <st-icon
            size="48px"
            color="rgba(204, 213, 255, 1)"
            type="tel-fill-round"
          />
        </div>
        <div :class="module1('contact-address')" class="mg-l24">
          <div :class="module1('contact-address-name')">
            {{ currentShopInfo.shop_position.address }}
          </div>
          <img
            width="40"
            height="62"
            :class="module1('contact-address-img')"
            :src="
              imgFilter(
                'https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/address-icon.png',
                { w: 40, h: 62 }
              )
            "
          />
        </div>
      </div>
    </div>
    <div v-show="info.show_style === 2" :class="module2({ active: isActive })">
      <!-- 门店 bg -->
      <img
        :class="module2('bg')"
        :src="
          imgFilter(currentShopInfo.shop_images_cover[0], { w: 750, h: 422 })
        "
        width="750"
        height="268"
        alt=""
        srcset=""
      />
      <div :class="module2('bg-cover')"></div>
      <!-- 门店主要信息 -->
      <div :class="module2('shop')">
        <img
          :class="module2('logo')"
          :src="
            imgFilter(currentShopInfo.brand_logo[0].image_url, {
              w: 100,
              h: 100
            })
          "
          width="100"
          height="100"
        />
        <div :class="module2('shop-info')">
          <div :class="module2('shop-name')">
            <div :class="module2('shop-name-value')">
              {{ currentShopInfo.shop_name }}
            </div>
            <st-icon
              size="22px"
              color="rgba(153, 153, 153, 1)"
              :class="module2('shop-name-icon')"
              type="arrow-right"
            />
          </div>
          <div :class="module2('shop-time')">
            营业时间 {{ currentShopInfo.business_start_time }} ~
            {{ currentShopInfo.business_end_time }}
          </div>
        </div>
      </div>
      <!-- 轮播 -->
      <swiper :class="module2('banner')" :options="banner2Options">
        <swiper-slide
          :class="module2('banner-item')"
          v-for="item in info.list"
          :key="item.id"
        >
          <img
            :class="module2('banner-img')"
            :src="imgFilter(item.image.image_url, { w: 750, h: 422 })"
            width="250"
            height="140"
          />
        </swiper-slide>
      </swiper>
      <!-- 联系 -->
      <div :class="module2('contact')">
        <div :class="module2('contact-address-text')">
          {{ currentShopInfo.shop_position.address }}
        </div>
        <div :class="module2('contact-icon-container')">
          <div :class="module2('contact-icon')">
            <st-icon type="location" size="40px" color="rgba(68, 68, 68, 1)" />
          </div>
          <div :class="module2('contact-icon')">
            <st-icon
              type="tel-fill-round"
              size="30px"
              color="rgba(68, 68, 68, 1)"
            />
          </div>
        </div>
      </div>
      <div :class="module2('border')"></div>
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { imgFilter } from '@/filters/resource.filters'

export default {
  name: 'h5PhoneShopinfoComponent',
  bem: {
    module1: 'h5-phone-shopinfo-component-1',
    module2: 'h5-phone-shopinfo-component-2'
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
    currentShopInfo: {
      type: Object,
      default: () => {
        return {
          shop_name: '',
          link_phone: ''
        }
      }
    }
  },
  watch: {
    infoList: {
      deep: true,
      handler(newValue, oldValue) {
        if (this.$refs.swiperContainer)
          this.$refs.swiperContainer.swiper.update()
      }
    }
  },
  computed: {
    infoList() {
      return this.info.list
    }
  },
  data() {
    return {
      sliderOptions: {
        autoplay: true,
        pagination: {
          el: '.swiper-pagination-shop',
          clickable: true
          // bulletClass: 'swiper-pagination-shop__item'
        },
        observer: true,
        observeParents: true
      },
      banner2Options: {
        spaceBetween: 6,
        slidesPerView: 2.4
      },
      img:
        'https://styd-saas-test.oss-cn-shanghai.aliyuncs.com/image/10000/2019-11-25/___75fc0ca429c8___.png'
    }
  },
  methods: {
    imgFilter
  }
}
</script>
