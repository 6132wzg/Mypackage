export const columns = vm => [
  {
    title: '会员姓名',
    width: 100,
    dataIndex: 'member_name'
  },
  {
    title: '性别',
    width: 80,
    dataIndex: 'sex'
  },
  {
    title: `手机号`,
    width: 140,
    dataIndex: 'mobile'
  },
  {
    title: `用户等级`,
    width: 80,
    dataIndex: 'member_level'
  },
  {
    title: `跟进${vm.$c('coach')}`,
    width: 100,
    dataIndex: 'follow_staff_name'
  },
  {
    title: '上课节数',
    width: 80,
    dataIndex: 'total_num'
  },
  {
    title: '上课周期(天/节)',
    width: 140,
    dataIndex: 'total_frequency'
  },
  {
    title: `上课时长(h)`,
    width: 120,
    dataIndex: 'total_time'
  },
  {
    title: '有效预约',
    scopedSlots: { customRender: 'effective_reserve_num' },
    width: 100,
    dataIndex: 'effective_reserve_num'
  },
  {
    title: '未签预约',
    width: 100,
    dataIndex: 'not_signin_num'
  },
  {
    title: '已签预约',
    width: 100,
    dataIndex: 'use_signin_num'
  },
  {
    title: `消课价值(元)`,
    width: 120,
    dataIndex: 'total_amount'
  },
  {
    title: `课均价值(元/节)`,
    width: 140,
    dataIndex: 'average_amount'
  }
]

export const totalColumns = () => [
  {
    title: '上课会员',
    dataIndex: 'total_member'
  },
  {
    title: '上课节数',
    dataIndex: 'total_num'
  },
  {
    title: `上课周期(天/节)`,
    dataIndex: 'total_frequency'
  },
  {
    title: `上课时长(h)`,
    dataIndex: 'total_time'
  },
  {
    title: '有效预约',
    scopedSlots: { customRender: 'effective_reserve_num' },
    dataIndex: 'effective_reserve_num'
  },
  {
    title: '未签预约',
    dataIndex: 'not_signin_num'
  },
  {
    title: '已签预约',
    dataIndex: 'use_signin_num'
  },
  {
    title: `消课价值`,
    unit: '¥',
    dataIndex: 'total_amount'
  },
  {
    title: `课均价值(元/节)`,
    unit: '¥',
    dataIndex: 'average_amount'
  }
]
