import { Injectable, ServiceRoute, Controller } from 'vue-service-app'
import { CenterAppletApi } from '@/api/v1/plugin/center_applet'
import { tap } from 'rxjs/operators'
import { State, Effect } from 'rx-state'

@Injectable()
export class MinaProtocolService {
  info$ = new State({})
  loading$ = new State({})
  constructor(private centerAppletApi: CenterAppletApi) {}
  @Effect()
  agree() {
    return this.centerAppletApi.agree().pipe(tap((res: any) => {}))
  }
}
