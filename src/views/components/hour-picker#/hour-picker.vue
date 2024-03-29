<template>
  <div class="st-hour-picker" :class="{ isInfo: isInfo }">
    <st-checkbox-button-group
      v-model="weekSelects"
      v-if="!isInfo"
      :class="ShopHourPicker('check')"
    >
      <st-checkbox-button-item
        :key="index"
        :value="item.value"
        v-for="(item, index) in defaultWeekList"
      >
        {{ item.label }}
      </st-checkbox-button-item>
    </st-checkbox-button-group>
    <div class="st-hour-picker__content">
      <div class="st-hour-picker__title">
        <div class="label">时间段</div>
        <div class="timeBox" :class="{ isInfo: isInfo, isNotInfo: !isInfo }">
          <div class="time" v-for="(time, index) in currentTime" :key="index">
            {{ time }}
          </div>
        </div>
        <div class="operate" v-if="!isInfo">操作</div>
      </div>
      <div
        :class="ShopHourPicker('box')"
        v-for="(item, index) in slider"
        :key="index"
      >
        <div :class="ShopHourPicker('slider')" v-if="item.show">
          <!-- label -->
          <div class="label">
            <span>{{ item.week_day | filterWeekDay }}</span>
          </div>
          <!-- slider -->
          <div class="sliderBox">
            <date-slider
              :step="step"
              :disable="isInfo"
              :rangeData="item.range"
              :tipFormatter="formatter"
              v-model="item.value"
            ></date-slider>
          </div>
          <!-- 操作列 -->
          <div class="operation" v-if="!isInfo">
            <a-popover
              placement="bottomRight"
              trigger="click"
              class="slider-copy-bottom"
            >
              <template slot="content">
                <a-checkbox-group
                  @change="onChange"
                  class="slider-copy"
                  v-for="(canWeekDayCopy, index) in item.week"
                  :key="index"
                >
                  <a-checkbox :value="index" :disabled="!canWeekDayCopy">
                    {{ index | filterOperation }}
                  </a-checkbox>
                </a-checkbox-group>
              </template>
              <span @click="copyTo(item, index)">复制到</span>
            </a-popover>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { SLIDER, WEEK_NO_SELF, WEEK, TIMER } from './hour-picker.config'
import { constant, cloneDeep, difference } from 'lodash-es'
import DateSlider from '@/views/components/date-slider#/date-slider'
export default {
  name: 'StShopHourPicker',
  bem: {
    ShopHourPicker: 'st-hour-picker'
  },
  components: {
    DateSlider
  },
  model: {
    prop: 'value',
    event: 'ShopHourPickerChange'
  },
  props: {
    // TODO: shop hour picker后续修改，不能有默认值
    value: {
      type: Array,
      default: () => []
    },
    isInfo: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 24
    },
    step: {
      type: Number,
      default: 0.5
    }
  },
  data() {
    return {
      defaultWeekList: WEEK,
      time: TIMER,
      slider: cloneDeep(SLIDER),
      copeSlider: {}, // 复制到功能需要,为中间值
      weekSelects: [],
      isInit: true
    }
  },
  computed: {
    currentTime() {
      return this.time[this.isInfo ? 'info' : 'edit']
    }
  },
  watch: {
    slider: {
      handler(n, o) {
        // console.log('slider 变化', n, o)
        let value = this.slider.filter(item => item.show)
        value = value.map(item => {
          return {
            week_day: item.week_day,
            range: item.range,
            start_time: this.timeFilter(item.value[0]),
            end_time: this.timeFilter(item.value[1])
          }
        })
        this.$emit('ShopHourPickerChange', value)
      },
      deep: true
    },
    weekSelects(n, o) {
      if (this.isInit) return
      // console.log('weekSelects', n, o)
      if (n.length === o.length) return
      n.length > o.length ? this.addSlider(n, o) : this.removeSlider(n, o)
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    // 获取日期选择数组
    init() {
      // console.log('init', this.value)
      this.weekSelects = this.value.map(item => item.week_day)
      if (this.weekSelects.length) this.getSliderInfoList()
      else this.isInit = false
    },
    // 获取的数据对格式进行处理
    getSliderInfoList() {
      // console.log('获取的数据对格式进行处理 => value', this.value)
      this.value.map(item => {
        let week_day = cloneDeep(item.week_day)
        let index = --week_day
        this.slider[index].value = [
          item.start_time.replace(/:00/gi, '').replace(/:30/gi, '.5') - 0,
          item.end_time.replace(/:00/gi, '').replace(/:30/gi, '.5') - 0
        ]
        this.slider[index].show = true
        this.slider[index].range = cloneDeep(item.range)
        // console.log('sliderByweekDay end', this.slider[index].value)
      })
      this.isInit = false
      // console.log('根据value值,设置slider => slider', this.slider)
    },
    // 新增slider
    addSlider(n, o) {
      const index = difference(n, o)
      // console.log('addSlider', index)
      index.forEach(i => {
        let endIndex = --i
        if (this.slider[endIndex].show) return
        this.slider[endIndex].show = true
        this.slider[endIndex].value = [10, 24]
      })
    },
    // 删除slider
    removeSlider(n, o) {
      const index = difference(o, n)
      index.forEach(i => {
        let endIndex = --i
        this.slider[endIndex].show = false
        this.slider[endIndex].value = []
      })
    },
    // 时间过滤器
    timeFilter(time) {
      return /^\d+$/.test(time) && time >= 10
        ? time + ':00'
        : /^\d+$/.test(time) && time < 10
        ? '0' + time + ':00'
        : !/^\d+$/.test(time) && time < 10
        ? '0' + (time + '').replace(/.5/gi, ':30')
        : (time + '').replace(/.5/gi, ':30') + ''
    },
    // tooltip格式处理
    formatter(value) {
      const valueHalf =
        value >= 10 ? `${parseInt(value)}:30` : `0${parseInt(value)}:30`
      const valueInt = value >= 10 ? `${value}:00` : `0${value}:00`
      return value % 1 === 0 ? valueInt : valueHalf
    },
    onChange(sliders) {
      Array.isArray(sliders) &&
        sliders.forEach(key => {
          if (this.slider[key]) this.slider[key].value = this.copeSlider.value
        })
    },
    copyTo(item, index) {
      this.copeSlider = cloneDeep(item)
      const week = cloneDeep(WEEK_NO_SELF)
      // WEEK_NO_SELF中对应weekArr中的值设置为true,非对应的或
      this.weekSelects.forEach(selectWeekDay => {
        if (selectWeekDay !== item.week_day) {
          week[selectWeekDay - 1] = true
        }
      })
      item.week = week
    }
  },
  filters: {
    filterWeekDay(value) {
      let filterValue = --value
      return WEEK[filterValue] && WEEK[filterValue]['label']
    },
    filterOperation(value) {
      return WEEK[value] && WEEK[value]['label']
    }
  },
  beforeDestory() {
    this.weekSelects = []
    this.init = true
    // console.log('beforeDestory')
  }
}
</script>
