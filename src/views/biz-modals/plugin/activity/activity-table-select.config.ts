export const SignUpcolumns = (vm: any) => {
  return [
    {
      title: '活动名称',
      dataIndex: 'activity_name',
      width: 80
    },
    {
      title: '包含票种',
      dataIndex: 'ticket_type_num'
    },
    {
      title: '活动时间',
      dataIndex: 'signup_activity_time',
      scopedSlots: { customRender: 'signup_activity_time' },
      width: 160
    },
    {
      title: '活动状态',
      dataIndex: 'activity_status.name'
    },
    {
      title: '发布时间',
      dataIndex: 'publish_time',
      width: 160
    }
  ]
}
