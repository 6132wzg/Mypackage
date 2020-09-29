export const Cardcolumns = (vm: any) => {
  return [
    {
      title: '卡项',
      dataIndex: 'card_name',
      width: 100
    },
    {
      title: '类型',
      dataIndex: 'card_type',
      scopedSlots: { customRender: 'card_type' }
    },
    {
      title: '有效期(天)',
      dataIndex: 'time_gradient'
    },
    {
      title: '售价',
      dataIndex: 'price',
      scopedSlots: { customRender: 'card_price' }
    },
    {
      title: '售卖时间',
      dataIndex: 'sale_time',
      width: 140
    }
  ]
}
