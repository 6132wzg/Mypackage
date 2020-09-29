import { Api } from '@/api/api'

export class FinanceAdvanceFeeApi extends Api {
  /**
   * 定金延期回显
   */
  getRenewalInfo(id: number) {
    return this.http.get(`/v1/finance/advance_fee/renewal/${id}`)
  }
  /**
   * 定金延期
   */
  updateRenewal(id: number, params: UpdateRenewalInput) {
    return this.http.put(`/v1/finance/advance_fee/renewal/${id}`, {
      params
    })
  }
}
export interface UpdateRenewalInput {
  /**
   * 延期结束时间
   */
  end_time: string
  /**
   * 备注
   */
  description: string
}
