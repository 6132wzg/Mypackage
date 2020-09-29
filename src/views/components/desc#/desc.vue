<template>
  <div :class="b()">
    <!-- :style="{ width: itemMaxWidth + 'px' }" -->
    <div
      :class="b('item-content')"
      v-for="(item, index) in showData"
      v-bind:key="index"
    >
      <slot :name="item.slotName" v-bind="item">
        <st-desc-item
          :label="item.label"
          :value="item.value"
          :colon="item.colon"
        ></st-desc-item>
      </slot>
    </div>
  </div>
</template>
<script>
import StDescItem from './desc-item.vue'
export default {
  name: 'InfoPane',
  components: {
    StDescItem
  },
  bem: {
    b: 'st-desc'
  },
  props: {
    type: {
      type: String,
      default: 'line'
    },
    $colon: {
      type: Boolean,
      default: true
    },
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      key: 'report'
    }
  },
  computed: {
    showData() {
      let templateData = []
      this.dataSource.forEach(ele => {
        templateData.push({
          label: ele.titleTotal || ele.title,
          value: ele.value,
          colon: this.$colon || ele.colon || '',
          slotName: ele.scopedSlots ? ele.scopedSlots.customRender : ''
        })
      })
      console.log(this.$colon)
      return templateData
    },
    itemMaxWidth() {
      let maxWidth = 200
      this.showData.map(item => {
        const str = item.label + (item.colon ? '：' : '') + item.value
        let width = this.getTextWidth(str, 12)
        console.log(str, width)
        maxWidth = Math.max(width, maxWidth)
      })
      console.log('最大值', maxWidth)
      return maxWidth
    }
  },
  methods: {
    recentChange(query) {
      this.$emit('change', query)
    },
    // 计算所有 item 中的 最大宽度
    getTextWidth(str, fontSize, gap = 15) {
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
      return result + gap
    }
  }
}
</script>
