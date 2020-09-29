export const ruleOptions = (vm: any) => {
  return {
    coach_ids: {
      rules: [{ required: true, message: `请选择修改${vm.$c('coach')}` }]
    },
    coach_type: {},
    description: {}
  }
}
