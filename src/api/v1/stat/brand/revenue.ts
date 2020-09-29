import { Api } from '@/api/api'
// 品牌下的营收统计
export class RevenueApi extends Api {
  /**
   * 品牌 营收汇总 图表 line ring
   */
  getChart(query: RevenueChartParams) {
    return this.http.get(`/v1/report/revenue/brand/stat_summer`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 营收汇总 列表
   */
  getData(query: RevenueDataParams) {
    return this.http.get(`/v1/report/revenue/brand/revenue_list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 营收汇总 列表合计
   */
  getDataTotal(query: RevenueDataParams) {
    return this.http.get(`/v1/report/revenue/brand/revenue_total`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 营收汇总 当日营收
   */
  getDataToady(query: any) {
    return this.http.get(`/v1/report/revenue/brand/today_summer`, {
      query
      // yapi: 53
    })
  }

  /**
   * 品牌 商品分类营收汇总 列表
   */
  getProductData(query: RevenueDataParams) {
    return this.http.get(`/v1/report/revenue/brand/product/revenue_list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 商品分类营收汇总 列表合计
   */
  getProductDataTotal(query: RevenueDataParams) {
    return this.http.get(`/v1/report/revenue/brand/product/revenue_total`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 商品分类营收汇总 当日营收
   */
  getProductDataToady(query: any) {
    return this.http.get(`/v1/report/revenue/brand/product/today_summer`, {
      query
      // yapi: 53
    })
  }
}

export interface RevenueChartParams {
  shop_id?: number
  day?: number
  start_date?: string
  end_date?: string
}

export interface RevenueDataParams {
  shop_id?: number
  product_type?: number
  current_page?: number
  size?: number
  day?: number
  start_date?: string
  end_date?: string
}
