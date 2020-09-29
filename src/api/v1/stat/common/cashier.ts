import { Api } from '@/api/api'

export class CashierApi extends Api {
  /**
   * barnd 品牌 shop 门店
   * cashier 订单
   * income 收入 refund 退款
   */
  cashierMap$ = {
    'brand-cashier-income': '/v1/report/cashier-collect/brand/everyday_stat',
    'shop-cashier-income': '/v1/report/cashier-collect/shop/everyday_stat',
    'brand-cashier-refund': '/v1/report/cashier-refund/brand/everyday_stat',
    'shop-cashier-refund': '/v1/report/cashier-refund/shop/everyday_stat'
  }
  /**
   * 收银日明细
   */
  getCashierList(query: CashierDataParams, type: any) {
    return this.http.get(this.cashierMap$[type], {
      query,
      yapi: 53
    })
  }
}

export interface CashierDataParams {
  shop_id?: number
  product_type?: number
  is_include_advance?: number
  current_page?: number
  size?: number
  day?: number
  start_date?: string
  end_date?: string
}
