export const columns = [
  {
    title: '排名',
    width: '20%',
    scopedSlots: { customRender: 'top' },
    dataIndex: 'top'
  },
  {
    title: '销售',
    width: '50%',
    dataIndex: 'nickname'
  },
  {
    title: '业绩(元)',
    width: '30%',
    dataIndex: 'total_amount'
  }
]
