export const columnsFeatsTop5 = [
  {
    title: '排名',
    // align: 'center',
    width: 80,
    scopedSlots: { customRender: 'top' },
    dataIndex: 'top'
  },
  {
    title: '销售',
    width: 120,
    scopedSlots: { customRender: 'nickname' },
    dataIndex: 'nickname'
  },
  {
    title: '业绩(元)',
    align: 'right',
    width: 75,
    scopedSlots: { customRender: 'total_amount' },
    dataIndex: 'total_amount'
  }
]
export const columnsSaleTop5 = [
  {
    title: '排名',
    // align: 'center',
    width: 80,
    scopedSlots: { customRender: 'top' },
    dataIndex: 'top'
  },
  {
    title: '销售',
    width: 120,
    scopedSlots: { customRender: 'nickname' },
    dataIndex: 'nickname'
  },
  {
    title: '销量(单)',
    align: 'right',
    width: 75,
    scopedSlots: { customRender: 'total_num' },
    dataIndex: 'total_num'
  }
]
