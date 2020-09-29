export const ruleOptions = (vm: any) => {
  const pattern = vm.pattern
  return {
    card_id: {
      initialValue: undefined,
      rules: [
        {
          required: true,
          message: '请选择会员卡'
        }
      ]
    },
    remark: {
      rules: []
    },
    specs: {
      rules: [
        {
          required: true,
          message: '请选择规格'
        },
        {
          validator: (field: any, value: any, values: any) => {
            console.log('value', value)
          }
        }
      ]
    }
  }
}
export const columns = (vm: any) => [
  {
    title: '分期类型',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '首期收费(元)',
    dataIndex: 'first_amount'
    // scopedSlots: { customRender: 'first_amount' }
  },
  {
    title: '次期续费(元)',
    dataIndex: 'amount'
    // scopedSlots: { customRender: 'amount' }
  }
]
