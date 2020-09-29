export const columns = () => [
  {
    title: '商品类型',
    scopedSlots: { customRender: 'product_type' },
    width: 140,
    dataIndex: 'product_type'
  },
  {
    title: '商品名称',
    width: 140,
    dataIndex: 'product_name'
  },
  {
    title: '支付时间',
    width: 110,
    scopedSlots: { customRender: 'pay_finished_time' },
    dataIndex: 'pay_finished_time'
  },
  {
    title: '门店名称',
    width: 100,
    dataIndex: 'shop_name'
  },
  {
    title: '状态',
    scopedSlots: { customRender: 'order_status' },
    width: 100,
    dataIndex: 'order_status'
  },
  {
    title: '原价(元)',
    width: 80,
    dataIndex: 'total_price'
  },
  {
    title: '减免(元)',
    width: 80,
    dataIndex: 'reduce_price'
  },
  {
    title: '优惠(元)',
    width: 80,
    scopedSlots: { customRender: 'discount_price' },
    dataIndex: 'discount_price'
  },
  {
    title: '实收(元)',
    width: 80,
    dataIndex: 'pay_price'
  },
  {
    title: '退款',
    width: 80,
    scopedSlots: { customRender: 'refund_price' },
    dataIndex: 'refund_price'
  },
  {
    title: '会员姓名',
    width: 100,
    dataIndex: 'member_name'
  },
  {
    title: '手机号',
    scopedSlots: { customRender: 'member_mobile' },
    width: 120,
    dataIndex: 'member_mobile'
  },
  {
    title: '销售',
    width: 100,
    scopedSlots: { customRender: 'staff_sale_name' },
    dataIndex: 'staff_sale_name'
  },
  {
    title: '订单编号',
    width: 160,
    scopedSlots: { customRender: 'order_id' },
    dataIndex: 'order_id'
  },
  {
    title: '创建时间',
    width: 110,
    scopedSlots: { customRender: 'created_time' },
    dataIndex: 'created_time'
  }
]
