export const ruleOptions = (vm: any) => {
  return {
    payment_type: {
      rules: [{ required: true, message: '请选择支付方式!' }]
    },
    deposit_card_id: {
      rules: [{ required: true, message: '请选择储值卡!' }]
    }
  }
}
