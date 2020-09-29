import { ServiceRoute } from 'vue-service-app'
import { Injectable } from 'vue-service-app'
import { AuthService } from '@/services/auth.service'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { MarketingApi } from '@/api/v1/marketing/marketing'
import { PluginService } from '@/services/plugin.service'
@Injectable()
export class IndexService {
  authTabs$ = this.authService.getAuthTabs$('brand-app-pos-index')
  info$ = new State({})
  constructor(
    private authService: AuthService,
    private marketingApi: MarketingApi,
    private pluginService: PluginService
  ) {}
  @Effect()
  getPluginInfo(plugin_sn: string) {
    return this.marketingApi.getPluginInfo(plugin_sn).pipe(
      tap((res: any) => {
        this.info$.commit(() => res)
      })
    )
  }
  beforeEach(to: ServiceRoute) {
    const pluginSn = this.pluginService
      .getPluginSnByPathName('brand-app-pos-index')
      .snapshot()
    return this.getPluginInfo(pluginSn)
  }
}
