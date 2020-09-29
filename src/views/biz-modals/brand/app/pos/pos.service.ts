import { PluginPosApi } from '@/api/v1/applications/pos'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { ShopApi } from '@/api/v1/shop'
import { Injectable } from 'vue-service-app'
import { forkJoin } from 'rxjs'
@Injectable()
export class PluginPosService {
  loading$ = new State({})
  info$ = new State({})
  shopList$ = new State([])
  deviceList$ = new State([])
  constructor(private pluginPosApi: PluginPosApi, private shopApi: ShopApi) {}
  @Effect()
  addPos(params: any) {
    return this.pluginPosApi.addPos(params)
  }
  @Effect()
  editPos(params: any) {
    return this.pluginPosApi.editPos(params)
  }
  @Effect()
  getEnablePosDeviceList(params: any) {
    return this.pluginPosApi.getEnablePosDeviceList(params).pipe(
      tap((res: any) => {
        this.deviceList$.commit(() => res.list)
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
  getPosInfo(query: any) {
    return this.pluginPosApi.getPosInfo(query).pipe(
      tap((res: any) => {
        this.info$.commit(() => res.info)
      })
    )
  }
  init() {
    return forkJoin(this.getShopList())
  }
}
