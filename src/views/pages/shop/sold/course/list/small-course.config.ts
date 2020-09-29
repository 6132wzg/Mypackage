export const columns = (vm: any) => [
  {
    title: `课程名`,
    dataIndex: 'course_name',
    fixed: 'left',
    width: 100,
    scopedSlots: { customRender: 'course_name' }
  },
  {
    title: '状态',
    dataIndex: 'course_status',
    width: 70,
    scopedSlots: { customRender: 'course_status' }
  },
  {
    title: '姓名',
    dataIndex: 'member_name',
    width: 90,
    scopedSlots: { customRender: 'member_name' }
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: 120,
    scopedSlots: { customRender: 'mobile' }
  },
  {
    title: '余额(节)',
    dataIndex: 'last_course_num',
    sorter: true
  },
  {
    title: '购课(节)',
    dataIndex: 'init_course_num'
  },
  {
    title: '有效期',
    dataIndex: 'sell_time',
    width: 160,
    scopedSlots: { customRender: 'sell_time' }
  },
  {
    title: '销售',
    dataIndex: 'sale_name',
    width: 90
  },
  {
    title: '负责人',
    dataIndex: 'staff_name',
    width: 90
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 140,
    scopedSlots: { customRender: 'action' }
  }
]
