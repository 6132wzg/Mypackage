<template>
  <div v-if="info">
    <!-- direction: row -->
    <div
      v-if="info.show_direction === 1"
      :class="module1({ active: isActive })"
    >
      <div :class="module1('header')">
        <div :class="module1('header-title')" class="module-title">
          {{ moduleName }}
        </div>
        <div :class="module1('header-button')">
          <div class="mg-r8">全部</div>
          <st-icon
            type="arrow-right"
            size="22px"
            color="rgba(221, 221, 221, 1)"
          />
        </div>
      </div>
      <swiper :class="module1('list')" :options="banner2Options">
        <swiper-slide
          :class="module1('coach')"
          v-for="(coach, index) in info.list"
          :key="index"
        >
          <div :class="module1('coach-item')">
            <div :class="module1('coach-head')">
              <img
                :class="module1('coach-avatar')"
                :src="imgFilter(coach.avatar, { w: 100, h: 100 })"
                width="100"
                height="100"
                alt
              />
              <img
                :class="module1('coach-tag')"
                v-if="hasVTag"
                :src="imgFilter(vTag, { w: 32, h: 32 })"
                width="32"
                height="32"
                alt
              />
            </div>
            <div :class="module1('coach-name')">{{ coach.nickname }}</div>
            <div :class="module1('coach-course-num')" v-if="hasCourseNum">
              累计上课{{ coach.course_nums }}节
            </div>
            <div :class="module1('coach-phone')" v-if="hasPhone">
              <st-icon
                size="28px"
                color="rgba(63, 102, 246, 1)"
                type="tel-fill-round"
              />
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
      <div :class="module2('header')">
        <div :class="module2('header-title')" class="module-title">
          {{ moduleName }}
        </div>
        <div :class="module2('header-button')">
          <div class="mg-r8">全部</div>
          <st-icon
            type="arrow-right"
            size="22px"
            color="rgba(221, 221, 221, 1)"
          />
        </div>
      </div>
      <div :class="module2('list')">
        <div
          :class="module2('coach')"
          v-for="(coach, index) in info.list"
          :key="index"
        >
          <div :class="module2('coach-header')">
            <img
              :class="module1('coach-avatar')"
              class="mg-r16"
              :src="imgFilter(coach.avatar, { w: 100, h: 100 })"
              width="100"
              height="100"
              alt
            />
            <div :class="module2('coach-info')">
              <div :class="module2('coach-name-tag')">
                <div :class="module2('coach-name')" class="text-overflow">
                  {{ coach.nickname }}
                </div>
                <div :class="module2('coach-tag')" v-if="hasVTag">
                  <span
                    :class="module2('coach-tag-name')"
                    class="text-overflow"
                  >
                    {{ coach.coach_level }}
                  </span>
                  <img
                    :class="module2('coach-tag-icon')"
                    :src="imgFilter(vTag, { w: 32, h: 32 })"
                    width="32"
                    height="32"
                    alt
                  />
                </div>
              </div>
              <div :class="module2('coach-course-num')" v-if="hasCourseNum">
                累计上课{{ coach.course_nums }}节
              </div>
            </div>
          </div>
          <div :class="module2('coach-footer')" v-if="hasPhone">
            <st-icon
              size="28px"
              color="rgba(63, 102, 246, 1)"
              type="tel-fill-round"
            />
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
  name: 'h5PhoneCoachComponent',
  bem: {
    module1: 'h5-phone-coach-component-1',
    module2: 'h5-phone-coach-component-2'
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
      type: String,
      default: ''
    }
  },
  computed: {
    hasVTag: function() {
      return ~this.info.show_content.indexOf(1)
    },
    hasCourseNum: function() {
      return ~this.info.show_content.indexOf(2)
    },
    hasPhone: function() {
      return ~this.info.show_content.indexOf(3)
    }
  },
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
