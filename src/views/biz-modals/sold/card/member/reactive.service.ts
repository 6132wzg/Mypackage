import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { CardApi } from '@/api/v1/sold/cards'
import { tap } from 'rxjs/operators'

@Injectable()
export class ReactiveService {
  loading$ = new State({})
  cardInfo$ = new State(0)
  constructor(private cardApi: CardApi) {}
  getReactiveInfo(params: any) {
    return this.cardApi.getReactiveInfo(params).pipe(
      tap((res: any) => {
        this.cardInfo$.commit(() => res.info)
      })
    )
  }
  @Effect()
  setReactive(params: any) {
    return this.cardApi.setReactive(params)
  }
}
