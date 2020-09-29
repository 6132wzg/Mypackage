export const mainColumns = (vm: any) => {
  return [
    {
      title: '课程类型',
      dataIndex: 'sub_reserve_type',
      scopedSlots: { customRender: 'sub_reserve_type' }
    },
    {
      title: '上课时间',
      dataIndex: 'course_time'
    },
    {
      title: '课程名称',
      dataIndex: 'reserve_course_name'
    },
    {
      title: '教练昵称',
      dataIndex: 'reserve_coach_name'
    },
    {
      title: '预约人数',
      dataIndex: 'reserved_num'
    },
    {
      title: '签到人数',
      dataIndex: 'checkin_num'
    },
    {
      title: '备注',
      width: 200,
      scopedSlots: { customRender: 'remark' }
    }
  ]
}
export const childColumns = (vm: any) => {
  return [
    {
      title: '姓名',
      width: 90,
      dataIndex: 'member',
      scopedSlots: { customRender: 'member' }
    },
    {
      title: '电话',
      dataIndex: 'mobile'
    },
    {
      title: '预约人数',
      dataIndex: 'reserved_num'
    },
    {
      title: '预约凭证',
      dataIndex: 'reserve_consume'
    },
    {
      title: '使用额度',
      dataIndex: 'consume_unit_num'
    },
    {
      title: '预约状态',
      dataIndex: 'reserve_status',
      scopedSlots: { customRender: 'reserve_status' }
    },
    {
      title: '签到状态',
      dataIndex: 'is_checkin',
      scopedSlots: { customRender: 'is_checkin' }
    },
    {
      title: '签到方式',
      dataIndex: 'checkin_method',
      scopedSlots: { customRender: 'checkin_method' }
    },
    {
      title: '预约时间',
      dataIndex: 'reserve_time'
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 140,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
