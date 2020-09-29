import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { OrderApi, OrderDataParams } from '@/api/v1/stat/shop/order.ts'

import { AuthService } from '@/services/auth.service'
@Injectable()
export class AnalyseService {
  loading$ = new State({})
  list$ = new State([])
  auth$ = this.authService.authMap$({
    export: 'shop:stat:order|analysis_export'
  })
  constructor(private orderApi: OrderApi, private authService: AuthService) {}
  // 列表
  @Effect()
  getList(query: OrderDataParams) {
    return this.orderApi.getAnalyseData(query).pipe(
      tap(res => {
        this.list$.commit(() => res.list)
      })
    )
  }

  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return this.getList(to.meta.query)
  }
}
