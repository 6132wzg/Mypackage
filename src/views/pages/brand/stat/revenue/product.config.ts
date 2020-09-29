export const columns = () => [
  {
    title: ' 商品名称',
    width: 200,
    dataIndex: 'product_name'
  },
  {
    title: '客单价(元)',
    width: 120,
    dataIndex: 'per_order_amount'
  },
  {
    title: '订单数',
    scopedSlots: { customRender: 'total_num' },
    width: 100,
    dataIndex: 'total_num'
  },
  {
    title: '原价(元)',
    width: 100,
    dataIndex: 'total_amount'
  },
  {
    title: '商家减免(元)',
    width: 120,
    dataIndex: 'waiver_amount'
  },
  {
    title: '营销优惠(元)',
    width: 120,
    dataIndex: 'preferential_amount'
  },
  {
    title: '实收金额(元)',
    width: 120,
    dataIndex: 'total_pay_amount'
  },
  {
    title: '折扣',
    width: 80,
    dataIndex: 'discount_percentage'
  },
  {
    title: '退款(元)',
    width: 120,
    dataIndex: 'refund_amount'
  },
  {
    title: '净收入(元)',
    width: 120,
    dataIndex: 'net_revenue'
  }
]
export const totalColumns = () => [
  {
    title: '客单价',
    unit: '¥',
    dataIndex: 'per_order_amount'
  },
  {
    title: '订单数',
    scopedSlots: { customRender: 'total_num' },
    dataIndex: 'total_num'
  },
  {
    title: '原价',
    unit: '¥',
    dataIndex: 'total_amount'
  },
  {
    title: '商家减免',
    unit: '¥',
    dataIndex: 'waiver_amount'
  },
  {
    title: '营销优惠',
    unit: '¥',
    dataIndex: 'preferential_amount'
  },
  {
    title: '实收金额',
    unit: '¥',
    dataIndex: 'total_pay_amount'
  },
  {
    title: '折扣',
    dataIndex: 'discount_percentage'
  },
  {
    title: '退款',
    unit: '¥',
    dataIndex: 'refund_amount'
  },
  {
    title: '净收入',
    unit: '¥',
    dataIndex: 'net_revenue'
  }
]
export const dailyTotalColumns = () => [
  {
    title: '实际营收',
    // scopedSlots: { customRender: 'net_revenue' },
    unit: '¥',
    dataIndex: 'net_revenue'
  },
  {
    title: '总营收',
    unit: '¥',
    dataIndex: 'total_amount'
  },
  {
    title: '营收退款',
    unit: '¥',
    dataIndex: 'refund_amount'
  },
  {
    title: '预收款',
    unit: '¥',
    dataIndex: 'wait_total_amount'
  },
  {
    title: '预收款退款',
    unit: '¥',
    dataIndex: 'wait_refund_amount'
  },
  {
    title: '订单数',
    scopedSlots: { customRender: 'total_num' },
    dataIndex: 'total_num'
  },
  {
    title: '线上支付',
    unit: '¥',
    dataIndex: 'online_total_amount'
  },
  {
    title: '线下支付',
    unit: '¥',
    dataIndex: 'offline_total_amount'
  },
  {
    title: '定金支付',
    unit: '¥',
    dataIndex: 'earnest_amount'
  },
  {
    title: '储值本金支付',
    unit: '¥',
    dataIndex: 'deposit_principal_amount'
  },
  {
    title: '储值赠送支付',
    unit: '¥',
    dataIndex: 'deposit_give_amount'
  },
  {
    title: '营销优惠',
    unit: '¥',
    dataIndex: 'preferential_amount'
  },
  {
    title: '商家减免',
    unit: '¥',
    dataIndex: 'waiver_amount'
  }
]

export const countDesc = () => [
  {
    title: '预收类目',
    value: '定金、押金和储值卡'
  },
  {
    title: '实际营收',
    value: '不含预收类目的净收入之和'
  },
  {
    title: '总营收',
    value: '不含预收类目的实收金额之和'
  },
  {
    title: '营收退款',
    value: '不含预收类目的退款之和'
  },
  {
    title: '预收款',
    value: '预收类目的净收入之和'
  },
  // {
  //   title: '预收款退款',
  //   value: '预收款'
  // },
  {
    title: '线上支付',
    value: '小程序微信支付'
  },
  {
    title: '线下支付',
    value: '现金、刷卡、POS机等'
  },
  {
    title: '储值本金支付',
    value: '使用储值卡的实收金额'
  },
  {
    title: '储值赠送支付',
    value: '使用储值卡的赠送金额'
  },
  {
    title: '净收入',
    value: '实收金额-退款'
  }
]
