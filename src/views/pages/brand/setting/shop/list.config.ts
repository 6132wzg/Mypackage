export const columns = () => {
  return [
    {
      title: '门店名称',
      width: 175,
      dataIndex: 'shop_name',
      scopedSlots: { customRender: 'shop_name' }
    },
    {
      title: '联系电话',
      width: 100,
      dataIndex: 'shop_phones',
      scopedSlots: { customRender: 'shop_phones' }
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      scopedSlots: { customRender: 'address' }
    },
    {
      title: '运营状态',
      dataIndex: 'shop_status',
      width: 80,
      scopedSlots: { customRender: 'shop_status' }
    },
    {
      title: '系统状态',
      dataIndex: 'is_valid',
      width: 80,
      scopedSlots: { customRender: 'is_valid' }
    },
    {
      title: '系统使用到期时间',
      dataIndex: 'expire_time',
      scopedSlots: { customRender: 'expire_time' }
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
