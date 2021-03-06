export enum CARD_TYPE {
  number = 1,
  period = 2
}
export const columns = (vm: any) => {
  return [
    {
      title: `${vm.$c('member_card')}名称`,
      dataIndex: 'card_name',
      width: 175,
      scopedSlots: { customRender: 'card_name' }
    },
    {
      title: '类型',
      dataIndex: 'card_type',
      scopedSlots: { customRender: 'card_type' }
    },
    {
      title: '支持入场人数',
      dataIndex: 'support_member_num'
    },
    {
      title: '有效期/有效次数',
      dataIndex: 'time_gradient',
      scopedSlots: { customRender: 'time_gradient' }
    },
    {
      title: '售卖价格(元)',
      dataIndex: 'price_gradient',
      scopedSlots: { customRender: 'price_gradient' }
    },
    {
      title: '支持入场范围',
      dataIndex: 'admission_range',
      scopedSlots: { customRender: 'admission_range' }
    },
    {
      title: '售卖时间',
      dataIndex: 'sell_time',
      width: 120,
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
      width: 140,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
