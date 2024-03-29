export const classrecord = (vm: any) => {
  return [
    {
      title: '课程类型',
      dataIndex: 'reserve_type',
      scopedSlots: { customRender: 'reserve_type' }
    },
    {
      title: '课程名称',
      dataIndex: 'course_name'
    },
    {
      title: '上课时间',
      dataIndex: 'start_time'
    },
    {
      title: `上课${vm.$c('coach')}`,
      dataIndex: 'coach_name',
      scopedSlots: { customRender: 'coach_name' }
    },
    {
      title: '预约人数',
      dataIndex: 'reserve_num'
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
      title: '预约时间',
      dataIndex: 'reserve_time'
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
