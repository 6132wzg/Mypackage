export const columns = (vm: any) => {
  return [
    {
      title: '会员姓名',
      dataIndex: 'member',
      width: '120px',
      scopedSlots: { customRender: 'member' }
    },
    {
      title: '消费方式',
      dataIndex: 'consume_type',
      scopedSlots: { customRender: 'consume_type' }
    },
    {
      title: '扣除额度',
      dataIndex: 'deduct_num',
      scopedSlots: { customRender: 'deduct_num' }
    },
    {
      title: '签到状态',
      dataIndex: 'is_checkin'
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]
}
