export const columns = vm => [
  {
    title: '订单类型',
    width: 80,
    align: 'center',
    dataIndex: 'transfer_type'
  },
  {
    title: '商品类型',
    scopedSlots: { customRender: 'product_type' },
    width: 120,
    dataIndex: 'product_type'
  },
  {
    title: '订单总数',
    scopedSlots: { customRender: 'order_num' },
    width: 100,
    dataIndex: 'order_num'
  },
  {
    title: '已完成订单',
    scopedSlots: { customRender: 'order_completed_num' },
    width: 100,
    dataIndex: 'order_completed_num'
  },
  {
    title: '未完成订单',
    scopedSlots: { customRender: 'order_uncompleted_num' },
    width: 100,
    dataIndex: 'order_uncompleted_num'
  },
  {
    title: '已退款订单',
    scopedSlots: { customRender: 'order_refund_num' },
    width: 100,
    dataIndex: 'order_refund_num'
  },
  {
    title: '部分退款订单',
    scopedSlots: { customRender: 'order_part_refund_num' },
    width: 100,
    dataIndex: 'order_part_refund_num'
  },
  {
    title: '已取消订单',
    scopedSlots: { customRender: 'order_cancel_num' },
    width: 100,
    dataIndex: 'order_cancel_num'
  },
  {
    title: '实收金额(元)',
    width: 100,
    dataIndex: 'paid_price'
  },
  {
    title: '剩余应收(元)',
    width: 100,
    dataIndex: 'remainder_price'
  },
  {
    title: '退款(元)',
    width: 100,
    dataIndex: 'refund_price'
  },
  {
    title: '原价(元)',
    width: 100,
    dataIndex: 'total_price'
  },
  {
    title: '营销优惠(元)',
    width: 100,
    dataIndex: 'order_discount'
  },
  {
    title: '商家减免(元)',
    width: 100,
    dataIndex: 'reduce_price'
  }
]
export const totalColumns = () => [
  {
    title: '订单总数',
    scopedSlots: { customRender: 'order_num' },
    dataIndex: 'order_num'
  },
  {
    title: '已完成订单',
    scopedSlots: { customRender: 'order_completed_num' },
    dataIndex: 'order_completed_num'
  },
  {
    title: '未完成订单',
    scopedSlots: { customRender: 'order_uncompleted_num' },
    dataIndex: 'order_uncompleted_num'
  },
  {
    title: '已退款订单',
    scopedSlots: { customRender: 'order_refund_num' },
    dataIndex: 'order_refund_num'
  },
  {
    title: '部分退款订单',
    scopedSlots: { customRender: 'order_part_refund_num' },
    dataIndex: 'order_part_refund_num'
  },
  {
    title: '已取消订单',
    scopedSlots: { customRender: 'order_cancel_num' },
    dataIndex: 'order_cancel_num'
  },
  {
    title: '实收金额',
    unit: '¥',
    dataIndex: 'paid_price'
  },
  {
    title: '剩余应收',
    unit: '¥',
    dataIndex: 'remainder_price'
  },
  {
    title: '退款',
    unit: '¥',
    dataIndex: 'refund_price'
  },
  {
    title: '原价',
    unit: '¥',
    dataIndex: 'total_price'
  },
  {
    title: '营销优惠',
    unit: '¥',
    dataIndex: 'order_discount'
  },
  {
    title: '商家减免',
    unit: '¥',
    dataIndex: 'reduce_price'
  }
]
