<template>
  <div
    :class="{
      [b({ active: isActive })]: true,
      [b('row')]: info.show_direction === 1,
      [b('column')]: info.show_direction === 2
    }"
  >
    <div :class="b('box')">
      <div :class="b('header')">
        <div :class="b('header-title')">
          {{ moduleName }}
        </div>
        <img
          :class="b('header-bg')"
          :src="imgFilter(titleBg, { w: 670, h: 80 })"
          width="670"
          height="80"
          alt=""
          srcset=""
        />
        <div :class="b('header-button')">
          <div class="mg-r8">全部</div>
          <st-icon
            type="arrow-right"
            size="22px"
            color="rgba(221, 221, 221, 1)"
          />
        </div>
      </div>
      <template v-if="info.list.length">
        <!-- direction: row -->
        <swiper
          v-if="info.show_direction === 1"
          :class="b('list')"
          :options="banner2Options"
        >
          <swiper-slide
            :class="b('slide')"
            v-for="item in info.list"
            :key="item.id"
          >
            <h5PhoneDiscountItemComponent
              :item="item"
              :image="item.image_url"
              :name="item.product_name"
              :tags="item.course_type"
              :tag="item.product_type"
              direction="row"
            />
          </swiper-slide>
        </swiper>
        <!-- direction: column -->
        <div
          v-else-if="info.show_direction === 2"
          :class="b('list')"
          v-for="item in info.list"
          :key="item.id"
        >
          <h5PhoneDiscountItemComponent
            :item="item"
            :image="item.image_url"
            :name="item.product_name"
            :tags="item.course_type"
            :tag="item.product_type"
            direction="column"
          />
        </div>
      </template>
      <slot name="empty"></slot>
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { imgFilter } from '@/filters/resource.filters'
import h5PhoneDiscountItemComponent from './h5-phone.discount.item.component'

export default {
  name: 'h5PhoneDiscountCourseComponent',
  bem: {
    b: 'h5-phone-discount-component'
  },
  components: {
    swiper,
    h5PhoneDiscountItemComponent,
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
      type: String,
      default: ''
    }
  },
  computed: {},
  data() {
    return {
      banner2Options: {
        freeMode: true,
        slidesPerView: 'auto',
        spaceBetween: 24
      },
      titleBg:
        'https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/index_discount_bg.png'
    }
  },
  methods: {
    imgFilter
  }
}
</script>
