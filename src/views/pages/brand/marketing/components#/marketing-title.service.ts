import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { MarketingApi } from '@/api/v1/marketing/marketing'
import { PluginService } from '@/services/plugin.service'
import { tap } from 'rxjs/operators'

@Injectable()
export class MarketingTitleService {
  info$ = new State({})
  loading$ = new State({})
  constructor(
    private marketingApi: MarketingApi,
    private pluginService: PluginService
  ) {}
  @Effect()
  getPluginInfo(pathName: string) {
    const pluginSn = this.pluginService
      .getPluginSnByPathName(pathName)
      .snapshot()

    return this.marketingApi.getPluginInfo(pluginSn).pipe(
      tap((res: any) => {
        this.info$.commit(() => res.info)
      })
    )
  }
}
