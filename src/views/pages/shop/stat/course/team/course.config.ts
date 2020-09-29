export const columns = [
  {
    title: '课程名称',
    width: 140,
    dataIndex: 'course_name'
  },
  {
    title: `课程类型`,
    width: 100,
    dataIndex: 'category_name'
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

export const totalColumns = [
  {
    title: '课程数(节)',
    dataIndex: 'class_coach_num'
  },
  {
    title: '上课节数',
    scopedSlots: { customRender: 'total_num' },
    dataIndex: 'total_num'
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
  }
]
