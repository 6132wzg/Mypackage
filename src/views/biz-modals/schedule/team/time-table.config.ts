import { message } from 'ant-design-vue'

export const ruleOptions = (vm: any) => {
  return {
    title: {
      rules: [
        {
          required: true,
          message: '请输入课表标题'
        },
        {
          min: 1,
          max: 10,
          message: '最多输入10个字符'
        }
      ]
    },
    selected_court: {
      rules: [
        {
          required: true,
          message: '请选择场地'
        }
      ]
    }
  }
}
