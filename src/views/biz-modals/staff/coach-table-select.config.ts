export const Coachcolumns = (vm: any) => {
  return [
    {
      title: '昵称',
      dataIndex: 'staff_name',
      width: 80
    },
    {
      title: '手机号',
      dataIndex: 'mobile'
    },
    {
      title: '所属门店',
      dataIndex: 'shop',
      scopedSlots: { customRender: 'shop' },
      width: 60
    },
    {
      title: '所属部门',
      dataIndex: 'department',
      width: 100
    },
    {
      title: '教练等级',
      dataIndex: 'coach_level',
      width: 60
    },
    {
      title: '职能',
      dataIndex: 'identity',
      scopedSlots: { customRender: 'identity' },
      width: 100
    }
  ]
}
