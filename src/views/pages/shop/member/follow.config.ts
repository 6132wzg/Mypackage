export const columns = (vm: any) => [
  {
    title: '日期',
    dataIndex: 'created_time',
    width: 120
  },
  {
    title: '录入人',
    dataIndex: 'operator',
    scopedSlots: { customRender: 'operator' }
  },
  {
    title: '跟进客户',
    dataIndex: 'member',
    width: 90,
    scopedSlots: { customRender: 'member' }
  },
  {
    title: '手机号',
    dataIndex: 'mobile'
  },
  {
    title: '客户等级',
    dataIndex: 'member_level',
    scopedSlots: { customRender: 'member_level' }
  },
  {
    title: `跟进${vm.$c('coach')}`,
    dataIndex: 'coach',
    scopedSlots: { customRender: 'coach' }
  },
  {
    title: '跟进销售',
    dataIndex: 'salesman',
    scopedSlots: { customRender: 'salesman' }
  },
  {
    title: '跟进方式',
    dataIndex: 'follow_way',
    scopedSlots: { customRender: 'follow_way' }
  },
  {
    title: '跟进状态',
    dataIndex: 'follow_status',
    scopedSlots: { customRender: 'follow_status' }
  },
  {
    title: '下次跟进时间',
    dataIndex: 'follow_next_time',
    width: 120
  },
  {
    dataIndex: 'follow_num',
    slots: { title: 'contentTitle' }
  },
  {
    title: '跟进内容',
    dataIndex: 'follow_content',
    width: '150px',
    scopedSlots: { customRender: 'follow_content' }
  }
]
