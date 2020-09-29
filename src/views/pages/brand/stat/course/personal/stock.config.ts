export const columns = vm => [
  {
    title: '课程名',
    width: 140,
    dataIndex: 'course_name'
  },
  {
    title: `剩余课时`,
    width: 100,
    dataIndex: 'leavings'
  },
  {
    title: `购买课时`,
    width: 100,
    dataIndex: 'sell_number'
  },
  {
    title: `有效预约`,
    width: 100,
    dataIndex: 'effective_reserve'
  },
  {
    title: '消课课时',
    width: 100,
    dataIndex: 'cost'
  },
  {
    title: `消课价值(元)`,
    width: 120,
    dataIndex: 'consume_amount'
  },
  {
    title: '剩余摊销(元)',
    width: 120,
    dataIndex: 'leavings_amount'
  },
  {
    title: '赠送课时',
    width: 100,
    dataIndex: 'gift_number'
  },
  {
    title: '类型',
    dataIndex: 'type_text'
  }
]

export const childColumns = vm => [
  {
    title: '会员姓名',
    width: 140,
    dataIndex: 'member_name'
  },
  {
    title: `剩余课时`,
    width: 100,
    dataIndex: 'leavings'
  },
  {
    title: `购买课时`,
    width: 100,
    dataIndex: 'sell_number'
  },
  {
    title: `有效预约`,
    width: 100,
    dataIndex: 'effective_reserve'
  },
  {
    title: '消课课时',
    width: 100,
    dataIndex: 'cost'
  },
  {
    title: `消课价值(元)`,
    width: 120,
    dataIndex: 'consume_amount'
  },
  {
    title: '剩余摊销(元)',
    width: 120,
    dataIndex: 'leavings_amount'
  },
  {
    title: '赠送课时',
    width: 100,
    dataIndex: 'gift_number'
  },
  {
    title: '合同状态',
    width: 100,
    dataIndex: 'course_status'
  },
  {
    title: '实收单价',
    width: 100,
    dataIndex: 'price'
  },
  {
    title: '会员手机',
    width: 100,
    dataIndex: 'mobile'
  },
  {
    title: '有效期(天)',
    width: 100,
    dataIndex: 'effective_days'
  },
  {
    title: '购买时间',
    scopedSlots: { customRender: 'buy_date' },
    width: 140,
    dataIndex: 'buy_date'
  },
  {
    title: '到期时间',
    scopedSlots: { customRender: 'valid_date' },
    width: 140,
    dataIndex: 'valid_date'
  },
  {
    title: `上课${vm.$c('coach')}`,
    scopedSlots: { customRender: 'coach_map' },
    width: 100,
    dataIndex: 'coach_map'
  },
  {
    title: '门店名称',
    width: 100,
    dataIndex: 'shop_name'
  },
  {
    title: '合同号',
    dataIndex: 'contract_id'
  }
]

export const totalColumns = vm => [
  {
    title: '存课课程',
    dataIndex: 'total_course_number'
  },
  {
    title: `存课${vm.$c('coach')}`,
    dataIndex: 'total_coach_number'
  },
  {
    title: `剩余课时`,
    dataIndex: 'total_leavings'
  },
  {
    title: `有效预约`,
    dataIndex: 'total_effective'
  },
  {
    title: '消课课时',
    dataIndex: 'total_cost'
  },
  {
    title: '消课价值',
    dataIndex: 'total_consume_amount'
  },
  {
    title: '剩余摊销',
    dataIndex: 'total_leavings_amount'
  },
  {
    title: `购买课时`,
    dataIndex: 'total_buy_number'
  },
  {
    title: `赠送课时`,
    dataIndex: 'total_gift_number'
  }
]

export const countDesc = () => [
  {
    title: '存课课程数',
    value: '剩余课时>0'
  },
  {
    title: '购买课时',
    value: '含购买赠送'
  },
  {
    title: '赠送课时',
    value: '非购买赠送'
  }
]
