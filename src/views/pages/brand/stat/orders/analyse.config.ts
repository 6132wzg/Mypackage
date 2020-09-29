export const columns = () => [
  {
    title: '商品类型',
    scopedSlots: { customRender: 'product_type' },
    width: 120,
    dataIndex: 'product_type'
  },
  {
    title: '客单价(元)',
    scopedSlots: { customRender: 'order_per_price' },
    width: 100,
    dataIndex: 'order_per_price'
  },
  {
    title: '总成单数',
    scopedSlots: { customRender: 'order_num' },
    width: 100,
    dataIndex: 'order_num'
  },
  {
    title: '日均单量',
    width: 100,
    dataIndex: 'day_per_order_num'
  },
  {
    title: '实收金额(元)',
    width: 100,
    dataIndex: 'paid_price'
  },
  {
    title: '原价(元)',
    width: 100,
    dataIndex: 'total_price'
  },
  {
    title: '折扣',
    width: 80,
    dataIndex: 'discount_percentage'
  },
  {
    title: '单日最高(元)',
    width: 100,
    dataIndex: 'day_max_price'
  },
  {
    title: '线上成单',
    scopedSlots: { customRender: 'online_total_num' },
    width: 100,
    dataIndex: 'online_total_num'
  },
  {
    title: '线上实收(元)',
    width: 100,
    dataIndex: 'online_paid_price'
  }
]
