export const columns = [
  {
    title: '团课名称',
    dataIndex: 'course_name',
    width: 200,
    scopedSlots: { customRender: 'course_name' }
  },
  {
    title: '课程类别',
    dataIndex: 'category_name'
  },
  {
    title: '课程强度',
    dataIndex: 'strength_level',
    width: 140,
    scopedSlots: { customRender: 'strength_level' }
  },
  {
    title: '时长(分钟)',
    sorter: true,
    dataIndex: 'duration'
  },
  {
    title: '参考课时费(元)',
    dataIndex: 'price'
  },
  {
    title: '发布渠道',
    dataIndex: 'publish_name'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 140,
    scopedSlots: { customRender: 'action' }
  }
]
