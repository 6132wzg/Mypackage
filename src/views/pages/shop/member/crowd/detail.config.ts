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
      title: '用户等级',
      dataIndex: 'member_level'
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
      title: '入会时间',
      dataIndex: 'be_member_time'
    },
    {
      title: '跟进销售',
      dataIndex: 'follow_salesman'
    },
    {
      title: '跟进教练',
      dataIndex: 'follow_coach'
    },
    {
      title: '累计消费',
      dataIndex: 'sum_consumption'
    }
  ]
}
