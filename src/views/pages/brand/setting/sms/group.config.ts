export const recordColumns = () => {
  return [
    {
      title: '发送时间',
      dataIndex: 'send_time',
      width: 160
    },
    {
      title: '发送内容',
      dataIndex: 'content',
      scopedSlots: { customRender: 'content' }
    },
    {
      title: '接收人',
      dataIndex: 'received_user',
      width: 140
    },
    {
      title: '接收人数',
      dataIndex: 'received_count',
      width: 100,
      scopedSlots: { customRender: 'received_count' }
    },
    {
      title: '发送状态',
      dataIndex: 'send_status_text',
      width: 100,
      scopedSlots: { customRender: 'send_status_text' }
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      width: 90
    },
    {
      title: '操作',
      fixed: 'right',
      width: 140,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
export const templateColumns = () => {
  return [
    {
      title: '模版名称',
      width: 140,
      dataIndex: 'title'
    },
    {
      title: '模版内容',
      dataIndex: 'content'
    },
    {
      title: '操作',
      fixed: 'right',
      width: 140,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
