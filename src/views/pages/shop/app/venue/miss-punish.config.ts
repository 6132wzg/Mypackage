export const columns = [
  {
    title: '姓名',
    dataIndex: 'member_name'
  },
  {
    title: '手机号',
    dataIndex: 'member_mobile'
  },
  {
    title: '惩罚开始时间',
    dataIndex: 'start_time'
  },
  {
    title: '惩罚结束时间',
    dataIndex: 'end_time'
  },
  {
    title: '操作',
    key: 'operation',
    width: 120,
    scopedSlots: { customRender: 'action' }
  }
]
