<template>
  <div :class="b()">
    <select-search
      v-model="selected"
      :list="lists"
      class="-search-select"
      :placeholder="placeholder"
      @scroll="scroll"
      @change="onChange"
      @search="onSearch"
      @blur="onBlur"
    ></select-search>
  </div>
</template>
<script>
import { cloneDeep, debounce, get, isEqual } from 'lodash-es'
import { tap } from 'rxjs/operators'
import { IndexService } from './staff-select.service'
import SelectSearch from './select-search.vue'

export default {
  name: 'PageShopReception',
  bem: {
    b: 'member-select'
  },
  components: {
    SelectSearch
  },
  serviceInject() {
    return {
      service: IndexService
    }
  },
  rxState() {
    const { list$, loading$, isEnd$ } = this.service
    return {
      list: list$,
      loading: loading$,
      isEnd: isEnd$
    }
  },
  data() {
    return {
      selected: undefined,
      // 搜索会员的关键字
      searchText: '',
      // 搜索会员的最后一次关键字
      lastSearchText: '',
      page: {
        current_page: 1,
        size: 10
      }
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: String,
    type: {
      type: String,
      default: ''
    }
  },
  computed: {
    lists() {
      return this.list.map(item => ({
        label: this.selectItemLabel(item),
        value: item.id
      }))
    }
  },
  created() {
    this.selected = this.value
    this.value &&
      this.service.getMemberList({ keyword: this.value }, this.type).subscribe()
  },
  methods: {
    selectItemLabel(item) {
      return `${item.staff_name} ${item.mobile}`
    },
    // 搜索会员
    onSearch(val) {
      this.page.current_page = 1
      this.service.setMemberList([])
      this.service
        .getMemberList({ keyword: val, ...this.page }, this.type)
        .subscribe()
    },
    // 选择发生变化，(包括选择和取消)
    onChange(val) {
      console.log('选中变更')
      this.$emit('change', val)
    },
    // 会员搜索框失去焦点
    onBlur(val) {
      console.log('清空数据')
      this.service.setMemberList([])
    },
    scroll: debounce(function(val) {
      if (this.isEnd) return
      this.page.current_page++
      this.service
        .getMemberList({ keyword: val, ...this.page }, this.type)
        .subscribe()
    }, 200)
  }
}
</script>
