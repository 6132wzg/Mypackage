export const ruleOptions = (vm: any) => {
  return {
    effective_way: {
      initialValue: 1
    },
    saleName: {
      rules: [{ required: true, message: '请选择销售人员' }]
    },
    productId: {
      initialValue: undefined,
      rules: [{ required: true, message: '请选择课' }]
    }
  }
}
