import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { CashierApi, CashierDataParams } from '@/api/v1/stat/brand/cashier'
import { AuthService } from '@/services/auth.service'
import { anyAll } from '@/operators'

@Injectable()
export class IncomeService {
  loading$ = new State({})
  dataToday$ = new State({})
  list$ = new State([])
  total$ = new State({})

  auth$ = this.authService.authMap$({
    export: 'brand:stat:cashier|collect_export'
  })
  constructor(
    private cashierApi: CashierApi,
    private authService: AuthService
  ) {}
  // 列表
  @Effect()
  getList(query: CashierDataParams) {
    return this.cashierApi.getData(query).pipe(
      tap(res => {
        this.list$.commit(() => res.list)
      })
    )
  }
  getDataTotal(query: CashierDataParams) {
    return this.cashierApi.getDataTotal(query).pipe(
      tap(res => {
        this.total$.commit(() => res.info)
      })
    )
  }
  // 获取今日实时数据
  getDataToday(query: CashierDataParams) {
    return this.cashierApi.getDataToady(query).pipe(
      tap(res => {
        this.dataToday$.commit(() => res.info)
      })
    )
  }

  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return anyAll(this.getList(to.meta.query), this.getDataTotal(to.meta.query))
  }
}
