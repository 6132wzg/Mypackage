export const columns = vm => [
  {
    title: '课程名称',
    dataIndex: 'course_name',
    width: 175,
    scopedSlots: { customRender: 'course_name' }
  },
  {
    title: '课程类型',
    dataIndex: 'category_name'
  },
  {
    title: '时长(分钟)',
    dataIndex: 'duration',
    sorter: true
  },
  {
    title: '支持上课门店',
    dataIndex: 'shops',
    scopedSlots: { customRender: 'shops' }
  },
  {
    title: '定价方式',
    dataIndex: 'price_setting',
    scopedSlots: { customRender: 'price_setting' }
  },
  {
    title: '课程定价',
    dataIndex: 'sell_price',
    sorter: true,
    scopedSlots: { customRender: 'sell_price' }
  },
  {
    title: `授课${vm.$c('coach')}数`,
    dataIndex: 'coaches',
    sorter: true,
    scopedSlots: { customRender: 'coaches' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 140,
    scopedSlots: { customRender: 'action' }
  }
]
