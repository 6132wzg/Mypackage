import { Injectable, Controller, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { AuthService } from '@/services/auth.service'
import {
  ActivityQrcodeApi,
  GetActivityQrcodeListQuery
} from '@/api/v1/marketing/activity-qrcode'
import { tap, throttleTime } from 'rxjs/operators'

@Injectable()
export class ListService implements Controller {
  list$ = new State([])
  info$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  auth$ = this.authService.authMap$({
    page: 'brand:promote:qrcode|page'
  })
  constructor(
    private activityQrcodeApi: ActivityQrcodeApi,
    private authService: AuthService
  ) {}
  @Effect()
  getList(params: GetActivityQrcodeListQuery) {
    return this.activityQrcodeApi.getList(params).pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  @Effect()
  getInfo(id: number) {
    return this.activityQrcodeApi.getInfo(id).pipe(
      tap((res: any) => {
        this.info$.commit(() => res.info)
      })
    )
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return this.getList(to.meta.query)
  }
}
