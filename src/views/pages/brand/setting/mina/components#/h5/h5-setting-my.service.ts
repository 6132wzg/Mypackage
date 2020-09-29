import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import {
  SettingMinaApi,
  ShopComponentList,
  PostShopComponentList
} from '@/api/v1/setting/mina'
import { tap, switchMap } from 'rxjs/operators'

@Injectable()
export class H5SettingMyService {
  modulesData$ = new State([]) // 门店已配置模块
  loading$ = new State({})
  constructor(private settingMinaApi: SettingMinaApi) {}
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
