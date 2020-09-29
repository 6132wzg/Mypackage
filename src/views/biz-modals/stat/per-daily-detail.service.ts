import { Injectable } from 'vue-service-app'
import { Effect, State } from 'rx-state'
import { tap } from 'rxjs/operators'
import { AuthService } from '@/services/auth.service'
import { OrdersApi, OrdersDataParams } from '@/api/v1/stat/common/orders'

@Injectable()
export class PerDailyService {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  auth$ = this.authService.authMap$({
    export: 'shop:stat:saler_reports|export_day'
  })
  constructor(private ordersApi: OrdersApi, private authService: AuthService) {}

  @Effect()
  getRevenueList(query: OrdersDataParams, type: string) {
    this.list$.commit(() => [])
    return this.ordersApi.getPerOrderList(query, type).pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
}
