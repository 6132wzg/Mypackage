import { Api } from '@/api/api'

export class IconsApi extends Api {
  /**
   * 注册会员 并 新增到访预约
   */
  setFrontIcons(params: FrontIconsInput) {
    return this.http.post('/v1/front/icons', { params })
  }
  /**
   * 打印小票
   */
  getFrontIcons() {
    return this.http.get(`/v1/front/icons`)
  }
}
export interface FrontIconsInput {
  icons: object
}
