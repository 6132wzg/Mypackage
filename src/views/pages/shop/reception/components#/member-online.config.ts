export const columns = () => {
  return [
    {
      title: '姓名',
      dataIndex: 'member_name'
    },
    {
      title: '入场时间',
      dataIndex: 'entry_time',
      scopedSlots: { customRender: 'entry_time' }
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 140,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
