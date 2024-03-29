import { Injectable, Controller, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state'
// import { AuthService } from '@/services/auth.service'
import { GroupBuyApi, EditParams } from '@/api/v1/marketing/group-buy'
import { tap } from 'rxjs/operators'
import { anyAll } from '@/operators'

@Injectable()
export class EditDepositService implements Controller {
  loading$ = new State({})
  info$ = new State({})
  list$ = new State({})
  constructor(private groupBuyApi: GroupBuyApi) {}
  getStoredData(id: number) {
    return this.groupBuyApi.getStoredData(id).pipe(
      tap((res: any) => {
        this.info$.commit(() => res.info)
      })
    )
  }
  getDepositList() {
    return this.groupBuyApi.getDepositList().pipe(
      tap((res: any) => {
        this.list$.commit(() => res)
      })
    )
  }
  editGroup(params: EditParams) {
    return this.groupBuyApi.editGroup(params)
  }
  @Effect()
  init(id: any) {
    return anyAll(this.getStoredData(id), this.getDepositList())
  }
  beforeRouteEnter(to: ServiceRoute, from: ServiceRoute) {
    return this.init(to.meta.query.id)
  }
}
