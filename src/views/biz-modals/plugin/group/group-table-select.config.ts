export const GroupBuycolumns = (vm: any) => {
  return [
    {
      title: '活动名称',
      dataIndex: 'activity_name',
      width: 100
    },
    {
      title: '商品类型',
      dataIndex: 'product_type.name'
    },
    {
      title: '活动时间',
      dataIndex: 'activity_time'
    },
    {
      title: '活动状态',
      dataIndex: 'activity_state',
      scopedSlots: { customRender: 'groupbuy_activity_status' }
    },
    {
      title: '剩余活动库存',
      dataIndex: 'stock_remaining'
    }
  ]
}
