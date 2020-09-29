import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { RevenueApi, RevenueDataParams } from '@/api/v1/stat/brand/revenue'
import { CommonApi } from '@/api/v1/stat/common/common.ts'
import { AuthService } from '@/services/auth.service'
import { anyAll } from '@/operators'

@Injectable()
export class GatherService {
  loading$ = new State({})
  dataToday$ = new State({})
  list$ = new State([])
  total$ = new State({})
  updateTime$ = new State(Date.now())

  auth$ = this.authService.authMap$({
    export: 'brand:stat:revenue|product_type_export'
  })
  constructor(
    private revenueApi: RevenueApi,
    private authService: AuthService,
    private commonApi: CommonApi
  ) {}
  // 列表
  @Effect()
  getList(query: RevenueDataParams) {
    return this.revenueApi.getData(query).pipe(
      tap(res => {
        this.list$.commit(() => res.list)
        res.last_update_time &&
          this.updateTime$.commit(() => res.last_update_time)
      })
    )
  }
  getDataTotal(query: RevenueDataParams) {
    return this.revenueApi.getDataTotal(query).pipe(
      tap(res => {
        this.total$.commit(() => res.info)
        res.last_update_time &&
          this.updateTime$.commit(() => res.last_update_time)
      })
    )
  }
  // 获取今日实时数据
  getDataToday(query: RevenueDataParams) {
    return this.revenueApi.getDataToady(query).pipe(
      tap(res => {
        this.dataToday$.commit(() => res.info)
      })
    )
  }
  getDataRefresh() {
    return this.commonApi.getRevenueGatherRefresh().pipe(
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
