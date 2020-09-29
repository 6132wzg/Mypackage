export const columns = () => [
  {
    title: '活动名称',
    width: 140,
    dataIndex: 'activity_name'
  },
  {
    title: `商品类型`,
    scopedSlots: { customRender: 'product_type' },
    width: 100,
    dataIndex: 'product_type'
  },
  {
    title: `有效时间`,
    scopedSlots: { customRender: 'temp' },
    width: 200,
    dataIndex: 'temp'
  },
  {
    title: `活动状态`,
    scopedSlots: { customRender: 'activity_status' },
    width: 100,
    dataIndex: 'activity_status'
  },
  {
    title: '订单数',
    scopedSlots: { customRender: 'order_num' },
    width: 100,
    dataIndex: 'order_num'
  },
  {
    title: `剩余库存`,
    width: 120,
    dataIndex: 'stock_num'
  },
  {
    title: '备注',
    scopedSlots: { customRender: 'description' },
    width: 120,
    dataIndex: 'description'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'operator' },
    width: 100,
    dataIndex: 'operator'
  }
]
