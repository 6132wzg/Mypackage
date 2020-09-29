import { Api } from '@/api/api'

export class DirectionalIssuanceApi extends Api {
  getList(query: any) {
    return this.http.get(`/v1/plugin/directional_issuance/coupon_list`, {
      query
    })
  }
  getSendList(query: any) {
    return this.http.get(`/v1/plugin/directional_issuance/record_list`, {
      query
    })
  }
  getCouponList(query: any) {
    return this.http.get(`/v1/plugin/directional_issuance/coupons`, {
      query
    })
  }
  sendCoupon(params: any) {
    return this.http.post(`v1/plugin/directional_issuance/issuing_coupons`, {
      params
    })
  }
}
