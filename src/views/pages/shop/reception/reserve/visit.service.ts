import { ReserveApi, GetListInput } from '@/api/v1/front/reserve'
import { Controller, ServiceRoute, Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { forkJoin } from 'rxjs'
import { MessageService } from '@/services/message.service'

@Injectable()
export class VisitService implements Controller {
  loading$ = new State({})
  page$ = new State({})
  list$ = new State([])

  constructor(private api: ReserveApi, private msg: MessageService) {}

  @Effect()
  getList(params: GetListInput) {
    return this.api.getList(params).pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  confirmVisitReserve(id: number) {
    return this.api.confirmVisitReserve(id).pipe(
      tap(res => {
        this.msg.success({ content: '确认到访成功' })
      })
    )
  }
  cancelVisitReserve(id: number) {
    return this.api.cancelVisitReserve(id).pipe(
      tap(res => {
        this.msg.success({ content: '取消到访预约成功' })
      })
    )
  }
  init(query: any) {
    return forkJoin([this.getList(query)])
  }
  beforeEach(to: ServiceRoute) {
    return this.init(to.meta.query)
  }
}
