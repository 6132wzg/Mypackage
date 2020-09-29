export const totalColumns = () => [
  {
    title: '发放积分',
    dataIndex: 'used_points'
  },
  {
    title: '消耗积分',
    dataIndex: 'consume_points'
  }
]
export const columns = () => [
  {
    title: '会员姓名',
    width: 200,
    dataIndex: 'member_name'
  },
  {
    title: '手机号',
    width: 200,
    dataIndex: 'mobile'
  },
  {
    title: '积分',
    width: 200,
    dataIndex: 'points'
  },
  {
    title: '类型',
    scopedSlots: { customRender: 'source_type' },
    width: 200,
    dataIndex: 'source_type'
  },
  {
    title: '门店',
    width: 200,
    dataIndex: 'shop_name'
  },
  {
    title: '时间',
    width: 200,
    dataIndex: 'action_time'
  },
  {
    title: '剩余积分',
    width: 200,
    dataIndex: 'remain_points'
  },
  {
    title: '操作人',
    width: 200,
    dataIndex: 'operator_name'
  },
  {
    title: '备注',
    width: 200,
    dataIndex: 'remark'
  }
]
