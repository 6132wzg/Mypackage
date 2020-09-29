import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { SettingMinaApi, ShopComponentList } from '@/api/v1/setting/mina'
import { ShopApi } from '@/api/v1/shop'
import { tap } from 'rxjs/operators'

@Injectable()
export class H5SettingIndexService {
  shopList$ = new State([]) // 门店列表
  currentShopInfo$ = new State({}) // 当前选择门店信息
  fnModules$ = new State([]) // 功能模块列表
  marketingModules$ = new State([]) // 营销模块列表
  modulesData$ = new State([]) // 门店已配置模块
  loading$ = new State({})

  constructor(
    private settingMinaApi: SettingMinaApi,
    private shopApi: ShopApi
  ) {}
  getShopList() {
    return this.shopApi.getShopList().pipe(
      tap((res: any) => {
        this.shopList$.commit(() => res.list)
      })
    )
  }
  @Effect()
  getShopModules(params: ShopComponentList) {
    return this.settingMinaApi.getShopComponentList(params).pipe(
      tap((res: any) => {
        const list = res.info.module_list
        this.modulesData$.commit(() => list)
      })
    )
  }
  getModules(shopId) {
    return this.settingMinaApi
      .getComponentList({ shop_id: shopId, tab_type: '1' })
      .pipe(
        tap(res => {
          this.fnModules$.commit(() => res.functions)
          this.marketingModules$.commit(() => res.plugins)
        })
      )
  }
  getShopInfo(id) {
    return this.shopApi.getInfo(id).pipe(
      tap((res: any) => {
        this.currentShopInfo$.commit(() => res.info)
      })
    )
  }
  getPathList() {
    return this.settingMinaApi.getLinkPathList()
  }
  @Effect()
  saveIndexConfig(data) {
    return this.settingMinaApi.postShopComponentList({ info: data })
  }
}
