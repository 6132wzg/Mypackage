import { Api } from '@/api/api'
// 品牌下的销售统计数据
export class SalesApi extends Api {
  /**
   * 品牌 销售 图表 ring
   */
  getChart(query: SaleChartParams) {
    return this.http.get(`/v1/report/sales/chart`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 销售 业绩排行榜
   */
  getFeatsRank(query: SaleChartParams) {
    return this.http.get(`/v1/report/sales/get-amount-top-list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 销售 销量排行榜
   */
  getSalesRank(query: SaleChartParams) {
    return this.http.get(`/v1/report/sales/get-order-top-list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 销售 列表
   */
  getData(query: SaleDataParams) {
    return this.http.get(`/v1/report/sales/brand/get-list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 销售 合计
   */
  getDataTotal(query: SaleDataParams) {
    return this.http.get(`/v1/report/sales/brand/get-total-data`, {
      query
      // yapi: 53
    })
  }
  /**
   * 销售 子列表
   */
  getDetailData(query: SaleDataParams) {
    return this.http.get(`/v1/report/sales/brand/get-order-list`, {
      query
      // yapi: 53
    })
  }

  /**
   * 品牌 销售汇总(商品) 列表
   */
  getProductData(query: SaleDataParams) {
    return this.http.get(`/v1/report/product-performance/brand/get-list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 品牌 销售汇总(商品) 合计
   */
  getProductDataTotal(query: SaleDataParams) {
    return this.http.get(
      `/v1/report/product-performance/brand/get-total-data`,
      {
        query
        // yapi: 53
      }
    )
  }
}

export interface SaleChartParams {
  shop_id?: number
  day?: number
  start_date?: string
  end_date?: string
}

export interface SaleDataParams {
  shop_id?: number
  section_id?: number
  contract_type?: number
  staff_id?: number
  current_page?: number
  size?: number
  day?: number
  start_date?: string
  end_date?: string
}
