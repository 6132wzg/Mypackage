export const Packagecolumns = (vm: any) => {
  return [
    {
      title: '课程包名称',
      dataIndex: 'course_name',
      width: 100
    },
    {
      title: '分类',
      dataIndex: 'package_type',
      scopedSlots: { customRender: 'package_type' }
    },
    {
      title: '团课节数/私教节数',
      dataIndex: 'quota_times',
      width: 140
    },
    {
      title: '有效期',
      dataIndex: 'valid_time'
    },
    {
      title: '售价',
      dataIndex: 'price'
    },
    {
      title: '售卖时间',
      dataIndex: 'sale_time',
      width: 140
    }
  ]
}
