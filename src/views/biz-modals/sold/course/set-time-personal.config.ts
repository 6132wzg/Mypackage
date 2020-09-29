export const ruleOptions = (vm: any) => {
  return {
    end_time: {
      rules: [{ required: true, message: '请输入到期时间' }]
    },
    description: {}
  }
}
