export const columns = (vm: any) => {
  return [
    {
      title: '操作日期',
      dataIndex: 'placer_time',
      width: 200
    },
    {
      title: '操作人',
      dataIndex: 'placer_name',
      width: 80
    },
    {
      title: '对内备注',
      dataIndex: 'description'
    }
  ]
}
