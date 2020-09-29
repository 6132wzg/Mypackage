import { Api } from '@/api/api'
// 品牌下的收银统计
export class CashierApi extends Api {
  /**
   * 品牌 收银汇总 图表 line ring
   */
  getChart(query: CashierChartParams, type: any = 'income') {
    const url = {
      income: '/v1/report/cashier-collect/brand/summer',
      refund: `/v1/report/cashier-refund/brand/summer`
    }[type]
    return this.http.get(url, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 收银汇总 列表
   */
  getData(query: CashierDataParams) {
    return this.http.get(`/v1/report/cashier-collect/brand/list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 收银汇总 列表合计
   */
  getDataTotal(query: CashierDataParams) {
    return this.http.get(`/v1/report/cashier-collect/brand/list_total`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 收银汇总 当日收入
   */
  getDataToady(query: any) {
    return this.http.get(`/v1/report/cashier-collect/brand/today_summer`, {
      query
      // yapi: 53
    })
  }

  /**
   * 品牌 退款汇总 列表
   */
  getRefundData(query: CashierDataParams) {
    return this.http.get(`/v1/report/cashier-refund/brand/list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 退款汇总 列表合计
   */
  getRefundDataTotal(query: CashierDataParams) {
    return this.http.get(`/v1/report/cashier-refund/brand/list_total`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 退款汇总 当日退款
   */
  getRefundDataToady(query: any) {
    return this.http.get(`/v1/report/cashier-refund/brand/today_summer`, {
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
