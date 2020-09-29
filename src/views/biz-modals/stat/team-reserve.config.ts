export const columns = vm => [
  {
    title: '上课时间',
    width: 220,
    scopedSlots: { customRender: 'course_time' },
    dataIndex: 'course_time'
  },
  {
    title: '门店名称',
    width: 100,
    dataIndex: 'shop_name'
  },
  {
    title: '课程名称',
    width: 200,
    dataIndex: 'course_name'
  },
  {
    title: `上课${vm.$c('coach')}`,
    width: 120,
    dataIndex: 'staff_name'
  },
  {
    title: '预约人数',
    width: 100,
    dataIndex: 'reserved_num'
  },
  {
    title: '签课人数',
    width: 100,
    dataIndex: 'checkin_num'
  },
  {
    title: '备注',
    width: 120,
    scopedSlots: { customRender: 'remarks' },
    dataIndex: 'remarks'
  }
]

export const childColumns = () => [
  {
    title: '会员',
    width: 100,
    dataIndex: 'member_name'
  },
  {
    title: '电话',
    width: 120,
    dataIndex: 'member_mobile'
  },
  {
    title: '预约凭证',
    width: 100,
    dataIndex: 'consume_name'
  },
  {
    title: '预约人数',
    width: 100,
    dataIndex: 'reserved_num'
  },
  {
    title: '使用额度',
    width: 100,
    dataIndex: 'consume_unit_num'
  },
  {
    title: '消课价值(元)',
    width: 120,
    dataIndex: 'consume_amount'
  },
  {
    title: '状态',
    width: 100,
    dataIndex: 'reserve_status'
  },
  {
    title: '签课人',
    width: 100,
    dataIndex: 'checkin_name'
  },
  {
    title: '签课来源',
    width: 120,
    dataIndex: 'checkin_source'
  }
]
