import { Injectable, Controller, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { CenterAppletApi, QrcodeQuery } from '@/api/v1/plugin/center_applet'
import { tap } from 'rxjs/operators'
import { AuthService } from '@/services/auth.service'

@Injectable()
export class ListService implements Controller {
  info$ = new State([])
  loading$ = new State({})
  // auth$ = this.authService.authMap$({
  //   // 记得设置鉴权
  //   add: 'brand:activity:group_buy|add'
  // })
  constructor(
    private centerAppletApi: CenterAppletApi,
    private authService: AuthService
  ) {}
  @Effect()
  getInfo() {
    return this.centerAppletApi.getInfo().pipe(
      tap((res: any) => {
        this.info$.commit(() => res.info)
      })
    )
  }
  getQrcode(query: QrcodeQuery) {
    return this.centerAppletApi.getQrcode(query).pipe(tap((res: any) => {}))
  }
  agree(query: any) {
    return this.centerAppletApi.agree().pipe(tap((res: any) => {}))
  }
  beforeRouteEnter(to: ServiceRoute, form: ServiceRoute) {
    return this.getInfo()
  }
}
