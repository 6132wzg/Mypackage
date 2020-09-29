import { Injectable } from 'vue-service-app'
import { State, Effect, Action } from 'rx-state'
import { OrderApi, OrderDescription } from '@/api/v1/finance/order'
import { tap } from 'rxjs/operators'

@Injectable()
export class InternalNoteService {
  loading$ = new State({})
  list$ = new State({})
  constructor(private orderApi: OrderApi) {}
  getList(id: number) {
    return this.orderApi.getOrderDescription(id).pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
      })
    )
  }

  @Effect()
  addDescription(params: OrderDescription) {
    return this.orderApi.addOrderDescription(params)
  }
}
