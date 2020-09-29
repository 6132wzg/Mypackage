import { Api } from '@/api/api'

export class SoldDepositCardApi extends Api {
  /**
   * 获取售出权益回显数据
   * @param {number} id
   */
  getRightsInfo(id: number) {
    return this.http.get(`/v1/sold/cards/deposit/rights/${id}`)
  }
  /**
   * 修改售出权益
   * @param {number} id
   */
  updateRights(id, params: UpdateRightsInput) {
    return this.http.put(`/v1/sold/cards/deposit/rights/${id}`, {
      params
    })
  }
}

export interface UpdateRightsInput {}
