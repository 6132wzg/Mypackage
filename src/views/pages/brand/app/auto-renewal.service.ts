import { Injectable, ServiceRoute } from 'vue-service-app'
import { AuthService } from '@/services/auth.service'
import { ApplicationApi, GetProductListInput } from '@/api/v1/applications'
import { MarketingApi } from '@/api/v1/marketing/marketing'
import { State, Effect } from 'rx-state'
import { forkJoin } from 'rxjs'
import { tap } from 'rxjs/operators'
import { PluginService } from '@/services/plugin.service'

@Injectable()
export class AutoRenewalService {
  auth$ = this.authService.authMap$({
    newAdd: 'brand:application:auto_renewal|add'
  })
  loading$ = new State({})
  list$ = new State([])
  page$ = new State({})
  info$ = new State({})
  constructor(
    private authService: AuthService,
    private applicationApi: ApplicationApi,
    private marketingApi: MarketingApi,
    private pluginService: PluginService
  ) {}
  @Effect()
  getList(query: GetProductListInput) {
    return this.applicationApi.getProductList(query).pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  productPutaway(id: number) {
    return this.applicationApi.productPutaway(id)
  }
  productSoldOut(id: number) {
    return this.applicationApi.productSoldOut(id)
  }
  productDel(id: number) {
    return this.applicationApi.productDel(id)
  }
  @Effect()
  getPluginInfo() {
    const pluginSn = this.pluginService
      .getPluginSnByPathName('brand-app-auto-renewal')
      .snapshot()
    return this.marketingApi.getPluginInfo(pluginSn).pipe(
      tap((res: any) => {
        this.info$.commit(() => res)
      })
    )
  }
  init(query: any) {
    return forkJoin(this.getPluginInfo(), this.getList(query))
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    console.log('query', to.query)
    console.log('meta query', to.meta.query)
    return this.init(to.meta.query)
  }
}
