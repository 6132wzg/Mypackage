export const ruleOptions = (vm: any) => {
  const pattern = vm.pattern
  return {
    user_type: {
      initialValue: 1,
      rules: [
        {
          required: true,
          message: '请选择接收对象'
        }
      ]
    },
    send_value: {
      rules: [
        {
          required: true,
          message: '请输入内容'
        }
      ]
    },
    send_type: {
      initialValue: 1,
      rules: [
        {
          required: true,
          message: ''
        }
      ]
    },
    send_time: {
      rules: [
        {
          required: true,
          message: '请选择时间'
        }
      ]
    },
    title: {},
    tmpl_type: {
      initialValue: 1,
      rules: [
        {
          required: true,
          message: '请选择模版类型'
        }
      ]
    },
    content: {},
    is_save: {
      initialValue: 0
    },
    tmpl_id: {}
  }
}
