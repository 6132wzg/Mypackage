export const columns = vm => [
  {
    title: ' 退款方式',
    scopedSlots: { customRender: 'pay_channel' },
    width: 120,
    dataIndex: 'pay_channel'
  },
  {
    title: '退款总额(元)',
    scopedSlots: { customRender: 'total_price' },
    // width: 120,
    dataIndex: 'total_price'
  },
  {
    title: `${vm.$c('member_card')}(元)`,
    // width: 120,
    dataIndex: 'member_card'
  },
  {
    title: '储值卡(元)',
    // width: 100,
    dataIndex: 'deposit'
  },
  {
    title: '私教课(元)',
    // width: 100,
    dataIndex: 'personal'
  },
  {
    title: '课程包(元)',
    // width: 120,
    dataIndex: 'package'
  },
  {
    title: `${vm.$c('small_course')}(元)`,
    // width: 120,
    dataIndex: 'small_course'
  },
  {
    title: '团体课(元)',
    // width: 120,
    dataIndex: 'team'
  },
  {
    title: '租赁柜(元)',
    // width: 140,
    dataIndex: 'cabinet'
  },
  {
    title: '云店(元)',
    // width: 140,
    dataIndex: 'store'
  },
  {
    title: '场地预约(元)',
    // width: 120,
    dataIndex: 'venues'
  },
  {
    title: '定金(元)',
    // width: 120,
    dataIndex: 'advance_fee'
  },
  {
    title: '押金(元)',
    // width: 120,
    dataIndex: 'cash_pledge'
  },
  {
    title: '其他(元)',
    // width: 120,
    dataIndex: 'other'
  }
]
export const totalColumns = (vm, type) => [
  {
    title: '退款总额',
    scopedSlots: type === 'daily' ? false : { customRender: 'total_price' },
    unit: '¥',
    dataIndex: 'total_price'
  },
  {
    title: `${vm.$c('member_card')}`,
    unit: '¥',
    dataIndex: 'member_card'
  },
  {
    title: '储值卡',
    unit: '¥',
    dataIndex: 'deposit'
  },
  {
    title: '私教课',
    unit: '¥',
    dataIndex: 'personal'
  },
  {
    title: '课程包',
    unit: '¥',
    dataIndex: 'package'
  },
  {
    title: vm.$c('small_course'),
    dataIndex: 'small_course'
  },
  {
    title: '团体课',
    unit: '¥',
    dataIndex: 'team'
  },
  {
    title: '租赁柜',
    unit: '¥',
    dataIndex: 'cabinet'
  },
  {
    title: '云店',
    unit: '¥',
    dataIndex: 'store'
  },
  {
    title: '场地预约',
    unit: '¥',
    dataIndex: 'venues'
  },
  {
    title: '定金',
    unit: '¥',
    dataIndex: 'advance_fee'
  },
  {
    title: '押金',
    unit: '¥',
    dataIndex: 'cash_pledge'
  },
  {
    title: '其他',
    unit: '¥',
    dataIndex: 'other'
  }
]
