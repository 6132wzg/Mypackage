import { Injectable } from 'vue-service-app'
import { MarketingApi } from '@/api/v1/marketing/marketing'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { PluginService } from '@/services/plugin.service'
@Injectable()
export class InfoService {
  loading$ = new State({})
  info$ = new State({})
  constructor(
    private marketingApi: MarketingApi,
    private pluginService: PluginService
  ) {}
  @Effect()
  getPluginInfo() {
    const pluginSn = this.pluginService
      .getPluginSnByPathName('brand-app-training-book-info')
      .snapshot()
    return this.marketingApi.getPluginInfo(pluginSn).pipe(
      tap((res: any) => {
        this.info$.commit(() => res)
      })
    )
  }
}
