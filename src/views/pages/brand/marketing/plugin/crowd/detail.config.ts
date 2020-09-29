export const columns = (vm: any) => {
  return [
    {
      title: '姓名',
      dataIndex: 'member_name'
    },
    {
      title: '手机号',
      dataIndex: 'mobile'
    },
    {
      title: '性别',
      dataIndex: 'sex',
      scopedSlots: { customRender: 'sex' }
    },
    {
      title: '用户来源',
      dataIndex: 'register_way'
    },
    {
      title: '注册时间',
      dataIndex: 'register_time'
    },
    {
      title: '所属门店',
      dataIndex: 'shop_names',
      scopedSlots: { customRender: 'shop_names' }
    },
    {
      title: '累计消费',
      dataIndex: 'sum_consumption'
    }
  ]
}
