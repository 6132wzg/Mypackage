export const columns = () => [
  {
    title: '日期',
    scopedSlots: { customRender: 'stat_date' },
    dataIndex: 'stat_date',
    width: '30%'
  },
  {
    title: '成单数',
    dataIndex: 'order_num',
    width: '25%'
  },
  {
    title: '客单价(元)',
    dataIndex: 'order_per_price',
    width: '25%'
  },
  {
    title: '实收金额(元)',
    dataIndex: 'paid_price',
    width: '20%'
  }
]
