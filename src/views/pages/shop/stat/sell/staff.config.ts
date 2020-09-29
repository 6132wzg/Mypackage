export const columns = () => [
  {
    title: '员工',
    width: 140,
    dataIndex: 'nickname'
  },
  {
    title: '实收(含定金)',
    width: 120,
    dataIndex: 'total_amount'
  },
  {
    title: '退款(元)',
    width: 100,
    dataIndex: 'refund_amount'
  },
  {
    title: '业绩(元)',
    width: 100,
    dataIndex: 'real_amount'
  },
  {
    title: '原价(元)',
    width: 100,
    dataIndex: 'contract_amount'
  },
  {
    title: '使用定金(元)',
    dataIndex: 'earnest_amount'
  }
]

export const childColumns = () => [
  {
    title: '商品名称',
    width: 140,
    dataIndex: 'product_name'
  },
  {
    title: '实收(含定金)',
    width: 120,
    dataIndex: 'total_amount'
  },
  {
    title: '退款(元)',
    width: 100,
    dataIndex: 'refund_amount'
  },
  {
    title: '业绩(元)',
    width: 100,
    dataIndex: 'real_amount'
  },
  {
    title: '原价(元)',
    width: 100,
    dataIndex: 'contract_amount'
  },
  {
    title: '使用定金(元)',
    width: 120,
    dataIndex: 'earnest_amount'
  },
  {
    title: '门店名称',
    // width: 100,
    dataIndex: 'shop_name'
  },
  {
    title: '分单比例',
    // width: 80,
    dataIndex: 'proportion'
  },
  {
    title: '商品类目',
    // width: 100,
    dataIndex: 'product_cate_name'
  },
  {
    title: '合同类型',
    // width: 80,
    dataIndex: 'contract_type_name'
  },
  {
    title: '会员名',
    // width: 120,
    dataIndex: 'member_name'
  },
  {
    title: '手机号',
    width: 120,
    dataIndex: 'member_mobile'
  },
  {
    title: '完款日期',
    scopedSlots: { customRender: 'pay_date' },
    width: 120,
    dataIndex: 'pay_date'
  }
]

export const totalColumns = () => [
  {
    title: '实收(含定金)',
    unit: '¥',
    dataIndex: 'total_amount'
  },
  {
    title: '退款',
    unit: '¥',
    dataIndex: 'refund_amount'
  },
  {
    title: '业绩',
    unit: '¥',
    dataIndex: 'real_amount'
  },
  {
    title: '原价',
    unit: '¥',
    dataIndex: 'contract_amount'
  },
  {
    title: '使用定金',
    unit: '¥',
    dataIndex: 'earnest_amount'
  }
]
