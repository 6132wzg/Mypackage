export const ruleOptions = (vm: any) => {
  const pattern = vm.pattern
  return {
    course_num: {
      rules: [{ required: true, message: `请输入购买课时` }]
    },
    gift_course_num: {},
    coursePrice: {
      rules: [{ required: true, message: '请输入课程的单价' }]
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
