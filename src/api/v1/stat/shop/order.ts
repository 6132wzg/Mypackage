import { Api } from '@/api/api'
// 门店下的营收统计
export class OrderApi extends Api {
  /**
   * 门店 订单汇总 列表
   */
  getData(query: OrderDataParams) {
    return this.http.get(`/v1/report/order-collect/shop/list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 门店 订单汇总 列表合计
   */
  getDataTotal(query: OrderDataParams) {
    return this.http.get(`/v1/report/order-collect/shop/list_total`, {
      query
      // yapi: 53
    })
  }

  /**
   * 门店 订单分析 列表
   */
  getAnalyseData(query: OrderDataParams) {
    return this.http.get(`/v1/report/order-analysis/shop/list`, {
      query
      // yapi: 53
    })
  }
}

export interface OrderChartParams {
  shop_id?: number
  day?: number
  start_date?: string
  end_date?: string
}

export interface OrderDataParams {
  shop_id?: number
  current_page?: number
  size?: number
  day?: number
  start_date?: string
  end_date?: string
}
