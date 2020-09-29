export const columns = () => [
  {
    title: '课程',
    width: 180,
    dataIndex: 'course_name'
  },
  {
    title: '种类',
    width: 180,
    dataIndex: 'course_category'
  },
  {
    title: '课程类型',
    width: 180,
    dataIndex: 'course_type'
  },
  {
    title: '上课门店',
    width: 180,
    dataIndex: 'shop_name',
    scopedSlots: {
      customRender: 'shop_name'
    }
  }
]
