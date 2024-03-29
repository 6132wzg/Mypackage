import { Injectable, Controller, ServiceRoute } from 'vue-service-app'
import { ReserveApi } from '@/api/v1/front/reserve'
import { tap } from 'rxjs/operators'
import { State } from 'rx-state'

@Injectable()
export class PrintService implements Controller {
  info$ = new State({})
  constructor(private reserveApi: ReserveApi) {}
  getPrintInfo(id: any) {
    return this.reserveApi.getPrintInfo(id).pipe(
      tap(res => {
        this.info$.commit(() => res.info)
      })
    )
  }
  beforeRouteEnter(to: ServiceRoute, from: ServiceRoute) {
    return this.getPrintInfo(to.meta.query.id)
  }
}
