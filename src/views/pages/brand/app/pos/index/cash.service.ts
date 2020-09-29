import { PluginPosApi } from '@/api/v1/applications/pos'
import { ShopApi } from '@/api/v1/shop'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { forkJoin } from 'rxjs'
import { Injectable, ServiceRoute } from 'vue-service-app'
@Injectable()
export class CashService {
  loading$ = new State({})
  list$ = new State([])
  page$ = new State({})
  total$ = new State({})
  shopList$ = new State([])
  constructor(private pluginPosApi: PluginPosApi, private shopApi: ShopApi) {}
  @Effect()
  getPosFinanceTotal(query: any) {
    return this.pluginPosApi.getPosFinanceTotal(query).pipe(
      tap((res: any) => {
        this.total$.commit(() => res.info)
      })
    )
  }
  @Effect()
  getPosFinanceList(query: any) {
    return this.pluginPosApi.getPosFinanceList(query).pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  @Effect()
  getShopList() {
    return this.shopApi.getShopListForSelect().pipe(
      tap((res: any) => {
        this.shopList$.commit(() => res.shops)
      })
    )
  }
  init(query) {
    return forkJoin(
      this.getShopList(),
      this.getPosFinanceList(query),
      this.getPosFinanceTotal(query)
    )
  }
  beforeEach(to: ServiceRoute) {
    return this.init(to.meta.query)
  }
}
