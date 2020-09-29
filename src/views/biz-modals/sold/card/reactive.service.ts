import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import {
  CardApi,
  GetRenewalTaskNumInput,
  TaskExtendDaysInput
} from '@/api/v1/sold/cards'
import { tap } from 'rxjs/operators'

@Injectable()
export class ReactiveService {
  loading$ = new State({})
  list_num$ = new State(0)
  constructor(private cardApi: CardApi) {}
  /**
   * 获取批量延期会员卡查询总数
   */
  getTaskReactiveNum(query: GetRenewalTaskNumInput) {
    return this.cardApi.getTaskReactiveNum(query).pipe(
      tap((res: any) => {
        this.list_num$.commit(() => res.info.count)
      })
    )
  }
  @Effect()
  taskReactive(params: TaskExtendDaysInput) {
    return this.cardApi.taskReactive(params)
  }
}
