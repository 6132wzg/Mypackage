export const totalColumns = () => [
  {
    title: '发放积分',
    width: 200,
    dataIndex: 'used_points'
  },
  {
    title: '消耗积分',
    width: 200,
    dataIndex: 'consume_points'
  }
]
export const columns = () => [
  {
    title: '会员姓名',
    width: 140,
    dataIndex: 'member_name'
  },
  {
    title: '手机号',
    width: 140,
    dataIndex: 'mobile'
  },
  {
    title: '总积分',
    dataIndex: 'total_points',
    sorter: true
  },
  {
    title: '已用积分',
    dataIndex: 'used_points',
    sorter: true
  },
  {
    title: '过期积分',
    dataIndex: 'expired_points',
    sorter: true
  },
  {
    title: '剩余积分',
    dataIndex: 'remain_points',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 180,
    scopedSlots: { customRender: 'action' }
  }
]
