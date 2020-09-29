export const columns = () => [
  {
    title: '姓名',
    dataIndex: 'member_name',
    width: 90,
    fixed: 'left'
  },
  {
    title: '手机号',
    dataIndex: 'member_mobile'
  },
  {
    title: '状态',
    dataIndex: 'use_status',
    width: 60,
    scopedSlots: { customRender: 'use_status' }
  },
  {
    title: `定金(元)`,
    dataIndex: 'price'
  },
  {
    title: '收款时间',
    dataIndex: 'created_time'
  },
  {
    title: '定金订单',
    dataIndex: 'order_id',
    width: 160
  },
  {
    title: '销售',
    dataIndex: 'seller'
  },
  {
    title: '收款人',
    dataIndex: 'payee'
  },
  {
    title: '到期时间',
    dataIndex: 'end_time'
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 140,
    scopedSlots: { customRender: 'action' }
  }
]
