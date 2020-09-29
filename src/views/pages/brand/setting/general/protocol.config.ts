export const ruleOptions = (vm: any) => {
  return {
    protocol_status: {
      rules: [
        {
          required: true,
          message: '请选择协议状态'
        }
      ]
    },
    title: {
      rules: [
        {
          validator: (fileds: any, value: any, values: any) => {
            if (!value || value.length > 10) {
              return '请输入协议标题，最长10个字符'
            }
          }
        }
      ]
    },
    content: {
      rules: [
        {
          required: true,
          message: '请输入协议内容'
        }
      ]
    }
  }
}
