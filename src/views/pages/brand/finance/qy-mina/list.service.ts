import { Injectable, ServiceRoute, Controller } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { StatApi, RevenueShopListQuery } from '@/api/v1/stat/shop'
import { UserService } from '@/services/user.service'
import { AuthService } from '@/services/auth.service'
@Injectable()
export class ListService implements Controller {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  todayInfo$ = new State([])
  total$ = new State({})
  auth$ = this.authService.authMap$({
    export: 'brand_shop:stat:revenue_reports|batch_export'
  })
  authTabs$ = this.authService.getAuthTabs$('brand-finance-qy-mina-list')
  constructor(
    private StatApi: StatApi,
    private authService: AuthService,
    private userService: UserService
  ) {}
  @Effect()
  getRevenueShopList(query: RevenueShopListQuery) {
    return this.StatApi.getRevenueShopList(query).pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
        this.total$.commit(() => res.total)
      })
    )
  }
  getRevenueShopToday(query: any) {
    return this.StatApi.getRevenueShopToday(query).pipe(tap((res: any) => {}))
  }
  beforeEach(to: ServiceRoute, form: ServiceRoute) {
    // return this.getRevenueShopList(to.meta.query)
  }
}
