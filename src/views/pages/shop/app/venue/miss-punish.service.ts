import { Injectable, Controller, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import {
  VenueApi,
  GetPunishListParams,
  PunishCancelParams
} from '@/api/v1/venue'
import { tap } from 'rxjs/operators'
@Injectable()
export class MissPunishService implements Controller {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  constructor(private venueApi: VenueApi) {}
  @Effect()
  getList(query: GetPunishListParams) {
    return this.venueApi.getPunishList(query).pipe(
      tap(res => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  punishCancel(params: PunishCancelParams) {
    return this.venueApi.punishCancel(params)
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return this.getList(to.meta.query)
  }
}
