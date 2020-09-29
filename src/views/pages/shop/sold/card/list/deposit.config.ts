export const columns = () => [
  {
    title: '卡名',
    dataIndex: 'card_name',
    fixed: 'left',
    width: 100,
    scopedSlots: { customRender: 'card_name' }
  },
  {
    title: '状态',
    fixed: 'left',
    width: 80,
    dataIndex: 'is_valid',
    scopedSlots: { customRender: 'is_valid' }
  },
  {
    title: '类型',
    dataIndex: 'transfer_type'
  },
  {
    title: '姓名',
    dataIndex: 'member_name',
    width: 90,
    scopedSlots: { customRender: 'member_name' }
  },
  {
    title: '性别',
    dataIndex: 'sex',
    scopedSlots: { customRender: 'sex' }
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    scopedSlots: { customRender: 'mobile' }
  },
  {
    title: '余额(元)',
    dataIndex: 'now_amount',
    scopedSlots: { customRender: 'now_amount' }
  },
  {
    title: '剩余本金(元)',
    dataIndex: 'now_non_discount_amount'
  },
  {
    title: '剩余赠送(元)',
    dataIndex: 'now_discount_amount'
  },
  {
    title: '有效期',
    dataIndex: 'sell_time',
    width: 160,
    scopedSlots: { customRender: 'sell_time' }
  },
  {
    title: '原价(元)',
    dataIndex: 'total_price'
  },
  {
    title: '实收(元)',
    dataIndex: 'pay_price'
  },
  {
    title: '销售',
    dataIndex: 'staff_name',
    width: 90,
    scopedSlots: { customRender: 'staff_name' }
  },
  {
    title: '是否退款',
    dataIndex: 'is_refund'
  },
  {
    title: '退款(元)',
    dataIndex: 'refund_price'
  },
  {
    title: '储值面额(元)',
    dataIndex: 'init_amount',
    scopedSlots: { customRender: 'init_amount' }
  },
  {
    title: '消费面额(元)',
    dataIndex: 'consume_amount'
  },
  {
    title: '消费本金(元)',
    dataIndex: 'consume_principal'
  },
  {
    title: '消费赠送(元)',
    dataIndex: 'consume_discount'
  },
  {
    title: '优惠(元)',
    dataIndex: 'discount_price'
  },
  {
    title: '减免(元)',
    dataIndex: 'reduce_price'
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 140,
    scopedSlots: { customRender: 'action' }
  }
]

export const totalColumns = () => [
  {
    title: '余额(元)',
    dataIndex: 'now_amount'
  },
  {
    title: '剩余本金(元)',
    dataIndex: 'now_non_discount_amount'
  },
  {
    title: '剩余赠送(元)',
    dataIndex: 'now_discount_amount'
  },
  {
    title: '储值面额(元)',
    dataIndex: 'init_amount'
  },
  {
    title: '实收(元)',
    dataIndex: 'pay_price'
  },
  {
    title: '优惠(元)',
    dataIndex: 'discount_price'
  },
  {
    title: '减免(元)',
    dataIndex: 'reduce_price'
  },
  {
    title: '退款(元)',
    dataIndex: 'refund_price'
  },
  {
    title: '消费面额(元)',
    dataIndex: 'consume_amount'
  },
  {
    title: '消费本金(元)',
    dataIndex: 'consume_principal'
  },
  {
    title: '消费赠送(元)',
    dataIndex: 'consume_discount'
  }
]
