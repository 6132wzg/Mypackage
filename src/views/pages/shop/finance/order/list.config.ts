export const columns = () => {
  return [
    {
      title: '订单编号',
      dataIndex: 'id',
      fixed: 'left',
      width: 200,
      scopedSlots: { customRender: 'id' }
    },
    // {
    //   title: '订单类型',
    //   dataIndex: 'activity_type_name',
    //   scopedSlots: { customRender: 'activity_type_name' }
    // },
    {
      title: '商品类型',
      dataIndex: 'product_type_name',
      scopedSlots: { customRender: 'product_type_name' }
    },
    {
      title: '商品名称',
      dataIndex: 'product_name',
      width: 175,
      scopedSlots: { customRender: 'product_name' }
    },
    {
      title: '订单状态',
      dataIndex: 'order_status_name',
      scopedSlots: { customRender: 'order_status_name' }
    },
    {
      title: '支付状态',
      dataIndex: 'pay_status',
      scopedSlots: { customRender: 'pay_status' }
    },
    {
      title: '会员姓名',
      dataIndex: 'member_name',
      width: 90,
      scopedSlots: { customRender: 'member_name' }
    },
    {
      title: '手机号',
      dataIndex: 'member_mobile',
      scopedSlots: { customRender: 'member_mobile' }
    },
    {
      title: '订单总价(元)',
      dataIndex: 'total_price',
      scopedSlots: { customRender: 'total_price' }
    },
    {
      title: '优惠(元)',
      dataIndex: 'order_discount',
      scopedSlots: { customRender: 'order_discount' }
    },
    {
      title: '减免(元)',
      dataIndex: 'reduce_price',
      scopedSlots: { customRender: 'reduce_price' }
    },
    {
      title: '实收(元)',
      dataIndex: 'pay_price',
      scopedSlots: { customRender: 'pay_price' }
    },
    {
      title: '剩余待收(元)',
      dataIndex: 'remainder_price',
      scopedSlots: { customRender: 'remainder_price' }
    },
    {
      title: '创建时间',
      dataIndex: 'created_time',
      scopedSlots: { customRender: 'created_time' }
    },
    {
      title: '支付时间',
      dataIndex: 'pay_last_time',
      scopedSlots: { customRender: 'pay_last_time' }
    },
    {
      title: '销售',
      dataIndex: 'staff_name',
      scopedSlots: { customRender: 'staff_name' }
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
