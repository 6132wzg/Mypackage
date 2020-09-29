import { Injectable, ServiceRoute, Controller } from 'vue-service-app'
import { CenterAppletApi, QrcodeQuery } from '@/api/v1/plugin/center_applet'
import { forkJoin } from 'rxjs'
import { tap } from 'rxjs/operators'
import { State, Effect } from 'rx-state'

@Injectable()
export class MinaService {
  info$ = new State({})
  loading$ = new State({})
  constructor(private centerAppletApi: CenterAppletApi) {}
  @Effect()
  getQrcode(query: QrcodeQuery) {
    return this.centerAppletApi.getQrcode(query).pipe(
      tap((res: any) => {
        this.info$.commit(() => res.info)
      })
    )
  }
}
