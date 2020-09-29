export const teamFixColumns = () => [
  {
    title: '课程名称',
    dataIndex: 'course_name',
    width: '20%'
  },
  {
    title: '上课门店',
    dataIndex: 'shop_name',
    scopedSlots: {
      customRender: 'shop_name'
    },
    width: '20%'
  },
  {
    title: '节数',
    dataIndex: 'team_times',
    width: '20%'
  },
  {
    title: '单价',
    dataIndex: 'team_unit_price',
    width: '20%'
  }
]
export const teamRangeColumns = () => [
  {
    title: '课程名称',
    dataIndex: 'course_name',
    width: '20%'
  },
  {
    title: '上课门店',
    dataIndex: 'shop_name',
    scopedSlots: {
      customRender: 'shop_name'
    },
    width: '20%'
  }
]
export const personalFixColumns = () => [
  {
    title: '课程名称',
    dataIndex: 'course_name',
    width: '20%'
  },
  {
    title: '上课门店',
    dataIndex: 'shop_name',
    scopedSlots: {
      customRender: 'shop_name'
    },
    width: '20%'
  },
  {
    title: '等级',
    dataIndex: 'coach_level',
    scopedSlots: {
      customRender: 'coach_level'
    },
    width: '20%'
  },
  {
    title: '节数',
    dataIndex: 'personal_times',
    width: '20%'
  },
  {
    title: '单价',
    dataIndex: 'personal_unit_price',
    width: '20%'
  }
]
export const personalRangeColumns = () => [
  {
    title: '课程名称',
    dataIndex: 'course_name',
    width: '20%'
  },
  {
    title: '上课门店',
    dataIndex: 'shop_name',
    scopedSlots: {
      customRender: 'shop_name'
    },
    width: '20%'
  },
  {
    title: '等级',
    dataIndex: 'coachLevel',
    width: '20%'
  }
]
export const courseUnLimitColumns = () => [
  {
    title: '课程类型',
    dataIndex: 'course_type',
    width: '25%'
  },
  {
    title: '节数（节）',
    dataIndex: 'count',
    width: '25%'
  },
  {
    title: '课时费(元)',
    dataIndex: 'price',
    width: '25%'
  },
  {
    title: '合计(元)',
    dataIndex: 'total',
    width: '25%'
  }
]
export const shopColumns = () => [
  {
    title: '省',
    dataIndex: 'province_name'
  },
  {
    title: '市',
    dataIndex: 'city_name'
  },
  {
    title: '区',
    dataIndex: 'district_name'
  },
  {
    title: '门店',
    dataIndex: 'shop_name'
  }
]
