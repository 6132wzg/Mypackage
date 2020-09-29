export const columns = () => [
  {
    title: '柜号',
    dataIndex: 'serial_num',
    scopedSlots: { customRender: 'serial_num' }
  },
  {
    title: '状态',
    dataIndex: 'lease_status',
    width: 70,
    scopedSlots: { customRender: 'lease_status' }
  },
  {
    title: '姓名',
    dataIndex: 'member_name',
    width: 90,
    scopedSlots: { customRender: 'member_name' }
  },
  {
    title: '手机号',
    dataIndex: 'member_mobile',
    scopedSlots: { customRender: 'member_mobile' }
  },
  {
    title: '余额(天)',
    dataIndex: 'remain_days',
    scopedSlots: { customRender: 'remain_days' }
  },
  {
    title: '租赁(天)',
    dataIndex: 'lease_days',
    scopedSlots: { customRender: 'lease_days' }
  },
  {
    title: '有效期',
    dataIndex: 'sell_time',
    width: 120,
    scopedSlots: { customRender: 'sell_time' }
  },
  {
    title: '销售',
    dataIndex: 'sale_name',
    width: 90,
    scopedSlots: { customRender: 'sale_name' }
  },
  {
    title: '合同编号',
    dataIndex: 'contract_number',
    scopedSlots: { customRender: 'contract_number' }
  },
  {
    title: '订单号',
    dataIndex: 'order_id',
    scopedSlots: { customRender: 'order_id' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 140,
    scopedSlots: { customRender: 'action' }
  }
]
