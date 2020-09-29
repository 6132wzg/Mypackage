export const columns = () => {
  return [
    {
      title: '姓名',
      dataIndex: 'member_name'
    },
    {
      title: '手机号',
      dataIndex: 'member_mobile',
      align: 'right'
    },
    {
      title: '用户等级',
      dataIndex: 'member_level'
    },
    {
      title: '惩罚开始时间',
      dataIndex: 'start_time',
      align: 'right'
    },
    {
      title: '惩罚结束时间',
      dataIndex: 'end_time',
      align: 'right'
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' },
      width: 80
    }
  ]
}
