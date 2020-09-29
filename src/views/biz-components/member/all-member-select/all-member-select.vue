<template>
  <st-select-scroll
    v-model="selected"
    isSrcoll
    showArrow
    v-bind="{
      ...$attrs
    }"
    :isEnd="isEnd"
    :loading="loading.getMemberList"
    :options="lists"
    :placeholder="placeholder"
    @scroll="scroll"
    @change="onChange"
    @search="onSearch"
    @blur="onBlur"
  >
    <span slot="notFoundContent">查无此用户</span>
  </st-select-scroll>
</template>
<script>
import { cloneDeep, debounce, get, isEqual } from 'lodash-es'
import { tap } from 'rxjs/operators'
import { IndexService } from './all-member-select.service'
// 搜索全量用户下拉框
export default {
  name: 'MemberAllMemberSelect',
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
    // 是否使用默认样式
    isNormalStyle: {
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
      },
      immediate: true
    }
  },
  computed: {
    lists() {
      return (
        this.list.map(item => ({
          label: this.selectItemLabel(item),
          value: item.id
        })) || []
      )
    }
  },
  created() {
    this.selected &&
      this.service.getMemberList({ keyword: this.selected }).subscribe()
  },
  methods: {
    selectItemLabel(item) {
      if (item.is_minors === 1) {
        return `${item.member_name}(未成年) ${
          item.parent_mobile
        }(${this.filterParentUserRole(item)})`
      }
      return `${item.member_name} ${item.mobile}`
    },
    filterParentUserRole(item) {
      return this.parent_types[item.parent_user_role]
    },
    // 搜索会员
    onSearch(query) {
      // 重置页数 与 数据
      this.page.current_page = 1
      this.service.setMemberList([])
      this.service.getMemberList({ ...query, ...this.page }).subscribe()
    },
    // 选择发生变化，(包括选择和取消)
    onChange(val) {
      console.log('选中变更')
      this.$emit('change', val)
    },
    // 会员搜索框失去焦点
    onBlur(val) {
      console.log('清空数据')
      val && this.$emit('change', val)
      this.service.setMemberList([])
    },
    scroll: debounce(function(query) {
      // if (this.isEnd) return
      this.page.current_page++
      this.service.getMemberList({ ...query, ...this.page }).subscribe()
    }, 200)
  }
}
</script>
