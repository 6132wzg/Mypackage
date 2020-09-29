<template>
  <!-- 这一级是为了使下拉元素放在这级div中(getPopupContainer)，避免对外层布局造成未知的影响 -->
  <div
    :class="{
      [b()]: true,
      [b('search')]: !showArrow && showSearch,
      [b('select')]: showArrow
    }"
  >
    <!-- showArrow属性与suffixIcon 存在冲突，所以showArrow为false时不传 -->
    <a-select
      v-model="selected"
      :class="{ 'no-rotate': !showArrow || showSearch }"
      :showSearch="showSearch"
      :allowClear="_allowClear"
      :placeholder="placeholder"
      :defaultActiveFirstOption="true"
      :filterOption="false"
      v-bind="{
        ...(showArrow ? { showArrow } : {}),
        ...(useBodyContainer
          ? {}
          : {
              getPopupContainer: triggerNode => {
                return triggerNode.parentNode
              }
            }),
        ...$attrs
      }"
      @popupScroll="scroll"
      @change="onChange"
      @search="onSearch"
      @select="onSelect"
      @blur="onBlur"
      @focus="onFocus"
      ref="selectScroll"
    >
      <!-- 搜索图标 -->
      <span slot="suffixIcon" v-if="!showArrow">
        <slot name="suffixIcon">
          <a-icon slot="suffixIcon" :type="$attrs.suffixIcon || 'search'" />
        </slot>
      </span>
      <!-- 无数据 -->
      <span slot="notFoundContent" v-if="!loading">
        <slot name="notFoundContent" v-if="isSearchNone">
          <span>无数据</span>
        </slot>
        <slot name="notContent" v-else>
          <span>无数据</span>
        </slot>
      </span>

      <a-select-option
        v-for="(item, index) in list"
        :value="item.value"
        :key="item.value || index"
      >
        <span v-html="labelHtml(item.label, keyword)">
          {{ item.label }}
        </span>
      </a-select-option>
      <!-- loading -->
      <a-select-option
        disabled
        :key="new Date() + Math.random()"
        v-if="(isScroll && list.length && !_isEnd) || loading"
      >
        <a-spin size="small"></a-spin>
      </a-select-option>
      <!-- 已经到底啦 -->
      <a-select-option
        disabled
        :key="new Date() + Math.random()"
        v-if="isScroll && list.length && _isEnd"
      >
        已经到底啦
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
import { debounce, isEqual } from 'lodash-es'

export default {
  name: 'StSelectScroll',
  bem: {
    b: 'st-select-scroll'
  },
  model: {
    props: 'selected',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Number],
      default: undefined
    },
    options: {
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
    isScroll: {
      type: Boolean,
      default: true
    },
    isEnd: {
      type: Boolean,
      default: true
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    showArrow: {
      type: Boolean,
      default: false
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    // string = lable 或 value
    filter: {
      type: [Boolean, String],
      default: false
    },
    _label: {
      type: String,
      default: 'label'
    },
    _value: {
      type: String,
      default: 'value'
    },
    // 搜索关键词字段名定义， 默认为 keyword， search refresh scroll 三个事件输出的参数为 {keyword: ''}
    _keyword: {
      type: String,
      default: 'keyword'
    },
    placeholder: String,
    // 联动条件
    query: {
      type: Object,
      default: () => {}
    },
    // useBodyContainer 是否使用body作为父级定位，默认为组件父级定位
    useBodyContainer: {
      type: Boolean,
      default: false
    },
    // 是否默认选中第一条
    isSelectFirst: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 搜索关键字
      keyword: '',
      selected: undefined
    }
  },
  computed: {
    list() {
      let list = this.options.map(item => ({
        label: item[this._label],
        value: item[this._value]
      }))
      if (this.filter) {
        list = list.filter(item => {
          return this.filter === 'label' || this.filter === 'value'
            ? item[this.filter].includes(this.keyword)
            : item[this._label].includes(this.keyword) ||
                item[this._value].includes(this.keyword)
        })
      }
      return [
        ...(this.$attrs.defaultLabel
          ? [{ label: this.$attrs.defaultLabel, value: -1 }]
          : []),
        ...list
      ]
    },
    _isEnd() {
      if (this.$attrs.page) {
        return (
          this.$attrs.page.current_page >= this.$attrs.page.total_pages ||
          !this.$attrs.page.total_pages
        )
      }
      return this.isEnd
    },
    _allowClear() {
      return this.showSearch ? true : this.allowClear
    },
    isSearchNone() {
      return this.keyword !== '' && !this.list.length
    }
  },
  watch: {
    value: {
      handler(v) {
        console.log('change', v)
        this.selected = v
      },
      immediate: true
    },
    lists: {
      deep: true,
      handler(newValue, oldValue) {
        if (isEqual(newValue, oldValue) || !newValue.length) return
        if (this.isSelectFirst) {
          // 默认选中第一项 blur时起作用
          this.selected = newValue[0].value
        }
      }
    },
    // 联动条件刷新监听
    query: {
      deep: true,
      handler(newValue, oldValue) {
        if (isEqual(newValue, oldValue)) return
        this.keyword = ''
        this.$emit('refresh', { ...newValue, [this._keyword]: '' })
      }
    }
  },
  components: {},
  created() {
    this.selected = this.value
  },
  methods: {
    // 搜索事件触发
    onSearch: debounce(function(val) {
      console.log(val)
      let str = val.trim()
      if (this.keyword === str) return
      this.keyword = str
      if (str !== '') {
        this.$emit('search', { [this._keyword]: str })
      }
    }, 200),
    // 检测清空选中
    onChange(val) {
      !val && this.$emit('change', val)
    },
    // 选择发生变化
    onSelect(val) {
      this.$emit('change', val)
    },
    // 搜索框失焦事件
    onBlur() {
      this.$emit('blur', this.selected)
    },
    // 聚焦时先清空历史搜索
    onFocus() {
      this.keyword = ''
    },
    // 滚动到底部时触发事件
    scroll: debounce(function(e) {
      const { target } = e
      if (
        Math.floor(target.scrollTop) + target.clientHeight >
          target.scrollHeight - 20 &&
        this.isScroll
      ) {
        if (!this.loading && !this._isEnd) {
          this.$emit('scroll', { [this._keyword]: this.keyword })
        }
      }
    }, 200)
  }
}
</script>
