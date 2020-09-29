export const columns = (vm: any) => {
  return [
    {
      title: '活动标题',
      width: 240,
      dataIndex: 'activity_name',
      scopedSlots: { customRender: 'activity_name' }
    },
    {
      title: '活动时间',
      scopedSlots: { customRender: 'time' }
    },
    {
      title: '包含票种',
      dataIndex: 'ticket_type_num',
      scopedSlots: { customRender: 'ticket_type_num' }
    },
    {
      title: '已报名人数',
      dataIndex: 'join_people',
      scopedSlots: { customRender: 'join_people' }
    },
    {
      title: '活动状态',
      dataIndex: 'activity_status',
      width: 80,
      scopedSlots: { customRender: 'activity_status' }
    },
    {
      title: '发布时间',
      width: 150,
      dataIndex: 'publish_time',
      scopedSlots: { customRender: 'publish_time' }
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 140,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
