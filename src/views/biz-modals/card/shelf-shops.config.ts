export const columns = () => {
  return [
    {
      title: '门店名称',
      dataIndex: 'shop_name',
      width: '70%'
    },
    {
      title: '上架状态',
      width: '30%',
      dataIndex: 'shelf_status',
      scopedSlots: { customRender: 'shelf_status' }
    }
  ]
}
