export const ruleOptions = (vm: any) => {
  return {
    refundPrice: {
      rules: [{ required: true, message: '请输入退款金额' }]
    },
    gift_points: {
      rules: [{ validator: vm.handleIntegralCheck }],
      initialValue: vm.packageInfo.gift_points
    }
  }
}
