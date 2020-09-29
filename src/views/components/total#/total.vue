<template>
  <div :class="b()">
    <div v-if="hasTitle" :class="b('title')">
      <slot name="title">
        <span :class="b('tip')">本次筛选</span>
        <st-t3 :class="b('t3')">合计</st-t3>
      </slot>
    </div>
    <div :class="b('content-wapper')">
      <div :class="[b('content'), !hasTitle ? b('content--full') : '']">
        <div
          v-if="showData.length > minSlideLen"
          :class="prevClass"
          class="swiper-total-button-prev swiper-button-prev"
          slot="button-prev"
        >
          <st-icon type="arrow-left" class="arrow-left" />
        </div>
        <div :class="b('item')" ref="content">
          <swiper v-if="show" :options="sliderOptions" ref="swiperTotal">
            <swiper-slide
              v-for="(item, index) in showData"
              :class="{ 'st-total-item__active': item.slotName }"
              :key="index"
            >
              <slot :name="item.slotName" v-bind="item">
                <st-total-item
                  :unit="item.unit"
                  :label="item.label"
                  :value="item.value"
                ></st-total-item>
              </slot>
            </swiper-slide>
          </swiper>
        </div>

        <div
          v-if="showData.length > minSlideLen"
          :class="nextClass"
          class="swiper-total-button-next swiper-button-next"
          slot="button-next"
        >
          <st-icon type="arrow-right" class="arrow-right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import StTotalItem from './total-item.vue'
import 'swiper/dist/css/swiper.css'
import moment from 'moment'
export default {
  name: 'StTotal',
  bem: {
    b: 'st-total'
  },
  components: {
    swiper,
    swiperSlide,
    StTotalItem
  },
  props: {
    indexs: {
      type: Array,
      default: () => []
    },
    dataSource: {
      type: Object,
      default: () => {}
    },
    hasTitle: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      show: true,
      dWidth: 0
    }
  },
  mounted() {
    this.getDiffWidth()
  },
  methods: {
    // 计算页面宽度 与 组件内容容器宽度的差值
    getDiffWidth() {
      const pageWidth = document.body.clientWidth
      const contentWidth = this.$refs.content.offsetWidth
      this.dWidth += pageWidth > contentWidth ? pageWidth - contentWidth : 0
      // console.log(pageWidth, contentWidth)
      // 差值改变需要重新计算 breakponts 和 slidesPerView, 使用v-if 达到刷新 swiper的 options
      this.show = false
      if (!this.show) {
        setTimeout(() => {
          this.show = true
        }, 50)
      }
    },
    // 计算字符串宽度宽度
    getTextWidth(str, fontSize) {
      let result = 100
      let ele = document.createElement('span')
      ele.innerText = str
      ele.setAttribute(
        'style',
        `position: absolute; font-size: ${fontSize}px; opacity: 0`
      )
      document.documentElement.append(ele)
      if (ele && ele.offsetWidth) result = ele.offsetWidth
      document.documentElement.removeChild(ele)
      // 加上 item 的padding宽度
      return result + 20
    }
  },
  watch: {
    dataSource: {
      deep: true,
      handler() {
        this.show = false
        if (!this.show) {
          setTimeout(() => {
            this.show = true
          }, 50)
        }
      }
    }
  },
  computed: {
    showData() {
      let templateData = []
      // for (let item in this.dataSource) {

      // }
      this.indexs.forEach(ele => {
        templateData.push({
          label: ele.titleTotal || ele.title,
          value: this.dataSource[ele.dataIndex],
          unit: ele.unit || '',
          slotName: ele.scopedSlots ? ele.scopedSlots.customRender : ''
        })
      })
      return templateData
    },
    itemMaxWidth() {
      let maxWidth = 100
      // 计算所有 item 长度 取最大值
      this.indexs.map(item => {
        let titleW = this.getTextWidth(item.titleTotal || item.title, 14)
        let value = +this.dataSource[item.dataIndex] || 0
        value = value.toString().includes('.') ? value.toFixed(1) : value
        let valueW = this.getTextWidth(
          (item.unit || '') + value,
          this.hasTitle ? 20 : 24
        )
        // console.log(
        //   item.titleTotal || item.title,
        //   titleW,
        //   '¥' + (this.dataSource[item.dataIndex] || 0),
        //   valueW
        // )
        maxWidth = Math.max(titleW, valueW, maxWidth)
      })
      // console.log('最大值', maxWidth)
      return maxWidth
    },
    slidesPerView() {
      return Math.floor((1920 - this.dWidth) / this.itemMaxWidth)
    },
    // 设置不懂屏幕宽度下 可容纳item的最大数量
    breakpoints() {
      let w = 1200
      let minSize = Math.floor((w - this.dWidth) / this.itemMaxWidth)
      w = minSize * this.itemMaxWidth + this.dWidth
      let breakpointsArr = [w]
      while (w < 1920) {
        w += this.itemMaxWidth
        breakpointsArr.push(w)
      }
      const breakpoints = {}
      breakpointsArr.map((item, index) => {
        let num = Math.floor((item - this.dWidth) / this.itemMaxWidth)
        breakpoints[item] = {
          slidesPerView: num - (index === 0 ? 0 : 1)
        }
      })
      // console.log('屏幕宽度 - 内容宽度', this.dWidth)
      // console.log('变更节点配置', breakpoints)
      return breakpoints
    },
    // 获取最小宽度下可排放的item数量
    minSlideLen() {
      let w = 1280
      let minSize = Math.floor((w - this.dWidth) / this.itemMaxWidth)
      w = minSize * this.itemMaxWidth + this.dWidth
      return this.breakpoints[w].slidesPerView
    },
    timestamp() {
      return moment().valueOf()
    },
    prevClass() {
      return `swiper-${this.timestamp}-button-prev`
    },
    nextClass() {
      return `swiper-${this.timestamp}-button-next`
    },
    navigationButtons() {
      return {
        nextEl: `.${this.nextClass}`,
        prevEl: `.${this.prevClass}`
      }
    },
    sliderOptions() {
      return {
        autoplay: false,
        navigation: { ...this.navigationButtons },
        // Default parameters
        // slidesPerView: 6,
        // breakpoints: {
        //   // when window width is >= 1280px
        //   1440: {
        //     slidesPerView: 4
        //   }
        // },
        slidesPerView: this.slidesPerView,
        breakpoints: this.breakpoints,
        centeredSlides: false,
        normalizeSlideIndex: false
        // ...this.options
      }
    }
  }
}
</script>
