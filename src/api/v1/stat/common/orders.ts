// 营收明细、订单明细、客单价明细

import { Api } from '@/api/api'
// 营收统计（门店、品牌）弹窗
export class OrdersApi extends Api {
  /**
   * barnd 品牌 shop 门店
   * gather 汇总 product 商品维度
   */
  RevenueMap$ = {
    'brand-revenue-gather': '/v1/report/revenue/brand/revenue_everyday_list',
    'brand-revenue-product':
      '/v1/report/revenue/brand/product/revenue_everyday_list',
    'shop-revenue-gather': '/v1/report/revenue/shop/revenue_everyday_list',
    'shop-revenue-product':
      '/v1/report/revenue/shop/product/revenue_everyday_list'
  }
  /**
   * 营收汇总 营收明细
   */
  getRevenueList(query: OrdersDataParams, type: any) {
    const url = this.RevenueMap$[type]
    return this.http.get(url, {
      query
      // yapi: 53
    })
  }

  getOrderUrl(type: any, query: OrdersDataParams) {
    /**
     * barnd 品牌 shop 门店
     * revenue 营收 orders 订单
     * gather 汇总 product 商品维度 analyse 分析
     */
    const OrderMap$ = {
      'brand-revenue-gather': '/v1/report/revenue/brand/revenue_order_list',
      'brand-revenue-product':
        '/v1/report/revenue/brand/product/revenue_order_list',
      'brand-orders-gather': '/v1/report/order-collect/brand/order_list',
      'shop-revenue-gather': '/v1/report/revenue/shop/revenue_order_list',
      'shop-revenue-product':
        '/v1/report/revenue/shop/product/revenue_order_list',
      'shop-orders-gather': '/v1/report/order-collect/shop/order_list',
      'brand-orders-analyse': '/v1/report/order-analysis/brand/order_list',
      'shop-orders-analyse': '/v1/report/order-analysis/shop/order_list',
      'brand-plugin-discount': `/v1/plugin/limited_time_discount/${query.id}/order`,
      'brand-plugin-seckill': `/v1/plugin/limited_time_spike/${query.id}/order`
    }
    return OrderMap$[type]
  }
  /**
   * 营收、订单模块 订单明细
   */
  getOrderList(query: OrdersDataParams, type: any) {
    return this.http.get(this.getOrderUrl(type, query), {
      query
      // yapi: 53
    })
  }

  /**
   * barnd 品牌 shop 门店
   * orders 订单
   * gather 汇总 analyse 分析
   */
  PerOrderMap$ = {
    'brand-orders-analyse': '/v1/report/order-analysis/brand/order_per_price',
    'shop-orders-analyse': '/v1/report/order-analysis/shop/order_per_price'
  }
  /**
   * 客单价日明细
   */
  getPerOrderList(query: OrdersDataParams, type: any) {
    return this.http.get(this.PerOrderMap$[type], {
      query
      // yapi: 53
    })
  }
}

export interface OrdersDataParams {
  id?: number
  shop_id?: number
  product_type?: number
  is_include_advance?: number
  current_page?: number
  size?: number
  day?: number
  start_date?: string
  end_date?: string
}
