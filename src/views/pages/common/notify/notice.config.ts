export const columns = () => {
  return [
    {
      title: '发送时间',
      dataIndex: 'send_time',
      width: 250
    },
    {
      title: '公告类型',
      dataIndex: 'notify_type',
      scopedSlots: { customRender: 'notify_type' },
      width: 250
    },
    {
      title: '公告标题',
      dataIndex: 'title',
      scopedSlots: { customRender: 'st-title' },
      width: 250
    },
    {
      title: '操作',
      dataIndex: 'actions',
      scopedSlots: { customRender: 'actions' },
      width: 250
    }
  ]
}
