export const columns = (vm: any) => {
  return [
    {
      title: '商品名称',
      dataIndex: 'product_name',
      width: 175,
      scopedSlots: { customRender: 'product_name' }
    },
    {
      title: '商品分类',
      dataIndex: 'category_name',
      scopedSlots: { customRender: 'category_name' }
    },
    {
      title: '售卖方式',
      dataIndex: 'sale_type_name',
      scopedSlots: { customRender: 'sale_type_name' }
    },
    {
      title: '上架状态',
      dataIndex: 'product_shelves_name',
      scopedSlots: { customRender: 'product_shelves_name' }
    },
    {
      title: '销量',
      dataIndex: 'sales_volume',
      scopedSlots: { customRender: 'sales_volume' }
    },
    {
      title: '单价(元)',
      dataIndex: 'selling_price',
      scopedSlots: { customRender: 'selling_price' }
    },
    {
      title: '库存',
      dataIndex: 'stock_amount',
      scopedSlots: { customRender: 'stock_amount' }
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 140,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
