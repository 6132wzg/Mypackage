export const columns = () => {
  return [
    {
      title: '发券时间',
      width: 175,
      dataIndex: 'send_time'
    },
    {
      title: '用户群',
      dataIndex: 'user_group'
    },
    {
      title: '优惠券',
      dataIndex: 'coupon_name'
    },
    {
      title: '发送状态',
      dataIndex: 'send_status'
    },
    {
      title: '发放人数',
      dataIndex: 'send_num'
    },
    {
      title: '已使用人数',
      dataIndex: 'used_num'
    },
    {
      title: '操作人',
      dataIndex: 'operator'
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 140,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
