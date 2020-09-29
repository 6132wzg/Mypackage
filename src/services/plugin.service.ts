import { Injectable, Dictionary } from 'vue-service-app'
import { State, Computed } from 'rx-state'
import { tap, map } from 'rxjs/operators'
import { MarketingApi } from '@/api/v1/marketing/marketing'

@Injectable()
export class PluginService {
  plugin$ = new State<Array<any>>([])
  constructor(private marketingApi: MarketingApi) {}
  fetchList() {
    return this.marketingApi.getPluginSnList().pipe(
      tap((res: any) => {
        this.plugin$.commit(() => res.list)
      })
    )
  }
  /**
   * 通过插件 Path Name 获取sn
   * @param pathName 插件Path Name
   */
  getPluginSnByPathName(pathName: string) {
    return new Computed(
      this.plugin$.pipe(
        map(list => {
          const item = list.filter(item => item.redrect_url === pathName)[0]
          return item ? item.plugin_sn : ''
        })
      )
    )
  }
}
