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
    width: 76,
    dataIndex: 'card_status',
    scopedSlots: { customRender: 'card_status' }
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
    title: '余额',
    dataIndex: 'remain_amount',
    scopedSlots: { customRender: 'remain_amount' }
  },
  {
    title: '剩余摊销(元)',
    dataIndex: 'amortization_amount'
  },
  {
    title: '是否开卡',
    dataIndex: 'is_open',
    scopedSlots: { customRender: 'is_open' }
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
    dataIndex: 'is_refund',
    scopedSlots: { customRender: 'is_refund' }
  },
  {
    title: '退款(元)',
    dataIndex: 'refund_price'
  },
  {
    title: '入场(次)',
    dataIndex: 'entrances_times'
  },
  {
    title: '约课(次)',
    dataIndex: 'reserve_times'
  },
  {
    title: '取消预约(次)',
    dataIndex: 'cancel_times'
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
    title: '余额(次)',
    dataIndex: 'remain_amount'
  },
  {
    title: '剩余摊销(元)',
    dataIndex: 'amortization_amount'
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
    title: '入场(次)',
    dataIndex: 'entrances_times'
  },
  {
    title: '约课(次)',
    dataIndex: 'reserve_times'
  },
  {
    title: '取消预约(次)',
    dataIndex: 'cancel_times'
  }
]
