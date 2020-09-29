export const columns = vm => [
  {
    title: '课程名称',
    dataIndex: 'course_name',
    width: 200,
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
    title: '发布渠道',
    dataIndex: 'publish_name',
    scopedSlots: { customRender: 'publish_name' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 140,
    scopedSlots: { customRender: 'action' }
  }
]
