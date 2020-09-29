export const columns = isRefund => [
  {
    title: '日期',
    scopedSlots: { customRender: 'stat_date' },
    dataIndex: 'stat_date',
    width: '50%'
  },
  isRefund
    ? {
        title: '退款金额(元)',
        dataIndex: 'total_price',
        width: '50%'
      }
    : {
        title: '流水金额(元)',
        dataIndex: 'total_price',
        width: '50%'
      }
]
