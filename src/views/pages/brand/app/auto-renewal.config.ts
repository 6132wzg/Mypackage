export const columns = (vm: any) => [
  {
    title: '商品名称',
    dataIndex: 'card_name'
  },
  {
    title: '商品类型',
    dataIndex: 'card_type',
    scopedSlots: { customRender: 'card_type' }
  },
  {
    title: '上架状态',
    dataIndex: 'shelf_status',
    scopedSlots: { customRender: 'shelf_status' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 300,
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 140,
    scopedSlots: { customRender: 'action' }
  }
]
