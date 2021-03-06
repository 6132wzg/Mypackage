export const columns = vm => [
  {
    title: '上课场馆',
    fixed: 'left',
    width: 175,
    dataIndex: 'shop_name'
    // sorter: (a, b) => a.name.length - b.name.length
  },
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
    sorter: true,
    dataIndex: 'duration'
  },
  {
    title: '课程定价',
    sorter: true,
    dataIndex: 'sell_price',
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
    width: 100,
    scopedSlots: { customRender: 'action' }
  }
]
