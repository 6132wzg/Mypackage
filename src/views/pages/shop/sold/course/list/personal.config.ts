export const columns = (vm: any) => [
  {
    title: '课程名',
    dataIndex: 'course_name',
    fixed: 'left',
    width: 100,
    scopedSlots: { customRender: 'course_name' }
  },
  {
    title: '状态',
    fixed: 'left',
    width: 76,
    dataIndex: 'course_status',
    scopedSlots: { customRender: 'course_status' }
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
    title: '余额(节)',
    dataIndex: 'remain_course_num',
    scopedSlots: { customRender: 'remain_course_num' }
  },
  {
    title: '购课(节)',
    dataIndex: 'init_course_num',
    scopedSlots: { customRender: 'init_course_num' }
  },
  {
    title: '剩余摊销(元)',
    dataIndex: 'amortization_amount'
  },
  {
    title: '有效期',
    dataIndex: 'sell_time',
    width: 160,
    scopedSlots: { customRender: 'sell_time' }
  },
  {
    title: '实收单价(元)',
    dataIndex: 'unit_price'
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
    title: `上课${vm.$c('coach')}`,
    dataIndex: 'coach_name',
    width: 90,
    scopedSlots: { customRender: 'coach_name' }
  },
  {
    title: `级别`,
    dataIndex: 'coach_level',
    scopedSlots: { customRender: 'coach_level' }
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
    title: '余额(节)',
    dataIndex: 'remain_course_num'
  },
  {
    title: '购课(节)',
    dataIndex: 'init_course_num'
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
    title: '约课(次)',
    dataIndex: 'reserve_times'
  },
  {
    title: '取消预约(次)',
    dataIndex: 'cancel_times'
  }
]
