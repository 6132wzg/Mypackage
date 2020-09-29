/**
 * 处理搜索条件与table的联动
 * table.mixin.js 与页面路由参数挂钩，
 * 本文件仅更新、监听 query 参数，当query参数发生变动时 触发getList方法，getList 需自己定义
 */
import { isPlainObject, pick, isEqual, debounce } from 'lodash-es'

export default {
  props: {
    defaultSelectedRowKeys: {
      type: Array,
      default: () => []
    },
    defaultSelectedRows: {
      type: Array,
      default: () => []
    },
    rowMapKey: {
      type: String,
      default: 'id'
    },
    defalutQuery: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      show: false,
      // 选中项目的keys
      selectedRowKeys: [],
      // 选中项的行数组
      selectedRows: [],
      rowMap: {},
      query: {
        current_page: 1,
        size: 10
      }
    }
  },
  computed: {
    // 合并初入传入 以及 组件自定义 的 查询参数
    _defalutQuery() {
      return {
        ...(this.customQuery || {}),
        ...this.defalutQuery
      }
    },
    searchQuery: {
      get() {
        return {
          ...this.customQuery,
          ...this._defalutQuery,
          ...this.query
        }
      },
      set(val) {
        this.query = { ...this.query, ...val }
      }
    },
    // 多选是否至少勾选一项
    isSelectedEnabled() {
      return this.selectedRowKeys.length > 0
    },
    // 没有一项选中
    isSelectedDisabled() {
      return this.selectedRowKeys.length === 0
    }
  },
  watch: {
    defaultSelectedRows: {
      deep: true,
      handler(newVal, oldVal) {
        if (isEqual(newVal, oldVal)) return
        this.selectedRows = newVal || []
        this.updateRowMap(newVal || [])
      }
    },
    defaultSelectedRowKeys: {
      deep: true,
      handler(newVal, oldVal) {
        if (isEqual(newVal, oldVal)) return
        this.selectedRowKeys = newVal || []
      }
    },
    query: {
      deep: true,
      handler: debounce(function(newVal, oldVal) {
        if (isEqual(!newVal || newVal, oldVal)) return
        console.log('query change', newVal)
        this.getList && this.getList(newVal)
      }, 200)
    }
  },
  methods: {
    init() {
      const { defaultSelectedRows } = this
      this.query = { ...this._defalutQuery, ...this.query }
      this.selectedRowKeys = this.defaultSelectedRowKeys
      this.selectedRows = defaultSelectedRows
      console.log('init', this.defaultSelectedRowKeys, this.defaultSelectedRows)
      this.updateRowMap(defaultSelectedRows)
      // this.getList()
    },
    /**
     * 筛选搜索 使用当前的query参数，只是页数到第一页  只做路由跳转 获取数据的行为在 beforeRouteUpdate 或 beforeEach中定义
     * @example
     *  ```html
     *      <st-button @click='onSearch'></st-button>
     *  ```
     */
    onSearch() {
      this.query = {
        ...this.searchQuery,
        current_page: 1
      }
    },
    /**
     * 多个字段下的搜索 this.onMultiSearch({a:1,b:2})
     */
    onMultiSearch(searchFieldsValue = {}) {
      if (!isPlainObject(searchFieldsValue)) {
        throw new Error(
          `[tableMixin] should provide searchFieldsValue is object but got ${typeof searchFieldsValue}`
        )
      }
      this.query = {
        ...this.searchQuery,
        ...searchFieldsValue,
        current_page: 1
      }
    },
    /**
     * 筛选重置
     */
    onSearchReset() {
      this.query = {
        ...this._defalutQuery,
        current_page: 1,
        size: this.searchQuery.size
      }
    },
    /**
     * 单个筛选项的即时搜索 @change="onSingleSearch('card_type',$event)"
     */
    onSingleSearch(key, data) {
      this.query = {
        ...this.searchQuery,
        ...{ [key]: data },
        current_page: 1
      }
    },
    /**
     * 关键词的即时搜索
     * @example 关键词搜索 去除其它query 页面至第一页，保留分页器
     *   `@change="onKeywordsSearch('keyword',$event)"`
     * @example 关键词搜索 保留id字段
     *   `@change="onKeywordsSearch('keyword',$event,['id'])"`
     */
    onKeywordsSearch(key, data, keepFields = []) {
      this.query = {
        [key]: data,
        ...pick(this.searchQuery, keepFields),
        current_page: 1,
        size: this.searchQuery.size
      }
    },
    // 重置 多选框
    onSelectionReset() {
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    onSelectionChange(selectedRowKeys, selectedRows) {
      console.log('changed', selectedRowKeys, selectedRows)
      this.selectedRowKeys = selectedRowKeys
      this.updateRowMap(selectedRows)
      this.selectedRows = this.calcSelectedRows(selectedRowKeys)
    },
    updateRowMap(selectedRows) {
      const rowMap = this.rowMap
      if (selectedRows instanceof Array) {
        selectedRows.forEach(row => {
          rowMap[row[this.rowMapKey] || row['id']] = row
        })
        this.rowMap = rowMap
      }
      console.log('rowMap', this.rowMap)
    },
    calcSelectedRows(selectedRowKeys) {
      const _selectedRows = []
      const { rowMap } = this
      selectedRowKeys.forEach(key => {
        if (rowMap[key]) {
          _selectedRows.push(rowMap[key])
        }
      })
      return _selectedRows
    },
    getTableQuery(pagination, filter, sorter) {
      // 排序字段 排序顺序
      let sort_by, sort_order
      if (sorter && sorter.field) {
        sort_by = sorter.field
        sort_order = { ascend: 'asc', descend: 'desc' }[sorter.order]
      }
      if (!pagination) {
        throw new Error(
          `[tableMixin] pagination is not provide ${typeof pagination}`
        )
      }
      return {
        current_page: pagination.current ? pagination.current : 1,
        size: pagination.pageSize,
        sort_by,
        sort_order
      }
    },
    // 表格更新
    onTableChange(pagination, filter, sorter) {
      this.query = {
        ...this.searchQuery,
        ...this.getTableQuery(pagination, filter, sorter),
        current_page: pagination.current ? pagination.current : 1
      }
    }
  }
}
