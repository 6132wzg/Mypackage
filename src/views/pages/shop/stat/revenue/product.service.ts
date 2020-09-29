import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { RevenueApi, RevenueDataParams } from '@/api/v1/stat/shop/revenue'
import { CommonApi } from '@/api/v1/stat/common/common.ts'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'
import { anyAll } from '@/operators'

@Injectable()
export class ProductService {
  loading$ = new State({})
  dataToday$ = new State({})
  list$ = new State([])
  page$ = new State({})
  total$ = new State({})
  updateTime$ = new State(Date.now())
  productType$ = this.userService.getOptions$('report.revenue_product_type')
  auth$ = this.authService.authMap$({
    export: 'shop:stat:revenue|product_export'
  })
  constructor(
    private revenueApi: RevenueApi,
    private authService: AuthService,
    private userService: UserService,
    private commonApi: CommonApi
  ) {}
  // 列表
  @Effect()
  getList(query: RevenueDataParams) {
    return this.revenueApi.getProductData(query).pipe(
      tap(res => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
        res.last_update_time &&
          this.updateTime$.commit(() => res.last_update_time)
      })
    )
  }
  getDataTotal(query: RevenueDataParams) {
    return this.revenueApi.getProductDataTotal(query).pipe(
      tap(res => {
        this.total$.commit(() => res.info)
        res.last_update_time &&
          this.updateTime$.commit(() => res.last_update_time)
      })
    )
  }
  // 获取今日实时数据
  getDataToday(query: RevenueDataParams) {
    return this.revenueApi.getProductDataToady(query).pipe(
      tap(res => {
        this.dataToday$.commit(() => res.info)
      })
    )
  }
  getDataRefresh() {
    return this.commonApi.getShopRevenueProductRefresh().pipe(
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
