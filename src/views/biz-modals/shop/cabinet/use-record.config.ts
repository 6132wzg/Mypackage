export const columns = () => {
  return [
    {
      title: '柜号',
      dataIndex: 'serial_num'
    },
    {
      title: '储物柜类型',
      dataIndex: 'cabinet_type',
      scopedSlots: { customRender: 'cabinet_type' }
    },
    {
      title: '所属区域',
      dataIndex: 'cabinet_area_name'
    },
    {
      title: '使用会员',
      dataIndex: 'user_name'
    },
    {
      title: '手机号码',
      dataIndex: 'mobile'
    },
    {
      title: '操作类型',
      dataIndex: 'action_type',
      scopedSlots: { customRender: 'action_type' }
    },
    {
      title: '操作人员',
      dataIndex: 'operator'
    },
    {
      title: '操作时间',
      dataIndex: 'created_time'
    }
  ]
}
