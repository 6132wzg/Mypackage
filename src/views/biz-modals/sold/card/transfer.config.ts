export const ruleOptions = (vm: any) => {
  const pattern = vm.pattern
  return {
    startTime: {
      rules: [{ required: true, message: '请选择有效开始日期' }]
    },
    remainPrice: {
      rules: [{ required: true, message: '请输入剩余价值' }]
    },
    payType: {
      rules: [{ required: true, message: '请选择支付方式' }]
    },
    handling_fee_reduce: {}
  }
}
