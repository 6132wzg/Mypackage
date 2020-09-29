import { PluginPosApi } from '@/api/v1/applications/pos'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { forkJoin } from 'rxjs'
import { Injectable } from 'vue-service-app'
@Injectable()
export class DeviceService {
  list$ = new State([])
  constructor(private pluginPosApi: PluginPosApi) {}
  @Effect()
  getDeviceList() {
    return this.pluginPosApi
      .getEnablePosDeviceList({
        status: 1
      })
      .pipe(
        tap((res: any) => {
          this.list$.commit(() => res.list)
        })
      )
  }
  init() {
    return forkJoin(this.getDeviceList())
  }
  beforeEach() {
    return this.init()
  }
}
