import { Api } from '@/api/api'
// 门店下的销售统计数据
export class SalesApi extends Api {
  /**
   * 门店 销售 列表
   */
  getData(query: SaleDataParams) {
    return this.http.get(`/v1/report/sales/shop/get-list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 门店 销售 合计
   */
  getDataTotal(query: SaleDataParams) {
    return this.http.get(`/v1/report/sales/shop/get-total-data`, {
      query
      // yapi: 53
    })
  }
  /**
   * 门店 销售 子列表
   */
  getDetailData(query: SaleDataParams) {
    return this.http.get(`/v1/report/sales/shop/get-order-list`, {
      query
      // yapi: 53
    })
  }

  /**
   * 门店 销售汇总(商品) 列表
   */
  getProductData(query: SaleDataParams) {
    return this.http.get(`/v1/report/product-performance/shop/get-list`, {
      query
      // yapi: 53
    })
  }
  /**
   * 门店 销售汇总(商品) 合计
   */
  getProductDataTotal(query: SaleDataParams) {
    return this.http.get(`/v1/report/product-performance/shop/get-total-data`, {
      query
      // yapi: 53
    })
  }
}

export interface SaleChartParams {
  day?: number
  start_date?: string
  end_date?: string
}

export interface SaleDataParams {
  section_id?: number
  contract_type?: number
  staff_id?: number
  current_page?: number
  size?: number
  day?: number
  start_date?: string
  end_date?: string
}
