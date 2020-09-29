export const columns = () => {
  return [
    {
      title: '储值卡名称',
      dataIndex: 'card_name',
      width: 175,
      scopedSlots: { customRender: 'card_name' }
    },
    {
      title: '有效期',
      dataIndex: 'num',
      scopedSlots: { customRender: 'num' }
    },
    {
      title: '储值金额(元)',
      dataIndex: 'card_price',
      scopedSlots: { customRender: 'card_price' }
    },
    {
      title: '售卖价格(元)',
      dataIndex: 'sell_price',
      scopedSlots: { customRender: 'sell_price' }
    },
    {
      title: '支持消费门店',
      dataIndex: 'consumption_range',
      scopedSlots: { customRender: 'consumption_range' }
    },
    {
      title: '售卖时间',
      dataIndex: 'sell_time',
      scopedSlots: { customRender: 'sell_time' }
    },
    {
      title: '发布渠道',
      dataIndex: 'publish_channel',
      scopedSlots: { customRender: 'publish_channel' }
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 100,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
