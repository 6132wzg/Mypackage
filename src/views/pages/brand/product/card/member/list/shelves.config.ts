// 卡类
export enum CARD_TYPE {
  number = 1,
  period = 2
}

export const columns = (vm: any) => {
  return [
    {
      title: '售卖门店',
      dataIndex: 'shop_name',
      fixed: 'left',
      width: 175,
      scopedSlots: { customRender: 'shop_name' },
      sorter: true
    },
    {
      title: `${vm.$c('member_card')}名称`,
      dataIndex: 'card_name',
      width: 175,
      scopedSlots: { customRender: 'card_name' }
    },
    {
      title: '类型',
      dataIndex: 'card_type',
      width: 80,
      scopedSlots: { customRender: 'card_type' }
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
      title: `支持入场人数`,
      dataIndex: 'support_member_num'
    },
    {
      title: '支持入场门店',
      width: 175,
      dataIndex: 'admission_range',
      scopedSlots: { customRender: 'admission_range' }
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
      fixed: 'right',
      width: 140,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
