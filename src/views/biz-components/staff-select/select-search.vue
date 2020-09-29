<template>
  <div :class="b()">
    <a-select
      v-model="selected"
      class="-search-select"
      showSearch
      allowClear
      :placeholder="placeholder"
      :defaultActiveFirstOption="true"
      :filterOption="false"
      @popupScroll="scroll"
      @change="onChange"
      @search="onSearch"
      @select="onSelect"
      @blur="onBlur"
      @focus="onFocus"
      ref="searchSelect"
    >
      <a-icon slot="suffixIcon" type="search" />
      <!-- 无数据 -->
      <slot name="notFoundContent" v-bind="isSearchNone">
        <span slot="notFoundContent" v-if="isSearchNone">
          查无此用户
        </span>
        <span slot="notFoundContent" v-else>无数据</span>
      </slot>
      <a-select-option v-for="item in list" :key="item.value">
        <span v-html="labelHtml(item.label, keyword)">
          {{ item.label }}
        </span>
      </a-select-option>
      <!-- loading -->
      <a-select-option
        disabled
        :key="new Date() + Math.random()"
        :class="reception('-search-tip')"
        v-if="loading"
      >
        <a-spin size="small"></a-spin>
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
import { debounce, isEqual } from 'lodash-es'

export default {
  name: 'SelectSearch',
  bem: {
    b: 'staff-select'
  },

  data() {
    return {
      // 搜索关键字
      keyword: '',
      // 选择的会员
      selected: undefined
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    labelHtml: {
      type: Function,
      default: (label, keyword) => {
        return label.replace(
          new RegExp(keyword, 'g'),
          `\<span class='global-highlight-color'\>${keyword}\<\/span\>`
        )
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    isSrcoll: {
      type: Boolean,
      default: false
    },
    placeholder: String
  },
  model: {
    props: 'value',
    event: 'change'
  },
  computed: {
    isSearchNone() {
      return this.keyword !== '' && !this.list.length
    }
  },
  watch: {
    list(newValue, oldValue) {
      if (isEqual(newValue, oldValue) || !newValue.length) return
      // 默认选中第一项 blur时起作用，不使用默认，补卡弹窗会影响到页面的搜索
      // this.selected = newValue[0].value
    },
    selected(val) {
      // 防止不选择清空
      if (this.list.length === 0) {
        this.selected = ''
        this.$emit('change', '')
      }
    }
  },
  components: {},
  methods: {
    // 搜索会员
    onSearch: debounce(function(val) {
      let str = val.trim()
      if (this.keyword === str) return
      this.keyword = str
      if (str !== '') {
        this.$emit('search', str)
      }
    }, 200),
    // 检测清空选中
    onChange(val) {
      console.log('onChange', val)
      !val && this.$emit('change', this.selected)
    },
    // 选择发生变化
    onSelect(val) {
      console.log('onSelect', val, this.list)
      const data = val
      if (this.list.length === 0) {
        this.selected = ''
        data = ''
      }
      this.$emit('change', data)
    },
    // 会员搜索框失去焦点
    onBlur() {
      console.log('onBlur', this.selected)
      this.$emit('blur', this.selected)
    },
    // 聚焦时先清空历史搜索
    onFocus() {
      this.keyword = ''
    },
    scroll: debounce(function(e) {
      const { target } = e
      if (
        Math.floor(target.scrollTop) + target.clientHeight >
          target.scrollHeight - 20 &&
        this.isSrcoll
      ) {
        if (!this.loading) {
          this.$emit('onScroll', data)
        }
      }
    }, 200)
  }
}
</script>
