<template>
  <a-select
    v-model="sValue"
    :showSearch="showSearch"
    :disabled="disabled"
    :allowClear="false"
    :showArrow="showArrow"
    :placeholder="placeholder"
    :defaultActiveFirstOption="false"
    :filterOption="false"
    :notFoundContent="notFoundContent"
    v-bind="$attrs"
    @popupScroll="onScroll"
    @select="onSelect"
    @search="onSearch"
  >
    <a-select-option
      v-for="(item, index) in list"
      :value="item[_key]"
      :key="index"
    >
      <span>
        {{ item[_name] }}
      </span>
    </a-select-option>
    <a-select-option
      disabled
      :key="new Date() + Math.random()"
      class="search-tip"
      v-if="loading"
    >
      <a-spin size="small"></a-spin>
    </a-select-option>
    <a-select-option
      disabled
      class="search-tip"
      :key="new Date() + Math.random()"
      v-if="finished"
    >
      已经到底啦
    </a-select-option>
  </a-select>
</template>

<script>
import { debounce } from 'lodash-es'

export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    finished: {
      type: [Object, Boolean],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    notFoundContent: {
      type: String,
      default: ''
    },
    _key: {
      type: String,
      default: 'id'
    },
    _name: {
      type: String,
      default: 'product_name'
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    showArrow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sValue: ''
    }
  },
  watch: {
    value: {
      handler(v) {
        this.sValue = v
      },
      immediate: true
    }
  },
  methods: {
    onSelect(val) {
      this.$emit('select', val)
    },
    onSearch: debounce(function(val) {
      console.log('search', val)
      this.$emit('search', val)
    }, 500),
    onScroll: debounce(function(e) {
      const { target } = e
      if (
        Math.floor(target.scrollTop) + target.clientHeight >
        target.scrollHeight - 20
      ) {
        if (!this.finished) {
          this.$emit('load')
        }
      }
    }, 200)
  }
}
</script>

<style></style>
