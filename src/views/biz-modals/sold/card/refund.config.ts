export const ruleOptions = (vm: any) => {
  return {
    refund_price: {
      rules: [{ required: true, message: '请输入退款金额' }]
    },
    gift_points: {
      rules: [{ validator: vm.handleIntegralCheck }],
      initialValue: vm.refundInfo.gift_points
    }
  }
}
