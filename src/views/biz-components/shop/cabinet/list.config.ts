export const Temporarycolumns = () => {
  return [
    {
      title: '柜号',
      dataIndex: 'serial_num',
      sort: true
    },
    {
      title: '手牌信息',
      dataIndex: 'bracelet_num'
    },
    {
      title: '关联硬件',
      dataIndex: 'is_smart',
      scopedSlots: { customRender: 'is_smart' }
    },
    {
      title: '电量(V)',
      dataIndex: 'battery',
      scopedSlots: { customRender: 'battery' }
    },
    {
      title: '当前状态',
      dataIndex: 'cabinet_business_type',
      scopedSlots: { customRender: 'cabinet_business_type' }
    },
    {
      title: '使用人员',
      dataIndex: 'user_name'
    },
    {
      title: '手机号码',
      dataIndex: 'mobile'
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 140,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
export const LongTermcolumns = () => {
  return [
    {
      title: '柜号',
      dataIndex: 'serial_num',
      sort: true
    },
    {
      title: '手牌信息',
      dataIndex: 'bracelet_num'
    },
    {
      title: '区域',
      dataIndex: 'cabinet_area_id'
    },
    {
      title: '关联硬件',
      dataIndex: 'is_smart',
      scopedSlots: { customRender: 'is_smart' }
    },
    {
      title: '电量(V)',
      dataIndex: 'battery',
      scopedSlots: { customRender: 'battery' }
    },
    {
      title: '租赁价格(元/天)',
      scopedSlots: { customRender: 'price' }
    },
    {
      title: '当前状态',
      dataIndex: 'cabinet_business_type',
      scopedSlots: { customRender: 'cabinet_business_type' }
    },
    {
      title: '使用人员',
      dataIndex: 'user_name'
    },
    {
      title: '手机号码',
      dataIndex: 'mobile'
    },
    {
      title: '到期时间',
      dataIndex: 'end_time'
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 140,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
export const Recordcolumns = () => {
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
      dataIndex: 'mobile',
      width: 140
    },
    {
      title: '操作类型',
      dataIndex: 'action_type',
      scopedSlots: { customRender: 'action_type' }
    },
    {
      title: '操作人员',
      dataIndex: 'operator',
      width: 140
    },
    {
      title: '操作时间',
      dataIndex: 'created_time'
    }
  ]
}
