export enum CARD_TYPE {
  number = 1,
  period = 2
}
export const columns = (vm: any) => {
  return [
    {
      title: `${vm.$c('member_card')}名称`,
      dataIndex: 'card_name',
      fixed: 'left',
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
      title: '支持入场门店',
      dataIndex: 'admission_range',
      width: 175,
      scopedSlots: { customRender: 'admission_range' }
    },
    {
      title: '支持售卖门店',
      dataIndex: 'support_sales',
      width: 175,
      scopedSlots: { customRender: 'support_sales' }
    },
    {
      title: '定价方式',
      dataIndex: 'price_setting',
      scopedSlots: { customRender: 'price_setting' }
    },
    {
      title: '有效期/有效次数',
      dataIndex: 'time_gradient',
      scopedSlots: { customRender: 'time_gradient' }
    },
    {
      title: '售卖价格(元)',
      dataIndex: 'price_gradient',
      sorter: true,
      scopedSlots: { customRender: 'price_gradient' }
    },
    {
      title: '上/下架门店',
      dataIndex: 'shelf',
      scopedSlots: { customRender: 'shelf' }
    },
    {
      title: '售卖状态',
      dataIndex: 'sell_status',
      scopedSlots: { customRender: 'sell_status' }
    },
    {
      title: '支持售卖时间',
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
      width: 160,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
