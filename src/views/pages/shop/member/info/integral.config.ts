export const columns = () => {
  return [
    {
      title: '时间',
      dataIndex: 'action_time'
    },
    {
      title: '积分',
      dataIndex: 'points'
    },
    {
      title: '途径',
      scopedSlots: { customRender: 'source_type' },
      dataIndex: 'source_type'
    },
    {
      title: '剩余积分',
      dataIndex: 'remain_points'
    },
    {
      title: '操作人',
      dataIndex: 'operator_name'
    },
    {
      title: '备注',
      dataIndex: 'remark'
    }
  ]
}
