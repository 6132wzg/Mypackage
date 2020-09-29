export const Wheelcolumns = (vm: any) => {
  return [
    {
      title: '活动名称',
      dataIndex: 'activity_name',
      width: 100
    },
    {
      title: '活动时间',
      dataIndex: 'activity_time',
      scopedSlots: { customRender: 'activity_time' }
    },
    {
      title: '参与用户',
      dataIndex: 'crowd_name'
    },
    {
      title: '活动状态',
      dataIndex: 'activity_status_name'
    }
  ]
}
