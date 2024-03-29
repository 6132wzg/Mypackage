import { PatternService } from '@/services/pattern.service'
export const ruleOptions = (vm: any) => {
  const pattern = new PatternService()
  return {
    template_name: {
      rules: [
        {
          required: true,
          pattern: pattern.CN_EN_NUM_SPACE('1-15'),
          message: '请输入正确模板名称'
        }
      ]
    },
    salary: {
      rules: [
        {
          required: true,
          pattern: pattern.NUM_POINT('1-6'),
          message: '请输入正确月底薪'
        }
      ]
    }
  }
}
