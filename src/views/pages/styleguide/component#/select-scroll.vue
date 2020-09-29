<template>
  <div :class="b()">
    <p>默认的搜索</p>
    <st-select-scroll
      style="width: 150px"
      class="mg-r24 mg-b12"
      _label="name"
      _value="id"
      _keyword="coupon_name"
      v-model="listValue"
      :loading="isLoading"
      :page="page"
      :options="list"
      @change="onChange"
      @refresh="onSearch(true, $event)"
      @search="onSearch(true, $event)"
      @scroll="onSearch(false, $event)"
    ></st-select-scroll>
    <p>默认的搜索 + showArrow为true</p>
    <st-select-scroll
      style="width: 150px"
      class="mg-r24 mg-b12"
      _label="name"
      _value="id"
      _keyword="coupon_name"
      showArrow
      v-model="listValue"
      :loading="isLoading"
      :isEnd="isEnd"
      :options="list"
      @change="onChange"
      @refresh="onSearch(true, $event)"
      @search="onSearch(true, $event)"
      @scroll="onSearch(false, $event)"
    ></st-select-scroll>
    <p>关闭搜索、showArrow为true (建议直接用st-select）</p>
    <st-select-scroll
      style="width: 150px"
      class="mg-r24 mg-b12"
      _label="name"
      _value="id"
      _keyword="coupon_name"
      showArrow
      v-model="list2Value"
      :isScroll="false"
      :showSearch="false"
      :options="list2"
      @change="onChange"
    ></st-select-scroll>
    <st-table
      class="props-table"
      :columns="propsColumns"
      :dataSource="propsList"
      :page="false"
      :stripe="false"
    ></st-table>
    <st-table
      class="event-table"
      :columns="eventColumns"
      :dataSource="eventList"
      :page="false"
      :stripe="false"
    ></st-table>
  </div>
</template>

<script>
export default {
  bem: {
    b: 'style-guide-select-scroll'
  },
  data() {
    return {
      model: 0,
      keyword: '优惠券',
      isLoading: false,
      isEnd: false,
      page: {
        current_page: 1,
        total_pages: 5,
        size: 10
      },
      listValue: 1,
      propsColumns: [
        {
          title: `参数`,
          width: 200,
          dataIndex: 'key'
        },
        {
          title: `说明`,
          dataIndex: 'desc'
        },
        {
          title: `类型`,
          width: 100,
          dataIndex: 'type'
        },
        {
          title: `默认值`,
          width: 200,
          dataIndex: 'value'
        }
      ],
      propsList: [
        {
          key: '_label',
          desc: 'label字段名转译',
          type: 'string',
          value: 'label'
        },
        {
          key: '_value',
          desc: 'value字段名转译',
          type: 'string',
          value: 'value'
        },
        {
          key: '_keyword',
          desc: '搜索关键词字段名转译',
          type: 'string',
          value: 'keyword'
        },
        {
          key: 'labelHtml',
          desc: '自定义格式化label, 默认为搜索关键词高亮',
          type: 'string',
          value: `function(label, keyword){}`
        },
        {
          key: 'loading',
          desc: '接口请求状态',
          type: 'boolean',
          value: 'false'
        },
        {
          key: 'isSrcoll',
          desc: '是否可以滚动',
          type: 'boolean',
          value: 'true'
        },
        {
          key: 'isEnd',
          desc:
            '是否滚动已到底部, 可用page对象代替（page即为列表接口的page对象）',
          type: 'boolean',
          value: 'true'
        },
        {
          key: 'page',
          desc:
            '是否滚动已到底部, page为列表接口的page对象, {current_page, total_pages}',
          type: 'object',
          value: 'true'
        },
        {
          key: 'showSearch',
          desc: '是否开启搜索模式',
          type: 'boolean',
          value: 'true'
        },
        {
          key: 'showArrow',
          desc: '是否展示使用下拉箭头',
          type: 'boolean',
          value: 'false'
        },
        {
          key: 'allowClear',
          desc:
            '是否启用清除功能 (清除功能也受showSearch控制，当showSearch为true时，启用清除功能)',
          type: 'boolean',
          value: 'false'
        },
        {
          key: 'query',
          desc: '联动条件',
          type: 'object',
          value: ''
        },
        {
          key: 'notContent',
          desc: '无数据插槽',
          type: 'slot',
          value: '无数据'
        },
        {
          key: 'notFoundContent',
          desc: 'notFoundContent',
          type: 'slot',
          value: ''
        },
        {
          key: 'suffixIcon',
          desc:
            '图标插槽（showArrow属性与suffixIcon 存在冲突，所以showArrow为false时不传）',
          type: 'string|slot',
          value: ''
        }
      ],
      eventColumns: [
        {
          title: `事件名称`,
          width: 200,
          dataIndex: 'key'
        },
        {
          title: `说明`,
          dataIndex: 'desc'
        },
        {
          title: `回调参数`,
          width: 200,
          dataIndex: 'value'
        }
      ],
      eventList: [
        {
          key: 'change',
          desc: '选择变更事件',
          value: 'function(selected){}'
        },
        {
          key: 'refresh',
          desc: '联动条件变化触发刷新',
          value: `function({ [_keyword]: '', ...query } ){}`
        },
        {
          key: 'search',
          desc: '查询关键词变化触发搜索',
          value: `function({ [_keyword]: '', ...query } ){}`
        },
        {
          key: 'scroll',
          desc: '下拉滚动，加载更多',
          value: `function({ [_keyword]: '', ...query } ){}`
        }
      ],
      list: [
        { name: '优惠券1', id: 1 },
        { name: '优惠券2', id: 2 },
        { name: '优惠券3', id: 3 },
        { name: '优惠券4', id: 4 },
        { name: '优惠券5', id: 5 },
        { name: '优惠券6', id: 6 },
        { name: '优惠券7', id: 7 },
        { name: '优惠券8', id: 8 },
        { name: '优惠券9', id: 9 },
        { name: '优惠券10', id: 10 }
      ],
      list2Value: 1,
      list2: [
        { name: '优惠券1', id: 1 },
        { name: '优惠券2', id: 2 },
        { name: '优惠券3', id: 3 },
        { name: '优惠券4', id: 4 },
        { name: '优惠券5', id: 5 },
        { name: '优惠券6', id: 6 },
        { name: '优惠券7', id: 7 },
        { name: '优惠券8', id: 8 },
        { name: '优惠券9', id: 9 },
        { name: '优惠券10', id: 10 }
      ]
    }
  },
  methods: {
    // mock逻辑仅供参考
    onSearch(isReload, query) {
      if (query && query.coupon_name) this.keyword = query.coupon_name
      if (isReload) {
        this.page.current_page = 1
        this.isEnd = false
        this.page.total_pages = Math.floor(Math.random() * 7) + 3
      } else {
        this.page.current_page += 1
      }
      this.isLoading = true
      if (this.page.current_page > this.page.total_pages) return
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        const list = []
        for (
          let i = 0, len = this.page.size * this.page.current_page;
          i < len;
          i++
        ) {
          list.push({
            name: this.keyword + (i + 1),
            id: i + 1
          })
        }
        this.list = list
        this.isLoading = false
        this.isEnd = this.page.current_page >= this.page.total_pages
      }, (Math.floor(Math.random() * 12) + 3) * 100)
    },
    onChange(e) {
      console.log('change', e)
    }
  }
}
</script>
<style lang="less">
.style-guide-select-scroll {
  .st-table .ant-table .ant-table-tbody tr > td {
    padding-right: 24px;
  }
  .st-table .ant-table .ant-table-tbody tr > td:first-child {
    font-size: 12px;
    color: #003a8c;
  }

  .props-table .ant-table .ant-table-tbody tr > td:nth-last-child(2) {
    font-size: 12px;
    color: #c41d7f;
  }
  .event-table .ant-table .ant-table-tbody tr > td:nth-last-child(1) {
    font-size: 12px;
    color: #c41d7f;
  }
}
</style>
