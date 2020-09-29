import { Api } from '@/api/api'

export class CenterAppletApi extends Api {
  getInfo() {
    return this.http.get(`/v1/plugin/center_applet/index`, {})
  }
  getQrcode(query: QrcodeQuery) {
    return this.http.get('/v1/plugin/center_applet/qrcode', { query })
  }
  agree() {
    return this.http.post(`/v1/plugin/center_applet/agreement`, {})
  }
}
export interface QrcodeQuery {
  shop_id: number // 门店id
}
