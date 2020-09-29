export const columns = (vm: any) => {
  return [
    {
      title: '类型',
      dataIndex: 'stat_date'
    },
    {
      title: '金额(元)',
      dataIndex: 'total_amount',
      align: 'right'
    },
    {
      title: `平台手续费(元)`,
      dataIndex: 'member_card_amount',
      align: 'right'
    },
    {
      title: '备注',
      dataIndex: 'personal_course_amount'
    },
    {
      title: '状态',
      dataIndex: 'team_course_amount'
    },
    {
      title: '提现账户',
      dataIndex: 'package_course_amount'
    },
    {
      title: `提现银行`,
      dataIndex: 'small_course_amount'
    },
    {
      title: '提现账号',
      dataIndex: 'shop_amount'
    },
    {
      title: '处理时间',
      dataIndex: 'other_amount'
    },
    {
      title: '结算时间',
      dataIndex: 'other_amount1'
    }
  ]
}
export const totalColumns = (vm: any) => {
  return [
    {
      title: '总提现金额(元)',
      dataIndex: 'personal_course_amount'
    },
    {
      title: '总提现单数',
      dataIndex: 'package_course_amount'
    }
  ]
}
