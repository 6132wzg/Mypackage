export const columns = () => [
  {
    title: '日期',
    scopedSlots: { customRender: 'stat_date' },
    dataIndex: 'stat_date',
    width: '30%'
  },
  {
    title: '实际营收(元)',
    dataIndex: 'net_revenue',
    width: '25%'
  },
  {
    title: '总营收(元)',
    dataIndex: 'total_amount',
    width: '25%'
  },
  {
    title: '退款(元)',
    dataIndex: 'refund_amount',
    width: '20%'
  }
]
