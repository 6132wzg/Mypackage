export const columns = () => {
  return [
    {
      title: '门店名称',
      fixed: 'left',
      width: 180,
      dataIndex: 'shop_name'
    },
    {
      title: '支持售卖时间',
      dataIndex: 'shelfDate',
      scopedSlots: {
        customRender: 'shelfDate'
      }
    },
    {
      title: '上架状态',
      dataIndex: 'shelfStatusName',
      scopedSlots: {
        customRender: 'shelfStatusName'
      }
    },
    {
      title: '下架原因',
      dataIndex: 'down_shelf_reason',
      align: 'right',
      scopedSlots: {
        customRender: 'down_shelf_reason'
      }
    }
  ]
}
