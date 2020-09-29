export const ruleOptions = (vm: any) => {
  return {
    currentCourseIds: {
      initialValue: [],
      rules: [
        {
          required: vm.isRequired,
          message: `请选择${vm.label}`
        }
      ]
    }
  }
}
