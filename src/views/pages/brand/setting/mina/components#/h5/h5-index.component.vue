<template>
  <div :class="h5()">
    <div :class="h5('slider')">
      <img :class="h5('slider-status')" :src="statusImg" />
      <swiper :options="sliderOptions">
        <swiper-slide v-for="(li, index) in sliderInfo" :key="index">
          <!-- <img :src="li.image_url | imgFilter"> -->
          <div
            :class="h5('slider-img')"
            :style="{
              backgroundImage:
                'url(' + imageFilter(li.image_url, { w: 552, h: 310 }) + ')'
            }"
          ></div>
        </swiper-slide>
      </swiper>
    </div>
    <div :class="h5('header')">
      <img :class="h5('header-shelter')" :src="logoShelter" />
      <div class="imgBox">
        <img :src="brand.logo | imgFilter({ w: 74, h: 74 })" />
      </div>
      <div :class="h5('header-title')">此处显示门店名称</div>
      <div :class="h5('header-subtitle')">此处显示门店地址</div>
    </div>
    <div :class="[h5('action'), checkedClass]">
      <div v-for="(li, index) in checkedInfo" class="action-li" :key="index">
        <img :src="li.image_url | imgFilter({ w: 56, h: 56 })" />
        <p>{{ li.title }}</p>
      </div>
    </div>
    <div :class="h5('event')" v-if="openMiniFlag">
      <a-row>
        <a-col
          v-for="(li, index) in eventInfo"
          class="event-li"
          :key="index"
          :span="li.span"
        >
          <!-- <img v-if="li.image_url" :src="li.image_url | imgFilter"> -->
          <!-- 不要去除url()这里的单引号，会引起图片不更新 -->
          <div
            v-if="li.image_url"
            :class="h5('event-img')"
            :style="{
              backgroundImage: `url('${imageFilter(li.image_url, {
                w: li.span === 24 ? 670 : 327,
                h: 120
              })}')`
            }"
          ></div>
          <div v-else class="img"></div>
        </a-col>
      </a-row>
    </div>
    <div :class="h5('hr')"></div>
    <st-t3 :class="h5('coach-title')" v-if="coach">
      {{ coach.module_title }}
    </st-t3>
    <div :class="h5('coach')">
      <swiper :options="coachOption" class="coach-li">
        <swiper-slide v-for="(li, index) in coachInfo" :key="index">
          <img
            class="via"
            :src="
              li.head_img.image_url
                | imgFilter({ w: 206, h: 206, type: 'avatar' })
            "
          />
          <img class="call" :src="callcoach" />
          <st-t3>{{ li.nickname }}</st-t3>
          <p v-if="coach.is_display_course_nums">
            {{ `累计上课${li.course_num}节` }}
          </p>
          <p>
            <span :class="h5('coach-price')">
              {{ li.min_price | priceFilter }}
            </span>
            {{ li.min_price ? '/节' : '' }}
          </p>
        </swiper-slide>
      </swiper>
    </div>
    <div v-for="(li, index) in courseInfo" :key="index">
      <div
        :class="[h5('course'), h5('course' + li.course_type)]"
        v-if="li.is_display"
      >
        <div :class="h5('hr')"></div>
        <st-t3>{{ li.module_name }}</st-t3>
        <div v-if="li.course_type === 1">
          <!-- <div v-if="index === 0"> -->
          <p>私人{{ $c('coach') }}全程陪伴，健身事半功倍！</p>
          <swiper :options="swiperOption">
            <swiper-slide v-for="(li, index) in recommend1" :key="index">
              <img :src="li" />
            </swiper-slide>
          </swiper>
        </div>
        <div v-if="li.course_type === 2">
          <!-- <div v-if="index === 1"> -->
          <p>全身塑形，体能训练，小白也能练出迷人曲线！</p>
          <swiper :options="swiperOption">
            <swiper-slide v-for="(li, index) in recommend2" :key="index">
              <img :src="li" />
            </swiper-slide>
          </swiper>
        </div>
        <div v-if="li.course_type === 3">
          <!-- <div v-if="index === 2"> -->
          <p>包含多节私教课程和团体课，打包买更优惠！</p>
          <swiper :options="swiperOption">
            <swiper-slide v-for="(li, index) in recommend3" :key="index">
              <img :src="li" />
            </swiper-slide>
          </swiper>
        </div>
        <div v-if="li.course_type === 4">
          <swiper :options="swiperOption">
            <swiper-slide v-for="(li, index) in recommend4" :key="index">
              <img :src="li" />
            </swiper-slide>
          </swiper>
        </div>
        <div v-if="li.course_type === 6">
          <swiper :options="cardOption">
            <swiper-slide v-for="(li, index) in recommend6" :key="index">
              <img :src="li" />
              <p :class="h5('card-name')">卡项名称</p>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { H5WrapperService } from './h5-wrapper.service'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import course1 from '@/assets/img/brand/setting/mina/course1.png'
import course2 from '@/assets/img/brand/setting/mina/course2.png'
import course3 from '@/assets/img/brand/setting/mina/course3.png'
import course4 from '@/assets/img/brand/setting/mina/course4.png'
import course5 from '@/assets/img/brand/setting/mina/course5.png'
import course6 from '@/assets/img/brand/setting/mina/course6.png'
import course7 from '@/assets/img/brand/setting/mina/course7.png'
import course8 from '@/assets/img/brand/setting/mina/course8.png'
import small1 from '@/assets/img/brand/setting/mina/small_course_1.png'
import small2 from '@/assets/img/brand/setting/mina/small_course_2.png'
import small3 from '@/assets/img/brand/setting/mina/small_course_3.png'
import small4 from '@/assets/img/brand/setting/mina/small_course_4.png'
import small5 from '@/assets/img/brand/setting/mina/small_course_5.png'
import coursepack1 from '@/assets/img/brand/setting/mina/coursepack1.png'
import coursepack2 from '@/assets/img/brand/setting/mina/coursepack2.png'
import coursepack3 from '@/assets/img/brand/setting/mina/coursepack3.png'
import coursepack4 from '@/assets/img/brand/setting/mina/coursepack4.png'
import card1 from '@/assets/img/brand/setting/mina/card1.png'
import card2 from '@/assets/img/brand/setting/mina/card2.png'
import card3 from '@/assets/img/brand/setting/mina/card3.png'
import callcoach from '@/assets/img/brand/setting/mina/callcoach.png'
import logo_shelter from '@/assets/img/brand/setting/mina/logo_shelter.png'
import statusImg from '@/assets/img/brand/setting/mina/nav_bg_black.png'
import { UserService } from '@/services/user.service'
import { imgFilter } from '@/filters/resource.filters'
export default {
  bem: {
    h5: 'h5-index-component'
  },
  components: {
    swiper,
    swiperSlide
  },
  serviceInject() {
    return {
      h5WrapperService: H5WrapperService,
      userService: UserService
    }
  },
  rxState() {
    return {
      actionInfo: this.h5WrapperService.actionInfo$,
      checkedInfo: this.h5WrapperService.checkedInfo$,
      coachInfo: this.h5WrapperService.coachInfo$,
      coach: this.h5WrapperService.coach$,
      courseInfo: this.h5WrapperService.courseInfo$,
      sliderInfo: this.h5WrapperService.sliderInfo$,
      eventInfo: this.h5WrapperService.eventInfo$,
      brand: this.userService.brand$
    }
  },
  watch: {
    checkedInfo: {
      deep: true,
      handler(newVal) {
        this.checkedClass = `h5-index-component__action--${newVal.length}`
      }
    }
  },
  props: {
    // 门店上架会员卡数量
    openMiniFlag: {
      type: Boolean,
      default: false
    }
  },
  filters: {
    priceFilter(val) {
      if (val) {
        return `￥${val}`
      } else {
        return '咨询定价'
      }
    }
  },
  data() {
    return {
      statusImg: statusImg,
      logoShelter: logo_shelter,
      callcoach: callcoach,
      recommend1: [],
      recommend2: [],
      recommend3: [],
      recommend4: [],
      recommend6: [],
      sliderOptions: {
        autoplay: {
          delay: 1500,
          disableOnInteraction: false
        }
      },
      swiperOption: {
        spaceBetween: 16,
        slidesPerView: 1.05
      },
      coachOption: {
        spaceBetween: 6,
        slidesPerView: 2.4
      },
      cardOption: {
        spaceBetween: 16,
        slidesPerView: 1.7
      },
      checkedClass: 'checked'
    }
  },
  created() {
    this.recommend1 = [
      course1,
      course2,
      course3,
      course4,
      course5,
      course6,
      course7,
      course8
    ]
    this.recommend2 = this.recommend1.slice(0).reverse()
    this.recommend3 = [coursepack1, coursepack2, coursepack3, coursepack4]
    this.recommend4 = [small1, small2, small3, small4, small5]
    this.recommend6 = [card1, card2, card3]
  },
  methods: {
    imageFilter(key, opts) {
      return imgFilter(key, opts)
    }
  }
}
</script>
