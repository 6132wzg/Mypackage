export const Seckillcolumns = (vm: any) => {
  return [
    {
      title: '活动名称',
      dataIndex: 'activity_name',
      width: 100
    },
    {
      title: '商品类型',
      scopedSlots: { customRender: 'product_type' },
      dataIndex: 'product_type'
    },
    {
      title: '活动时间',
      dataIndex: 'activity_time'
    },
    {
      title: '活动状态',
      scopedSlots: { customRender: 'activity_status' },
      dataIndex: 'activity_status'
    },
    {
      title: '剩余活动库存',
      dataIndex: 'stock_remain'
    }
  ]
}
