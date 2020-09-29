<template>
  <st-select-scroll
    v-model="selected"
    :isEnd="isEnd"
    showArrow
    v-bind="$attrs"
    :loading="loading.getMemberList"
    :options="lists"
    :placeholder="placeholder"
    @change="onChange"
    @search="onSearch"
    @blur="onBlur"
  >
    <span slot="notFoundContent">暂无数据</span>
  </st-select-scroll>
</template>
<script>
import { cloneDeep, debounce, get, isEqual } from 'lodash-es'
import { tap } from 'rxjs/operators'
import { IndexService } from './index.service'

export default {
  name: 'PluginCouponSelect',
  serviceInject() {
    return {
      service: IndexService
    }
  },
  rxState() {
    const { list$, parent_types$, loading$, isEnd$ } = this.service
    return {
      list: list$,
      parent_types: parent_types$,
      loading: loading$,
      isEnd: isEnd$
    }
  },
  props: {
    value: {
      type: [String, Boolean, Number],
      default: undefined
    },
    placeholder: String,
    isInit: {
      type: Boolean,
      default: false
    }
  },
  model: {
    props: 'selected',
    event: 'change'
  },
  data() {
    return {
      selected: undefined,
      page: {
        current_page: 1,
        size: 10
      }
    }
  },
  watch: {
    value: {
      handler(v) {
        this.selected = v
      }
    }
  },
  computed: {
    lists() {
      return (
        this.list.map(item => ({
          label: item.coupon_name,
          value: item.id
        })) || []
      )
    }
  },
  created() {
    if (this.value) {
      this.selected = this.value
      this.service.getCouponList({ id: this.value }).subscribe()
    } else if (this.isInit) {
      this.onSearch('')
    }
  },
  methods: {
    // 搜索优惠券
    onSearch(query) {
      // 重置页数 与 数据
      this.page.current_page = 1
      this.service.setMemberList([])
      this.service.getCouponList({ ...query, ...this.page }).subscribe()
    },
    // 选择发生变化，(包括选择和取消)
    onChange(val) {
      this.$emit('change', val)
    },
    // 优惠券搜索框失去焦点
    onBlur(val) {
      val && this.$emit('change', val)
    }
  }
}
</script>
