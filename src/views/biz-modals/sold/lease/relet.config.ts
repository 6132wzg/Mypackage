export const ruleOptions = (vm: any) => {
  return {
    end_time: {
      rules: [{ required: true, message: '请选择租赁时间' }]
    },
    lease_num: {
      rules: [{ required: true, message: '请填租赁天数' }]
    },
    saleName: {
      rules: [{ required: true, message: '请选择销售人员' }]
    }
  }
}
