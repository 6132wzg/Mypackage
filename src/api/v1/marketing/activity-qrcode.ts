import { Api } from '../../api'
export interface GetActivityQrcodeListQuery {
  keyword: string
  shop_id: string
  size: number
  current_page: number
}
export interface GetFollowListQuery {
  activity_qrcode_id: string
  size: number
  current_page: number
}
export interface GetScanListQuery {
  activity_qrcode_id: string
  size: number
  current_page: number
}
export class ActivityQrcodeApi extends Api {
  /**
   * 获取推广码列表
   */
  getList(query: GetActivityQrcodeListQuery) {
    return this.http.get(`/v1/plugin/activity_qrcode/list`, { query })
  }
  /**
   *  获取扫码用户列表
   */
  getScanList(query: GetScanListQuery) {
    return this.http.get(`/v1/plugin/activity_qrcode/scan_list`, {
      query
    })
  }
  /**
   * 获取跟进用户列表
   */
  getFollowList(query: GetFollowListQuery) {
    return this.http.get(`/v1/plugin/activity_qrcode/follow_list`, {
      query
    })
  }
  /**
   * 获取二维码详情
   */
  getInfo(activity_qrcode_id: number) {
    return this.http.get(`/v1/plugin/activity_qrcode/info`, {
      query: { activity_qrcode_id }
    })
  }
}
