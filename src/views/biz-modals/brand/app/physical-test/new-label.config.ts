import { PatternService } from '@/services/pattern.service'

export const ruleOptions = (vm: any) => {
  const pattern = new PatternService()
  return {
    inputLabel: {
      rules: [
        {
          required: true,
          pattern: pattern.CN_EN_NUM('1-8'),
          message: '请输入1~8个英文，中文字符'
        }
      ]
    }
  }
}
