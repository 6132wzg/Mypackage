export const memberColumns = vm => [
  {
    title: '门店名称',
    width: 100,
    dataIndex: 'shop_name'
  },
  {
    title: '课程时间',
    width: 120,
    dataIndex: 'course_time'
  },
  {
    title: '课程名称',
    width: 140,
    dataIndex: 'course_name'
  },
  {
    title: `上课${vm.$c('coach')}`,
    width: 100,
    dataIndex: 'coach_name'
  },
  {
    title: '课程模式',
    width: 100,
    dataIndex: 'course_model'
  },
  {
    title: '预约状态',
    width: 100,
    dataIndex: 'reserve_status'
  },
  {
    title: '预约凭证',
    width: 100,
    dataIndex: 'reserve_voucher'
  },
  {
    title: '使用额度',
    width: 100,
    dataIndex: 'access_limit'
  },
  {
    title: '消课价值(元)',
    width: 140,
    dataIndex: 'course_amount'
  },
  {
    title: '会员姓名',
    width: 100,
    dataIndex: 'member_name'
  },
  {
    title: '手机号',
    width: 125,
    dataIndex: 'mobile'
  },
  {
    title: '签课人',
    scopedSlots: { customRender: 'sign_personal' },
    width: 100,
    dataIndex: 'sign_personal'
  },
  {
    title: '签课来源',
    width: 100,
    dataIndex: 'sign_type'
  }
]
