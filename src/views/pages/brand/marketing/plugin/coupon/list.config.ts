export const columns = (vm: any) => {
  const $t = vm.$t
  return [
    {
      title: '优惠券名称',
      fixed: 'left',
      width: 175,
      dataIndex: 'coupon_name',
      scopedSlots: { customRender: 'coupon_name' }
    },
    {
      title: '类型',
      dataIndex: 'coupon_type',
      width: 60,
      scopedSlots: { customRender: 'coupon_type' }
    },
    {
      title: '可用门店',
      dataIndex: 'is_shop_range',
      width: 175,
      scopedSlots: { customRender: 'is_shop_range' }
    },
    {
      title: '面额(元)',
      dataIndex: 'price',
      scopedSlots: { customRender: 'price' }
    },
    {
      title: '已领取',
      dataIndex: 'draw_num',
      scopedSlots: { customRender: 'draw_num' }
    },
    {
      title: '已使用',
      dataIndex: 'use_num',
      scopedSlots: { customRender: 'use_num' }
    },
    {
      title: '剩余数量',
      dataIndex: 'margin',
      scopedSlots: { customRender: 'margin' }
    },
    {
      title: '状态',
      dataIndex: 'coupon_status',
      width: 60,
      scopedSlots: { customRender: 'coupon_status' }
    },
    {
      title: '投放状态',
      dataIndex: 'put_status',
      width: 80,
      scopedSlots: { customRender: 'put_status' }
    },
    {
      title: '使用有效期',
      dataIndex: 'valid_days',
      scopedSlots: { customRender: 'valid_days' }
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 140,
      fixed: 'right',
      scopedSlots: { customRender: 'action' }
    }
  ]
}
