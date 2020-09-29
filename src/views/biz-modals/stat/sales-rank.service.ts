import { Injectable } from 'vue-service-app'
import { Effect, State } from 'rx-state'
import { tap } from 'rxjs/operators'
import { AuthService } from '@/services/auth.service'
import { SalesApi, SaleChartParams } from '@/api/v1/stat/brand/sales'

@Injectable()
export class SalesService {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  auth$ = this.authService.authMap$({
    export: 'shop:stat:saler_reports|export_day'
  })
  constructor(private salesApi: SalesApi, private authService: AuthService) {}

  @Effect()
  getSalesRank(query: SaleChartParams) {
    return this.salesApi.getSalesRank(query).pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
}
