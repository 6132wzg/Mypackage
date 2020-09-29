export const columns = () => {
  return [
    {
      title: '流水号',
      dataIndex: 'flow_id',
      width: 160
    },
    {
      title: '金额(元)',
      titleTotal: '流水总金额(元)',
      dataIndex: 'price',
      scopedSlots: { customRender: 'price' },
      sorter: true
    },
    {
      title: '收银方式',
      dataIndex: 'pay_channel'
    },
    {
      title: '关联订单号',
      dataIndex: 'order_id',
      scopedSlots: { customRender: 'member_name' }
    },
    {
      title: '类型',
      dataIndex: 'flow_type',
      scopedSlots: { customRender: 'flow_type' }
    },
    {
      title: '操作人',
      width: 90,
      dataIndex: 'operator_name'
    },
    {
      title: '收款时间',
      dataIndex: 'flow_time',
      sorter: true
    },
    {
      title: '备注',
      dataIndex: 'remark',
      scopedSlots: { customRender: 'remark' }
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 100,
      scopedSlots: { customRender: 'action' }
    }
  ]
}

export const totalColumns = () => {
  return [
    {
      titleTotal: '流水总金额(元)',
      dataIndex: 'price'
    }
  ]
}
