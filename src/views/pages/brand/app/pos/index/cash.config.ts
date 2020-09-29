export const totalColumns = () => [
  {
    title: '实际营收',
    unit: '¥',
    // scopedSlots: { customRender: 'word1' },
    dataIndex: 'real_revenue'
  },
  {
    title: '总营收',
    unit: '¥',
    dataIndex: 'total_revenue'
  },
  {
    title: '总手续费',
    unit: '¥',
    dataIndex: 'service_fee'
  },
  {
    title: `总退款`,
    unit: '¥',
    dataIndex: 'total_refund'
  }
]
export const tableColumns = vm => [
  {
    title: '流水号',
    dataIndex: 'serial_no'
  },
  {
    title: '实际营收(元)',
    dataIndex: 'real_revenue'
  },
  {
    title: `实收营收(元)`,
    dataIndex: 'total_revenue'
  },
  {
    title: '手续费(元)',
    dataIndex: 'service_fee'
  },
  {
    title: '退款(元)',
    dataIndex: 'total_refund'
  },
  {
    title: `所属门店`,
    dataIndex: 'shop_name'
  },
  {
    title: '收款时间',
    dataIndex: 'revenue_date'
  },
  {
    title: '操作人',
    dataIndex: 'operate'
  },
  {
    title: `关联订单号`,
    dataIndex: 'order_id'
  }
]
