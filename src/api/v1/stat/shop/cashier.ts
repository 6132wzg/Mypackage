import { Api } from '@/api/api'
// 门店下的收银统计
export class CashierApi extends Api {
  /**
   * 门店 收银汇总 列表
   */
  getData(query: CashierDataParams) {
    return this.http.get(`/v1/report/cashier-collect/shop/list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 门店 收银汇总 列表合计
   */
  getDataTotal(query: CashierDataParams) {
    return this.http.get(`/v1/report/cashier-collect/shop/list_total`, {
      query
      // yapi: 53
    })
  }
  /**
   * 门店 收银汇总 当日收入
   */
  getDataToady(query: any) {
    return this.http.get(`/v1/report/cashier-collect/shop/today_summer`, {
      query
      // yapi: 53
    })
  }

  /**
   * 门店 退款汇总 列表
   */
  getRefundData(query: CashierDataParams) {
    return this.http.get(`/v1/report/cashier-refund/shop/list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 门店 退款汇总 列表合计
   */
  getRefundDataTotal(query: CashierDataParams) {
    return this.http.get(`/v1/report/cashier-refund/shop/list_total`, {
      query
      // yapi: 53
    })
  }
  /**
   * 门店 退款汇总 当日退款
   */
  getRefundDataToady(query: any) {
    return this.http.get(`/v1/report/cashier-refund/shop/today_summer`, {
      query
      // yapi: 53
    })
  }
}

export interface CashierChartParams {
  shop_id?: number
  day?: number
  start_date?: string
  end_date?: string
}

export interface CashierDataParams {
  shop_id?: number
  day?: number
  start_date?: string
  end_date?: string
  is_refresh?: number
}
