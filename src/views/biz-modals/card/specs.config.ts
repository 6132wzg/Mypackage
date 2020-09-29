export const columns = () => {
  return [
    {
      title: '有效期限',
      dataIndex: 'validity_period',
      width: '25%'
    },
    {
      title: '售卖价格',
      width: '25%',
      dataIndex: 'sale_price'
    },
    {
      title: '允许冻结',
      width: '25%',
      dataIndex: 'frozen_day'
    },
    {
      title: '赠送上限',
      width: '25%',
      dataIndex: 'gift_unit'
    }
  ]
}
