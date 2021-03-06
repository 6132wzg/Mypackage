export const ruleOptions = (vm: any) => {
  const pattern = vm.pattern
  return {
    memberName: {
      rules: [{ required: true, message: '请输入会员姓名' }]
    },
    memberId: {
      rules: [{ required: true, message: '请选择转让会员' }]
    },
    memberMobile: {
      rules: [
        { required: true, message: '请输入手机号' },
        {
          pattern: pattern.MOBILE,
          message: '输入的手机号格式错误，请重新输入'
        }
      ]
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
