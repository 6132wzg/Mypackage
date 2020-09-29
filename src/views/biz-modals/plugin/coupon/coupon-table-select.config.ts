export const Couponcolumns = (vm: any) => {
  return [
    {
      title: '优惠券名称',
      dataIndex: 'activity_name',
      width: 100
    },
    {
      title: '面额',
      dataIndex: 'price'
    },
    {
      title: '使用有效期',
      dataIndex: 'valid_days'
    },
    {
      title: '剩余数量',
      dataIndex: 'margin'
    },
    {
      title: '状态',
      dataIndex: 'coupon_status',
      scopedSlots: { customRender: 'coupon_status' }
    },
    {
      title: '投放状态',
      dataIndex: 'put_status',
      scopedSlots: { customRender: 'put_status' }
    }
  ]
}
