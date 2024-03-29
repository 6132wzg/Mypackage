import { Injectable, Controller, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { StoreApi } from '@/api/v1/shop/store/store'
@Injectable()
export class EditService implements Controller {
  loading$ = new State({})
  info$ = new State({})
  constructor(private StoreApi: StoreApi) {}
  @Effect()
  goodsDetail(id: number) {
    return this.StoreApi.goodsDetail(id).pipe(
      tap((res: any) => {
        this.info$.commit(() => res)
      })
    )
  }
  beforeRouteEnter(to: ServiceRoute) {
    if (to.meta.query.id) {
      return this.goodsDetail(to.meta.query.id)
    }
  }
}
