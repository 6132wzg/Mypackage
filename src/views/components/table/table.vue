<script>
import { merge, omit, map, forEach } from 'lodash-es'
function addOddEvenKey(dataSource) {
  for (let i in dataSource) {
    dataSource[i].$_oddEvenKey = i % 2 ? `even-${i}` : `odd-${i}`
    if (dataSource[i].children) {
      for (let j in dataSource[i].children) {
        dataSource[i].children[
          j
        ].$_oddEvenKey = `${dataSource[i].$_oddEvenKey}-${j}`
      }
      if (dataSource[i].children.length) {
        // 实际使用$_children来显示展开图标，因为没有元素时不需要展开
        dataSource[i].$_children = dataSource[i].children
      }
    }
  }
  return dataSource
}
export default {
  name: 'StTable',
  props: {
    customRowSub: {
      type: Number,
      default: 0
    },
    page: {
      type: null
    },
    alertSelection: {
      type: Object,
      default: () => {
        return {}
      }
    },
    pagination: {
      type: null,
      default: () => {
        return {
          size: 'small'
        }
      }
    },
    query: {
      type: Object,
      default: () => {}
    },
    dataSource: {
      type: Array,
      required: true,
      default: () => []
    },
    scroll: {
      type: Object,
      default: () => null
    },
    /**
     * client | server 分页模式
     */
    pageMode: {
      type: String,
      default: 'server'
    },
    simplePage: {
      type: Boolean,
      default: false
    },
    stripe: {
      type: Boolean,
      default: true
    },
    // 无数据样式配置， 可以传入组件模版
    emptyText: {
      type: [String, Object],
      default: ''
    },
    /**
     * 需要合并行的字段集合，可以是单独的一个key，也可以是一个数组，支持传入字段格式化函数
     * 参数示例： 'key' 或 ['key', 'key1', 'key2'] 或 [{ key: 'key', formatter: (value, record, index) => { return +value } }]
     * 注意 启用了该字段，合并的字段就不能使用slot,更不支持事件绑定 TODO: 待扩展可自定义slot
     */
    rowSpanKey: {
      type: [String, Array],
      default: ''
    }
  },
  watch: {
    dataSource() {
      if (this.pageMode === 'client') {
        this.current = 1
      }
    }
  },
  data() {
    return {
      pageSize: 20,
      total: 0,
      current: 1,
      count: 1
    }
  },
  computed: {
    // 合并行字段处理，目前仅支持合并行数据formatter，不支持自定义模版和slot字段
    columns() {
      return this.$attrs.columns.map(item => {
        const rowSpanItem = this.rowSpanMap[item.dataIndex]
        if (rowSpanItem) {
          item.customRender = (value, row, index) => {
            const obj = {
              children: rowSpanItem._formatter
                ? rowSpanItem._formatter(value, row, index)
                : value,
              attrs: {
                rowSpan: 1
              }
            }
            if (rowSpanItem[value] && rowSpanItem[value].length > 1) {
              if (rowSpanItem[value].firstKey === index) {
                obj.attrs.rowSpan = rowSpanItem[value].length
              } else {
                obj.attrs.rowSpan = 0
              }
            }
            return obj
          }
        }
        return item
      })
    },
    // 合并行字段 合并信息收集
    rowSpanMap() {
      if (!this.rowSpanKey) return false
      /**
       * rowSpanMap格式 dataInex 为需要合并的字段key值，key 为该字段其中一个value值， length 为该值的重复次数， firstKey为该值第一次出现的下标
       * {'dataIndex': { formatter, 'key': { length: 1, firstKey: index }}}
       * 注意：数据源一定是排好的顺序 即相同数据类型一定要连在一起
       */
      let rowSpanMap = {}
      const setRowSpanMap = (itemKey, { key, index, formatter }) => {
        const rowSpanItem = rowSpanMap[itemKey] || {}
        if (rowSpanItem[key]) {
          rowSpanItem[key].length += 1
        } else {
          rowSpanItem._formatter = formatter
          rowSpanItem[key] = { length: 1, firstKey: index }
        }
        rowSpanMap[itemKey] = rowSpanItem
      }
      // 遍历数据源，收集字段合并信息
      this.dataSource.map((item, index) => {
        let key = '',
          formatter = null
        if (typeof this.rowSpanKey === 'string') {
          setRowSpanMap(this.rowSpanKey, { key: item[this.rowSpanKey], index })
        } else {
          this.rowSpanKey.map(itemKey => {
            if (typeof itemKey === 'string') {
              setRowSpanMap(itemKey, { key: item[itemKey], index })
            } else {
              setRowSpanMap(itemKey.key, {
                key: item[itemKey.key],
                formatter: itemKey.formatter,
                index
              })
            }
          })
        }
      })
      return rowSpanMap
    },
    locale() {
      return {
        emptyText: this.emptyText || <st-no-data />
      }
    },
    tableDataSource() {
      addOddEvenKey(this.dataSource)
      return this.dataSource
    },
    defaultPageSize() {
      return this.simplePage ? 10 : 20
    },
    tablePagination: {
      get() {
        if (this.pagination === false || this.page === false) {
          return false
        }
        let sub = this.customRowSub
        let total = this.total > sub ? this.total - sub : 0
        const pageSize =
          this.pageMode === 'client' ? this.pageSize : this.defaultPageSize
        let _p = merge(
          {
            current: this.current,
            pageSize,
            total,
            showTotal: function(total, range) {
              return `共${total - sub}条`
            },
            showSizeChanger: true
          },
          // 去除无用的pagination属性
          omit(this.pagination, [
            'total_counts',
            'total_pages',
            'current_page',
            'size'
          ])
        )
        if (this.page) {
          if (this.page.size) {
            _p.pageSize = +this.page.size || this.defaultPageSize
          }
          if (this.page.current_page) {
            _p.current = +this.page.current_page || 1
          }
          if (this.page.total_counts) {
            _p.total = +this.page.total_counts || 0
          }
          if (this.simplePage) {
            _p.simple = true
          }
        }
        return _p
      }
    }
  },
  methods: {
    onCLick() {
      this.alertSelection.onReset()
    },
    expand(...ret) {
      this.$emit('expand', ...ret)
    },
    onChange(pagination, ...rest) {
      if (this.pageMode === 'client') {
        this.current = pagination.current
        this.total = pagination.total
        this.pageSize = pagination.pageSize
      }
      const query = this.query
      this.$emit('change', { ...pagination, query }, ...rest)
    },
    renderChildren() {
      return map(this.$slots, (vnode, slot) => (
        <template slot={slot}>{vnode}</template>
      ))
    },
    // 在有children的情况下显示自定义图标
    // CustomExpandIcon(props) {
    //   let text = ''
    //   let className = 'st-expand-row-icon'
    //   if (props.record.children && props.record.children.length) {
    //     const type = props.expanded ? 'table-up' : 'table-down'
    //     text = <st-icon type={type} />
    //     className = 'st-expand-row-icon mg-r8'
    //   }
    //   return (
    //     <span
    //       class={className}
    //       onClick={e => props.onExpand(props.record, e)}
    //       style={{ cursor: 'pointer' }}
    //     >
    //       {text}
    //     </span>
    //   )
    // },
    rowClassName(record) {
      if (this.stripe) {
        return record.$_oddEvenKey
      } else {
        return ''
      }
    }
  },
  render(h) {
    let props = {
      pagination: this.tablePagination,
      locale: this.locale,
      dataSource: this.tableDataSource,
      // scroll: this.tableDataSource.length >= 1 ? this.scroll : {},
      rowClassName: this.rowClassName,
      childrenColumnName: '$_children',
      indentSize: 16,
      ...this.$attrs
    }
    if (this.tableDataSource.length >= 1 && this.scroll) {
      props.scroll = this.scroll
    }
    // 如果存在合并行则使用处理后的columns
    if (this.rowSpanKey) {
      props.columns = this.columns
    }
    // 判断是否是父子表格 先去掉 自定义图标和自定义expandedRowRender冲突
    // props.expandIcon = this.CustomExpandIcon
    const ce = this.alertSelection.onReset
      ? h('div', { class: 'st-table-wapper' }, [
          h('a-alert', {
            class: 'st-table-alert mg-b8',
            props: { type: 'info', showIcon: true },
            scopedSlots: {
              message: props =>
                h('div', { class: 'st-table-alert__content' }, [
                  '已选 ',
                  h(
                    'span',
                    { class: 'st-table-alert__count' },
                    this.$attrs.rowSelection.selectedRowKeys.length || 0
                  ),
                  ' 条数据',
                  h(
                    'a',
                    {
                      class: 'mg-l24 st-table-alert__reload',
                      on: {
                        click: this.onCLick
                      }
                    },
                    '取消'
                  )
                ])
            }
          }),
          h(
            'a-table',
            {
              class: [
                'st-table',
                this.stripe ? '' : 'st-table-normal',
                !this.tableDataSource.length && 'st-table-nodata'
              ],
              props,
              on: {
                change: this.onChange,
                expand: this.expand
              },
              scopedSlots: this.$scopedSlots,
              slot: this.$slots
            },
            this.renderChildren()
          )
        ])
      : h(
          'a-table',
          {
            class: [
              'st-table',
              this.stripe ? '' : 'st-table-normal',
              !this.tableDataSource.length && 'st-table-nodata'
            ],
            props,
            on: {
              change: this.onChange,
              expand: this.expand
            },
            scopedSlots: this.$scopedSlots,
            slot: this.$slots
          },
          this.renderChildren()
        )
    return ce
  }
}
</script>
