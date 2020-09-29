import { Injectable } from 'vue-service-app'
import { Effect, State } from 'rx-state'
import { tap } from 'rxjs/operators'
import { AuthService } from '@/services/auth.service'
import { CashierApi, CashierDataParams } from '@/api/v1/stat/common/cashier'

@Injectable()
export class CashierDailyService {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  auth$ = this.authService.authMap$({
    export: 'shop:stat:saler_reports|export_day'
  })
  constructor(
    private cashierApi: CashierApi,
    private authService: AuthService
  ) {}

  @Effect()
  getRevenueList(query: CashierDataParams, type: string) {
    this.list$.commit(() => [])
    return this.cashierApi.getCashierList(query, type).pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
}
