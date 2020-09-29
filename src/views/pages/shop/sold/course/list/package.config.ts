export const columns = () => [
  {
    title: '课程包名',
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
    title: '课程包类型',
    dataIndex: 'is_limit',
    scopedSlots: { customRender: 'is_limit' }
  },
  {
    title: '属性',
    dataIndex: 'package_type',
    scopedSlots: { customRender: 'package_type' }
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
    title: '剩余次数',
    dataIndex: 'product_quota_remain_desc_list',
    scopedSlots: { customRender: 'product_quota_remain_desc_list' }
  },
  {
    title: '购买次数',
    dataIndex: 'product_quota_desc_list',
    scopedSlots: { customRender: 'product_quota_desc_list' }
  },

  {
    title: '剩余摊销(元)',
    dataIndex: 'amortization_amount'
  },
  {
    title: '是否生效',
    dataIndex: 'effective_state',
    scopedSlots: { customRender: 'effective_state' }
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
    title: '总余额(节)',
    dataIndex: 'remain_course_num'
  },
  {
    title: '团课余额(节)',
    dataIndex: 'team_course_remain'
  },
  {
    title: '私教余额(节)',
    dataIndex: 'personal_course_remain'
  },
  {
    title: '总购课(节)',
    dataIndex: 'buy_course_num'
  },
  {
    title: '购团课(节)',
    dataIndex: 'team_course_init'
  },
  {
    title: '购私教(节)',
    dataIndex: 'personal_course_init'
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
