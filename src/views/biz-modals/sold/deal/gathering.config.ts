export const ruleOptions = (vm: any) => {
  return {
    price: {
      rules: [{ required: true, message: '请输入支付金额!' }]
    }
  }
}
