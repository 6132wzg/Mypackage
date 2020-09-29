<template>
  <div :class="h5Reserve()">
    <div :class="h5Reserve('title')"></div>
    <div :class="h5Reserve('bg')"></div>
    <div :class="h5Reserve('info__user')">
      <img
        src="https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/avatar.png"
        :class="h5Reserve('account__img')"
      />
      <div :class="h5Reserve('account')">
        <div :class="h5Reserve('account__nickname')">
          <div class="nickname">
            会员名称
          </div>
        </div>
        <div :class="h5Reserve('account__phone')">
          <st-icon
            type="bind-phone"
            calss="phone__icon"
            color="#222"
            size="22px"
          />
          188****0686
        </div>
      </div>
    </div>
    <!-- 会员资产 -->
    <div
      :class="[
        'info__assets',
        'modal-box',
        isMy && checkSelect == 0 ? 'border-select' : ''
      ]"
    >
      <div
        :class="['info__assets__wrap', isMy ? 'h5-my--cursor-pointer' : '']"
        @click="tapSlide(0)"
      >
        <div
          class="info__assets--item"
          v-for="item in assetsData"
          :key="item.default_title"
          v-show="item.is_display"
        >
          <div class="item__main">
            <div class="item__main--number">
              {{ item.asset || item.number || 0 }}
            </div>
            <div class="item__main--label">
              {{ item.title || item.default_title }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-for="(item, index) in sortList" :key="item.module_tag">
      <template
        v-if="
          item.module_tag === 'total_course' && courseData.module_is_display
        "
      >
        <!-- 累计上课 -->
        <div :class="h5Reserve('space')"></div>
        <div
          v-show="courseData.module_is_display"
          :class="
            h5Reserve({
              course: true,
              'modal-box': true,
              'cursor-pointer': isMy,
              'border-select': courseHide && isMy && checkSelect == index + 1
            })
          "
          @click="tapSlide(index + 1)"
        >
          <div :class="h5Reserve('course__wrap')">
            <img :src="courseData.image_url" class="course_bg" />
            <div :class="h5Reserve('course__content')">
              <div :class="h5Reserve('course__title')">
                {{ courseData.module_name }}
              </div>
              <div :class="h5Reserve('course__desc')">
                <span class="time">162</span>
                分钟，本周{{ courseData.exercise_title }} 0 分钟
              </div>
            </div>
            <div :class="h5Reserve('course--tips')">
              您预约的 空中瑜伽课 还有 18 分钟就要开始啦~
            </div>
          </div>
        </div>
      </template>
      <template v-if="item.module_tag === 'more_service'">
        <!-- 更多服务 -->
        <div :class="h5Reserve('space')"></div>
        <div
          :class="
            h5Reserve({
              service: true,
              'cursor-pointer': isMy,
              'modal-box': true,
              'border-select': isMy && checkSelect == index + 1
            })
          "
          @click="tapSlide(index + 1)"
        >
          <div :class="h5Reserve('service__wrap')">
            <p :class="h5Reserve('service__title')">
              {{ serviceTitle }}
            </p>
            <div :class="h5Reserve('service__content__wrap')">
              <div
                :class="h5Reserve('service__content')"
                v-for="(item, index) in serviceData"
                :key="index"
                v-show="item.is_display"
              >
                <div :class="h5Reserve('service__icon')">
                  <img :src="item.icon_path" class="service__img" />
                </div>
                <div :class="h5Reserve('service__name')">
                  {{ item.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    moduleDatas: {
      type: Array,
      default: function() {
        return []
      }
    },
    sortListParent: {
      type: Array,
      default: function() {
        return []
      }
    },
    // true-动态数据（我的页面），false-静态数据（tabbar页面）
    isMy: {
      type: Boolean,
      default: true
    },
    selectIndex: {
      type: [String, Number],
      default: -1
    },
    // 累计上课隐藏
    courseHide: {
      type: Boolean,
      default: true
    }
  },
  bem: {
    h5Reserve: 'h5-my'
  },
  data() {
    return {
      // activeTab: 0,
      // 0-会员资产、1-累计上课、2-更多服务
      checkSelect: 0,
      assetsData: [],
      courseData: {},
      serviceData: [],
      sortList: [],
      serviceTitle: ''
    }
  },
  watch: {
    selectIndex: {
      handler(val) {
        console.log('selectIndex--', val)
        this.checkSelect = val
      },
      deep: true,
      immediate: true
    },
    courseList(val) {
      if (val.length > 0) {
        this.activeTab = val[0].type
      }
    },
    sortListParent: {
      handler(val) {
        console.log(111111, val)
        if (val.length === 0) return
        this.sortList = JSON.parse(JSON.stringify(val))
        console.log(3333, this.sortList)
      },
      deep: true,
      immediate: true
    },
    moduleDatas: {
      handler(val) {
        console.log('isMy---', this.isMy)
        if (this.isMy) {
          if (val.length > 0) {
            console.log('val-----', val)
            let assetsData = JSON.parse(JSON.stringify(val[0].content.list))
            this.assetsData = assetsData
            this.sortList = []
            val.forEach((ele, i) => {
              if (i > 0) {
                this.sortList.push({ module_tag: ele.module_tag })
              }
              if (ele.module_tag === 'total_course') {
                this.courseData = {
                  module_name: ele.module_name,
                  exercise_title: ele.content.exercise_title,
                  image_url: ele.content.image.image_url,
                  module_is_display: ele.module_is_display
                }
                console.log('1---', ele, ele.module_is_display)
              } else if (ele.module_tag === 'more_service') {
                this.serviceData = ele.content.list
                this.serviceTitle = ele.module_name
              }
            })
            console.log('122---', this.sortList)
          }
        } else {
          const assetsData = [
            {
              default_title: '私教课',
              title: '私教课',
              type: 'my_personal',
              is_display: 1,
              number: 8
            },
            {
              default_title: '课程包',
              title: '课程包',
              type: 'my_package',
              is_display: 1,
              number: 2
            },
            {
              default_title: '小班课',
              title: '小班课',
              type: 'my_small_course',
              is_display: 1,
              number: 0
            },
            {
              default_title: '卡包',
              title: '卡包',
              type: 'my_card',
              is_display: 1,
              number: 0
            }
          ]
          const serviceData = [
            {
              title: '预约日程',
              type: 'reserve_calendar',
              icon_path:
                'https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/my-options-reserve_calendar.png',
              is_display: 1
            },
            {
              title: '我的订单',
              icon_path:
                'https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/my-options-my_order.png',
              type: 'my_order',
              is_display: 1
            },
            {
              title: '我的拼团',
              icon_path:
                'https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/my-options-group_order.png',
              type: 'group_order',
              is_display: 1
            },
            {
              title: '我的优惠券',
              icon_path:
                'https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/my-options-my_coupon.png',
              type: 'my_coupon',
              is_display: 1
            },
            {
              title: '我的票券',
              icon_path:
                'https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/my-options-my_ticket.png',
              type: 'my_ticket',
              is_display: 1
            },
            {
              title: '我的兑换券',
              icon_path:
                'https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/my-options-exchange_certificate.png',
              type: 'exchange_certificate',
              is_display: 1
            },
            {
              title: '我的储物柜',
              icon_path:
                'https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/my-options-my_cabinet.png',
              type: 'my_cabinet',
              is_display: 1
            },
            {
              title: '分享有礼',
              icon_path:
                'https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/my-options-action_share.png',
              type: 'action_share',
              is_display: 1
            },
            {
              title: '收货地址',
              icon_path:
                'https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/my-options-my_address.png',
              type: 'my_address',
              is_display: 1
            },
            {
              title: '门店跑步机',
              icon_path:
                'https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/my-options-shop_treadmill.png',
              type: 'shop_treadmill',
              is_display: 1
            }
          ]
          const courseData = {
            module_name: '累计上课',
            exercise_title: '已运动',
            image_url:
              'https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/my_user_duration.png',
            module_is_display: 1
          }
          const sortList = [
            {
              module_tag: 'total_course'
            },
            {
              module_tag: 'more_service'
            }
          ]
          this.courseData = courseData
          this.assetsData = assetsData
          this.serviceData = serviceData
          this.sortList = sortList
          this.serviceTitle = '更多服务'
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    changeTab(li) {
      this.activeTab = li.type
    },
    tapSlide(index) {
      if (!this.imMy) {
        console.log('-----', index)
        this.$emit('tapSlide', index)
      }
    }
  }
}
</script>
