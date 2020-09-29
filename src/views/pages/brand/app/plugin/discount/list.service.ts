import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { UserService } from '@/services/user.service'
import { AuthService } from '@/services/auth.service'
import { anyAll } from '@/operators'
import { DiscountApi, EditDiscount } from '@/api/v1/app/plugin/discount'
import { MarketingApi } from '@/api/v1/marketing/marketing'
import { PluginService } from '@/services/plugin.service'

@Injectable()
export class ListService {
  loading$ = new State({})
  info$ = new State({})
  list$ = new State([])
  page$ = new State({})
  courseList$ = new State([])
  courseListPage$ = new State({})
  categoryList$ = new State([])
  productType$ = this.userService.getOptions$(
    'limited_time_discount.product_type',
    { addAll: '全部商品类型' }
  )
  activityStatus$ = this.userService.getOptions$(
    'limited_time_discount.activity_status',
    { addAll: '全部活动状态' }
  )
  auth$ = this.authService.authMap$({
    add: 'brand:activity:limit_time_discount|add'
  })
  constructor(
    private api: DiscountApi,
    private userService: UserService,
    private authService: AuthService,
    private marketingApi: MarketingApi,
    private pluginService: PluginService
  ) {}
  // 列表
  @Effect()
  getList(query: EditDiscount) {
    return this.api.getDiscountList(query).pipe(
      tap(res => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  stopDiscount(id: any) {
    return this.api.stopDiscount(id)
  }
  deleteDiscount(id: any) {
    return this.api.deleteDiscount(id)
  }
  @Effect()
  getPluginInfo(plugin_sn: string) {
    return this.marketingApi.getPluginInfo(plugin_sn).pipe(
      tap((res: any) => {
        this.info$.commit(() => res)
      })
    )
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    console.log(to.meta.query)
    const pluginSn = this.pluginService
      .getPluginSnByPathName('brand-app-plugin-discount-list')
      .snapshot()
    return anyAll(this.getPluginInfo(pluginSn), this.getList(to.meta.query))
  }
}
