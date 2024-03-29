export const columns = () => {
  return [
    {
      title: '活动名称',
      width: 175,
      dataIndex: 'activity_name'
    },
    {
      title: '活动时间',
      // dataIndex: 'activity_start_time'
      scopedSlots: { customRender: 'time' }
    },
    {
      title: '参与用户',
      dataIndex: 'crowd_name'
    },
    {
      title: '参与人数',
      scopedSlots: { customRender: 'join_num' }
    },
    {
      title: '中奖人数',
      scopedSlots: { customRender: 'prize_num' }
    },
    {
      title: '活动状态',
      dataIndex: 'activity_status_name',
      scopedSlots: { customRender: 'activity_status_name' }
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 140,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
