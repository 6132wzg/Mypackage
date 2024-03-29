import { Injectable, Controller, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { OrderApi } from '@/api/v1/finance/order'
import { tap } from 'rxjs/operators'
import { AuthService } from '@/services/auth.service'

@Injectable()
export class InfoService implements Controller {
  info$ = new State({})
  tabs$ = new State([])
  auth$ = new State({})
  constructor(private orderApi: OrderApi, private authService: AuthService) {}
  @Effect()
  getInfo(id: string) {
    return this.orderApi.getOrderInfo(id).pipe(
      tap((res: any) => {
        this.auth$.commit(() => res.auth)
        this.info$.commit(() => res.info)
        this.tabs$.commit(() => {
          const tabs = [
            {
              label: '收款明细',
              route: {
                name: 'shop-finance-order-info-collection-details',
                query: { id }
              }
            },
            {
              label: '商品信息',
              route: {
                name: 'shop-finance-order-info-commodity-info',
                query: { id }
              }
            }
          ]
          if (res.info.order_status === 4 || res.info.order_status === 5) {
            tabs.push({
              label: '退款信息',
              route: {
                name: 'shop-finance-order-info-refund-info',
                query: { id }
              }
            })
          }
          if (res.info.product_type === 12) {
            tabs.push({
              label: '配送方式',
              route: {
                name: 'shop-finance-order-info-delivery-mode',
                query: { id }
              }
            })
          }
          return tabs
        })
      })
    )
  }
  beforeEach(to: ServiceRoute) {
    return this.getInfo(to.meta.query.id)
  }
}
