export const columns = vm => [
  {
    title: `${vm.$c('coach')}姓名`,
    width: 100,
    dataIndex: 'staff_name'
  },
  {
    title: `所属部门`,
    width: 100,
    dataIndex: 'department_name'
  },
  {
    title: '上课节数',
    scopedSlots: { customRender: 'total_num' },
    width: 100,
    dataIndex: 'total_num'
  },
  {
    title: `上课时长(h)`,
    width: 120,
    dataIndex: 'total_time'
  },
  {
    title: '上课人数',
    width: 100,
    dataIndex: 'total_class_attendance'
  },
  {
    title: '有效预约',
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
    title: `课均人数(人/节)`,
    width: 140,
    dataIndex: 'avg_class_attendance'
  },
  {
    title: `课均价值(元/节)`,
    width: 140,
    dataIndex: 'avg_amount'
  },
  {
    title: `时效价值(元/h)`,
    width: 140,
    dataIndex: 'aging_amount'
  }
]

export const totalColumns = vm => [
  {
    title: `上课${vm.$c('coach')}数`,
    dataIndex: 'class_coach_num'
  },
  {
    title: '上课节数',
    scopedSlots: { customRender: 'total_num' },
    dataIndex: 'total_num'
  },
  {
    title: `人均上课(节)`,
    dataIndex: 'avg_num'
  },
  {
    title: `上课时长(h)`,
    dataIndex: 'total_time'
  },
  {
    title: `上课人数`,
    dataIndex: 'total_class_attendance'
  },
  {
    title: '有效预约',
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
    title: `课均人数(人/节)`,
    dataIndex: 'avg_class_attendance'
  },
  {
    title: `课均价值(元/节)`,
    unit: '¥',
    dataIndex: 'avg_amount'
  },
  {
    title: `时效价值(元/h)`,
    unit: '¥',
    dataIndex: 'aging_amount'
  },
  {
    title: `空闲${vm.$c('coach')}`,
    scopedSlots: { customRender: 'free_coach_num' },
    dataIndex: 'free_coach_num'
  }
]
