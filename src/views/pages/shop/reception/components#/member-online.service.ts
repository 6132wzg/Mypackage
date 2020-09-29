import { Injectable, Controller, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import {
  FrontApi,
  GetEntranceListInput,
  SetEntranceLeaveBatchInput
} from '@/api/v1/front'
import { tap } from 'rxjs/operators'
import { AuthService } from '@/services/auth.service'

@Injectable()
export class MemberOnlineService implements Controller {
  loading$ = new State({})
  finished$ = new State({})
  list$ = new State([])
  page$ = new State({})
  auth$ = this.authService.authMap$({
    checkout: 'shop:front_end:check_in_out|checkout',
    batchCheckout: 'shop:front_end:check_in_out|batch_checkout'
  })

  constructor(private authService: AuthService, private frontApi: FrontApi) {}
  @Effect()
  getList(query: GetEntranceListInput) {
    return this.frontApi.getEntranceList(query).pipe(
      tap((res: any) => {
        this.page$.commit(() => res.page)
        this.finished$.commit(() => {
          return res.page.current_page >= res.page.total_pages
        })
        this.list$.commit((preList: any) => {
          if (res.page.current_page === 1 || !res.page.current_page) {
            preList = []
          }
          return preList.concat(res.list)
        })
      })
    )
  }
  // 离场之前获取柜子信息进行判断是否是智能柜
  @Effect()
  getCabinetInfo(id: string) {
    return this.frontApi.getCabinetInfo(id)
  }
  // 单个离场
  setEntranceLeave(id: string) {
    return this.frontApi.setEntranceLeave(id)
  }
  // 批量离场
  setEntranceLeaveBatch(params: SetEntranceLeaveBatchInput) {
    return this.frontApi.setEntranceLeaveBatch(params)
  }
  beforeEach(to: ServiceRoute) {}
}
