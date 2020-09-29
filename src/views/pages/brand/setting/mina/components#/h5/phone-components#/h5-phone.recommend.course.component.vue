<template>
  <div>
    <!-- direction: row -->
    <div
      v-if="info.show_direction === 1"
      :class="module1({ active: isActive })"
    >
      <div :class="module1('header')">
        <div :class="module1('header-title')" class="module-title">
          {{ moduleName }}
        </div>
      </div>
      <swiper
        v-if="info.list.length"
        :class="module1('list')"
        :options="banner2Options"
      >
        <swiper-slide
          :class="module1('slide')"
          v-for="item in info.list"
          :key="item.id"
        >
          <h5PhoneRecommendItemComponent
            :image="item.image_url"
            :name="item.course_name"
            :tags="item.course_purpose"
            :tag="item.tag"
            direction="row"
          />
        </swiper-slide>
      </swiper>
      <slot name="empty"></slot>
    </div>
    <!-- direction: column -->
    <div
      v-if="info.show_direction === 2"
      :class="module2({ active: isActive })"
    >
      <div :class="module2('header')">
        <div :class="module2('header-title')" class="module-title">
          {{ moduleName }}
        </div>
      </div>
      <div :class="module2('list')">
        <div :class="module2('item')" v-for="item in info.list" :key="item.id">
          <h5PhoneRecommendItemComponent
            :image="item.image_url"
            :name="item.course_name"
            :tags="item.course_purpose"
            :tag="item.tag"
            direction="column"
          />
        </div>
      </div>
      <slot name="empty"></slot>
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { imgFilter } from '@/filters/resource.filters'
import h5PhoneRecommendItemComponent from './h5-phone.recommend.item.component'

export default {
  name: 'h5PhoneRecommendCourseComponent',
  bem: {
    module1: 'h5-phone-recommend-component-1',
    module2: 'h5-phone-recommend-component-2'
  },
  components: {
    swiper,
    h5PhoneRecommendItemComponent,
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
      vTag:
        'https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/index-coach-vip.png'
    }
  },
  methods: {
    imgFilter
  }
}
</script>
