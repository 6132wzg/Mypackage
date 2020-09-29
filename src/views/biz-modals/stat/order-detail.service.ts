import { Injectable } from 'vue-service-app'
import { Effect, State } from 'rx-state'
import { tap } from 'rxjs/operators'
import { AuthService } from '@/services/auth.service'
// import { StatApi } from '@/api/v1/stat/shop'
import { OrdersApi, OrdersDataParams } from '@/api/v1/stat/common/orders'
import { UserService } from '@/services/user.service'

@Injectable()
export class OrderService {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  auth$ = this.authService.authMap$({
    brandExport: 'brand:stat:revenue|order_export',
    shopExport: 'shop:stat:revenue|order_export'
  })
  orderStatus$ = this.userService.getEnumValue$('finance.order_status')
  productType$ = this.userService.getEnumValue$('report.revenue_product_type')
  refundReason$ = this.userService.getEnumValue$('report.report_refund_reason')

  constructor(
    private ordersApi: OrdersApi,
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Effect()
  getOrderList(query: OrdersDataParams, type: string) {
    this.list$.commit(() => [])
    return this.ordersApi.getOrderList(query, type).pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
}
