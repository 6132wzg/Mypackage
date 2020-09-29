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
    title: '销量(单)',
    width: '30%',
    dataIndex: 'total_num'
  }
]
