import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { UserService } from '@/services/user.service'
import { AuthService } from '@/services/auth.service'
import { anyAll } from '@/operators'
import { SeckillApi, EditSeckill } from '@/api/v1/app/plugin/seckill'
import { MarketingApi } from '@/api/v1/marketing/marketing'
import { PluginService } from '@/services/plugin.service'

@Injectable()
export class ListService {
  loading$ = new State({})
  info$ = new State({})
  list$ = new State([])
  page$ = new State({})
  productType$ = this.userService.getOptions$(
    'limited_time_discount.product_type',
    { addAll: '全部商品类型' }
  )
  activityStatus$ = this.userService.getOptions$(
    'limited_time_discount.activity_status',
    { addAll: '全部活动状态' }
  )
  auth$ = this.authService.authMap$({
    add: 'brand:activity:limit_time_spike|add'
  })
  constructor(
    private api: SeckillApi,
    private userService: UserService,
    private authService: AuthService,
    private marketingApi: MarketingApi,
    private pluginService: PluginService
  ) {}

  // 列表
  @Effect()
  getList(query: EditSeckill) {
    return this.api.getSeckillList(query).pipe(
      tap(res => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  stopSeckill(id: any) {
    return this.api.stopSeckill(id)
  }
  deleteSeckill(id: any) {
    return this.api.deleteSeckill(id)
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
    const pluginSn = this.pluginService
      .getPluginSnByPathName('brand-app-plugin-seckill-list')
      .snapshot()
    console.log(to.meta.query)
    return anyAll(this.getPluginInfo(pluginSn), this.getList(to.meta.query))
  }
}
