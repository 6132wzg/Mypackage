export const columns = () => {
  return [
    {
      title: '姓名',
      width: 90,
      dataIndex: 'staff_name',
      sorter: true,
      key: 'name',
      fixed: 'left',
      scopedSlots: { customRender: 'staff_name' }
    },
    { title: '昵称', dataIndex: 'nickname', width: 90, key: 'nickname' },
    { title: '手机号', dataIndex: 'mobile', key: '1' },
    { title: '工号', dataIndex: 'staff_num', key: '2' },
    {
      title: '所在门店',
      dataIndex: 'shop',
      key: '3',
      scopedSlots: { customRender: 'shop' }
    },
    { title: '所属部门', dataIndex: 'department', key: '4' },
    {
      title: '身份',
      dataIndex: 'identity',
      key: '5',
      scopedSlots: { customRender: 'identity' }
    },
    {
      title: '在职状态',
      dataIndex: 'work_status',
      key: '6',
      scopedSlots: { customRender: 'work_status' }
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 140,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
