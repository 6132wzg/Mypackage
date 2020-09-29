export const columns = (vm: any) => {
  return [
    {
      title: `${vm.$c('small_course')}名称`,
      dataIndex: 'course_name',
      fixed: 'left',
      width: 175
    },
    {
      title: '类型',
      width: 100,
      dataIndex: 'small_course_type',
      scopedSlots: { customRender: 'small_course_type' }
    },
    {
      title: '排课情况',
      width: 120,
      scopedSlots: { customRender: 'course_arrangement' }
    },
    {
      title: '报名时间',
      width: 170,
      dataIndex: 'apply_time'
    },
    {
      title: '开班时间',
      width: 120,
      dataIndex: 'course_time'
    },
    {
      // title: '状态',
      slots: { title: 'course_status' },
      scopedSlots: { customRender: 'course_status' }
    },
    {
      title: '售价(元)',
      dataIndex: 'sales_price',
      scopedSlots: { customRender: 'sales_price' }
    },
    {
      title: '报名人数',
      width: 100,
      dataIndex: 'apply_num'
    },
    {
      // title: '成班条件',
      width: 120,
      slots: { title: 'class_conditions' },
      dataIndex: 'class_conditions'
    },
    {
      title: '负责人',
      width: 90,
      dataIndex: 'charge_person'
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
