export const columns = () => [
  {
    title: '人群名称',
    dataIndex: 'crowd_name',
    scopedSlots: { customRender: 'crowd_name' }
  },
  {
    title: '人群定义',
    width: 350,
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '人群总数',
    dataIndex: 'num'
  },
  {
    title: '更新时间',
    dataIndex: 'updated_time'
  },
  {
    dataIndex: 'refresh_task_status_code',
    slots: { title: 'refreshTitle' },
    width: 100,
    scopedSlots: { customRender: 'refresh_task_status_code' }
  },
  {
    title: '操作',
    width: 170,
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
