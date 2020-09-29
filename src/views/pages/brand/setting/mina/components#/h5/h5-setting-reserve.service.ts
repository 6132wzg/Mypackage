import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import {
  SettingMinaApi,
  ShopComponentList,
  PostShopComponentList
} from '@/api/v1/setting/mina'
import { ShopApi } from '@/api/v1/shop'
import { tap, switchMap } from 'rxjs/operators'

@Injectable()
export class H5SettingReserveService {
  shopList$ = new State([]) // 门店列表
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
      }),
      switchMap((res: any) => {
        return this.getShopModules({
          shop_id: res.list[0].shop_id,
          tab_type: '2'
        })
      })
    )
  }
  @Effect()
  getShopModules(params: ShopComponentList) {
    return this.settingMinaApi.getShopComponentList(params).pipe(
      tap((res: any) => {
        const list = res.info.module_list
        list.forEach(i => {
          i.id = 'key_' + parseInt(`${Math.random() * 999999}`).toString()
        })
        this.modulesData$.commit(() => list)
      })
    )
  }
  @Effect()
  postShopModules(params: PostShopComponentList) {
    return this.settingMinaApi.postShopComponentList(params)
  }
}
