export const columns = () => [
  {
    title: '商品',
    dataIndex: 'product',
    width: 330,
    scopedSlots: { customRender: 'product' }
  },
  {
    title: '收货人',
    dataIndex: 'member_name'
  },
  {
    title: '手机号',
    dataIndex: 'mobile'
  },
  {
    title: '收货地址',
    dataIndex: 'receiving_address'
  },
  {
    title: '创建时间',
    dataIndex: 'created_time'
  },
  {
    title: '订单编号',
    dataIndex: 'id'
  },
  {
    title: '备注',
    dataIndex: 'description'
  },
  {
    title: '快递公司',
    dataIndex: 'express_company'
  },
  {
    title: '快递单号',
    dataIndex: 'express_number'
  }
]
