export const columns = () => [
  {
    title: '商品名称',
    width: 140,
    dataIndex: 'product_name'
  },
  {
    title: '合同类型',
    width: 100,
    dataIndex: 'contract_type_name'
  },
  {
    title: '实收金额(元)',
    width: 100,
    dataIndex: 'pay_price'
  },
  {
    title: '退款(元)',
    width: 100,
    dataIndex: 'refund_price'
  },
  {
    title: '销售',
    width: 100,
    dataIndex: 'sale_name'
  },
  {
    title: '分单比例',
    width: 100,
    dataIndex: 'split_ratio'
  },
  {
    title: '实际业绩(元)',
    width: 100,
    dataIndex: 'real_price'
  },
  {
    title: '合同原价(元)',
    width: 100,
    dataIndex: 'total_price'
  },
  {
    title: '使用定金(元)',
    width: 100,
    dataIndex: 'advance_fee'
  },
  {
    title: '门店名称',
    width: 100,
    dataIndex: 'shop_name'
  },
  {
    title: '会员名',
    width: 100,
    dataIndex: 'member_name'
  },
  {
    title: '手机号',
    width: 120,
    dataIndex: 'mobile'
  },
  {
    title: '完款日期',
    width: 120,
    dataIndex: 'pay_finished_date'
  },
  {
    title: '订单编号',
    width: 150,
    dataIndex: 'order_id'
  }
]
export const totalColumns = () => [
  {
    title: '实收金额',
    dataIndex: 'total_amount'
  },
  {
    title: '退款金额',
    dataIndex: 'total_refund_amount'
  },
  {
    title: '实际业绩',
    dataIndex: 'total_real_amount'
  },
  {
    title: '合同原价',
    dataIndex: 'total_contract_amount'
  },
  {
    title: '使用定金',
    dataIndex: 'total_earnest_amount'
  }
]
