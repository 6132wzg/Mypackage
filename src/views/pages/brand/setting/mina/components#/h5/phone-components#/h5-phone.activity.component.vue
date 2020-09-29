<template>
  <div>
    <!-- direction: row -->
    <div
      v-if="info.show_direction === 1"
      :class="module1({ active: isActive })"
    >
      <div :class="module1('header')" class="module-title">
        {{ moduleName }}
      </div>
      <swiper :class="module1('list')" :options="banner2Options">
        <swiper-slide
          :class="module1('activity')"
          v-for="activity in info.list"
          :key="activity.id"
        >
          <div :class="module1('activity-item')">
            <h5-tag
              :class="module1('activity-tag')"
              :type="'2'"
              :tag="activity.activity_status.id"
            ></h5-tag>
            <img
              :class="module1('activity-img')"
              :src="imgFilter(activity.image_url, { w: 180, h: 100 })"
              width="300"
              height="225"
              alt=""
            />
            <div :class="module1('activity-name')">
              {{ activity.activity_name }}
            </div>
            <div :class="module1('activity-time')">
              {{ activity.valid_days }}
            </div>
            <div :class="module1('activity-action')">
              <div :class="module1('activity-price')">
                <span :class="module1('activity-price-symbol')">¥</span>
                <span :class="module1('activity-price-value')">
                  {{ activity.price }}
                </span>
              </div>
              <div
                class="h5-phone-activity-component-1__activity-button"
                :class="{ 'activity-failed': activity.activity_status.id > 1 }"
              >
                去抢票
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
      <slot name="empty"></slot>
    </div>
    <!-- direction: column -->
    <div
      v-if="info.show_direction === 2"
      :class="module2({ active: isActive })"
    >
      <div :class="module2('header')" class="module-title">
        {{ moduleName }}
      </div>
      <div :class="module2('list')">
        <div
          :class="module2('activity')"
          v-for="activity in info.list"
          :key="activity.id"
        >
          <h5-tag
            :class="module2('activity-tag')"
            :type="'2'"
            :tag="activity.activity_status.id"
          ></h5-tag>
          <div
            class="h5-phone-activity-component-2__activity-button"
            :class="{ 'activity-failed': activity.activity_status.id > 1 }"
          >
            去抢票
          </div>
          <img
            :class="module2('activity-img')"
            :src="imgFilter(activity.image_url, { w: 180, h: 100 })"
            width="200"
            height="150"
            alt=""
          />
          <div :class="module2('activity-info')">
            <div :class="module2('activity-name')">
              {{ activity.activity_name }}
            </div>
            <div :class="module2('activity-time')">
              {{ activity.valid_days }}
            </div>
            <div :class="module2('activity-price')">
              <span :class="module2('activity-price-symbol')">¥</span>
              <span :class="module2('activity-price-value')">
                {{ activity.price }}
              </span>
            </div>
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
import H5Tag from '@/views/biz-components/h5/h5-tag/h5-tag'
export default {
  name: 'h5PhoneActivityComponent',
  bem: {
    module1: 'h5-phone-activity-component-1',
    module2: 'h5-phone-activity-component-2'
  },
  components: {
    swiper,
    swiperSlide,
    H5Tag
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
      }
    }
  },
  methods: {
    imgFilter
  }
}
</script>
