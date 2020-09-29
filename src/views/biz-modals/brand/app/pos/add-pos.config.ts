import { PatternService } from '@/services/pattern.service'

export const ruleOptions = (vm: any) => {
  const pattern = new PatternService()
  return {
    shop_id: {
      rules: [
        {
          required: true,
          message: '门店为必选项'
        }
      ]
    },
    terminal_name: {
      initialValue: '',
      rules: [
        {
          required: true,
          pattern: pattern.CN_EN_NUM('1-15'),
          message: '请输入1~15个英文，中文字符'
        }
      ]
    },
    terminal_id: {
      rules: [
        {
          required: true,
          message: '设备为必选项'
        }
      ]
    }
  }
}
