import { Api } from '@/api/api'
export class SettingMinaApi extends Api {
  /**
   * 微信小程序基本信息
   */
  getInfo() {
    return this.http.get('/v1/setting/mina/index')
  }
  /**
   * 授权回调
   */
  callback(params: CallbackParams) {
    return this.http.post('/v1/setting/mina/callback', { params })
  }
  /**
   * 配置微信支付
   */
  saveMch(params: PayConfigForm) {
    return this.http.post('/v1/setting/mina/save_mch', { params })
  }
  /**
   * 查询微信支付配置
   */
  payMch() {
    return this.http.get('/v1/setting/mina/pay_mch')
  }
  /**
   * 小程序提交审核
   */
  subAudit() {
    return this.http.post('/v1/setting/mina/sub_audit')
  }
  /**
   * 查询小程序H5信息
   */
  getH5Info(query: H5Query) {
    return this.http.get('/v1/setting/mina/setting', { query })
  }
  /**
   * 查询教练详情
   */
  getCoachInfo(query: StaffID) {
    return this.http.get('/v1/setting/mina/coach', { query })
  }
  /**
   * 查询底部导航
   */
  getMenu() {
    return this.http.get('/v1/setting/mina/tabbar')
  }
  /**
   * 保存底部导航
   */
  saveMenu(params: Menus) {
    return this.http.post('/v1/setting/mina/tabbar', { params })
  }
  /**
   * 保存设置
   */
  save(params: SaveForm) {
    return this.http.post('/v1/setting/mina/main_set', { params })
  }
  /**
   * 保存预约tab设置
   */
  saveReserve(params: ReserveTabs) {
    return this.http.post('/v1/setting/mina/course', { params })
  }
  /**
   * 获取活动列表
   */
  getActivityList() {
    return this.http.get('/v1/setting/mina/activity_list')
  }
  /**
   * 获取小程序路径列表
   */
  getPathList() {
    return this.http.get('/v1/setting/mina/menu')
  }
  /**
   * 获取自定义模块列表
   */
  getComponentList(query) {
    return this.http.get('/v1/setting/mina/component', { query })
  }
  /**
   * 获取门店已配置模块列表
   */
  getShopComponentList(query: ShopComponentList) {
    return this.http.get('/v1/setting/mina/config', { query })
  }
  /**
   * 保存门店模块配置
   */
  postShopComponentList(params: PostShopComponentList) {
    return this.http.post('/v1/setting/mina/config', { params })
  }
  /**
   * 获取卡项列表
   */
  getCardList(query: GetPersonalCourseInput) {
    return this.http.get(`/v1/setting/mina/cards`, {
      query
    })
  }
  /**
   * 获取私教课列表
   */
  getPersonalCourseList(query: GetPersonalCourseInput) {
    return this.http.get(`/v1/setting/mina/personal`, {
      query
    })
  }
  /**
   * 获取小班课列表
   */
  getSmallCourseList(query: GetPersonalCourseInput) {
    return this.http.get(`/v1/setting/mina/small`, {
      query
    })
  }
  /**
   * 获取团课列表
   */
  getTeamCourseList(query: GetPersonalCourseInput) {
    return this.http.get(`/v1/setting/mina/team`, {
      query
    })
  }
  /**
   * 获取团课列表
   */
  getPackageList(query: GetPersonalCourseInput) {
    return this.http.get(`/v1/setting/mina/package`, {
      query
    })
  }
  /**
   * 获取员工列表
   */
  getCoachList(query: GetPersonalCourseInput) {
    return this.http.get(`/v1/setting/mina/coaches`, {
      query
    })
  }
  /**
   * 获取优惠券列表
   */
  getCouponList(query: GetPersonalCourseInput) {
    return this.http.get(`/v1/setting/mina/coupon`, {
      query
    })
  }
  /**
   * 切换规则时获取预览内容
   */
  getPreview(query: GetPreviewInput) {
    return this.http.get('/v1/setting/mina/preview', { query })
  }
  /**
   * 链接路径列表
   */
  getLinkPathList() {
    return this.http.get('/v1/setting/mina/path')
  }
}

export interface CallbackParams {
  auth_code: string
  expires_in: number
}
export interface PayConfigForm {
  mch_name: string
  mch_id: string
  key: string
}
export interface H5Query {
  category: number
}
export interface SaveForm {
  is_status: number // 2发布3关闭
  content: []
}
export interface StaffID {
  staff_id: number[]
}
export interface Menus {
  tabbar: []
}
export interface ReserveTabs {
  content: []
}
export interface ShopComponentList {
  shop_id: string
  tab_type: string
}
export interface PostShopComponentList {
  info: []
}
export interface ComponentList {
  shop_id: any
  tab_type: string
}
export interface GetPersonalCourseInput {
  current_page?: number
  size?: number
  shop_id: number
  keywords: string
}
export interface GetPreviewInput {
  shop_id: number
  /**
   * 模块类型
   */
  module_type: number
  /**
   * 展示规则，哪个模块就传哪个模块的data_source
   */
  data_source: number
}
