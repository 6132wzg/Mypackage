export const ruleOptions = (vm: any) => {
  const pattern = vm.pattern
  return {
    saleName: {
      rules: [{ required: true, message: '请选择销售人员' }]
    },
    productId: {
      initialValue: undefined,
      rules: [{ required: true, message: '请选择卡' }]
    }
  }
}
