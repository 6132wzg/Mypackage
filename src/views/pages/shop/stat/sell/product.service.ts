import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { SalesApi, SaleDataParams } from '@/api/v1/stat/shop/sales.ts'
import { CommonApi } from '@/api/v1/stat/common/common.ts'

import { AuthService } from '@/services/auth.service'
import { anyAll } from '@/operators'
import { UserService } from '@/services/user.service'
@Injectable()
export class ProductService {
  loading$ = new State({})
  list$ = new State([])
  page$ = new State({})
  total$ = new State({})
  updateTime$ = new State(Date.now())

  contractType$ = this.userService.getOptions$('report.report_contract_type')
  productType$ = this.userService.getOptions$(
    'report.report_product_performance'
  )
  auth$ = this.authService.authMap$({
    export: 'shop:stat:sales:summary|export_product'
  })
  constructor(
    private salesApi: SalesApi,
    private userService: UserService,
    private authService: AuthService,
    private commonApi: CommonApi
  ) {}
  // 列表
  @Effect()
  getList(query: SaleDataParams) {
    return this.salesApi.getProductData(query).pipe(
      tap(res => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
        res.last_update_time &&
          this.updateTime$.commit(() => res.last_update_time)
      })
    )
  }
  getDataTotal(query: SaleDataParams) {
    return this.salesApi.getProductDataTotal(query).pipe(
      tap(res => {
        this.total$.commit(() => res.info)
        res.last_update_time &&
          this.updateTime$.commit(() => res.last_update_time)
      })
    )
  }
  getDataRefresh() {
    return this.commonApi.getProductPerformanceRefresh().pipe(
      tap(res => {
        res.last_update_time &&
          this.updateTime$.commit(() => res.last_update_time)
      })
    )
  }

  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return anyAll(this.getList(to.meta.query), this.getDataTotal(to.meta.query))
  }
}
