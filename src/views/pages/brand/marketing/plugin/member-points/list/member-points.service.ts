import { State } from 'rx-state'
import { Controller, ServiceRoute, Injectable } from 'vue-service-app'
import { tap } from 'rxjs/operators'
import { PointsApi } from '@/api/v1/marketing/points'
import { AuthService } from '@/services/auth.service'
@Injectable()
export class MemberPointsService implements Controller {
  total$: State<object> = new State({})
  page$: State<object> = new State({})
  list$: State<object[]> = new State([])
  auth$ = this.authService.authMap$({
    batch_add: 'brand:activity:points|batch_add',
    batch_reduce: 'brand:activity:points|batch_reduce'
  })
  constructor(private pointsApi: PointsApi, private authService: AuthService) {}
  getList(query: any) {
    return this.pointsApi.getPointsMemberList(query).pipe(
      tap(res => {
        this.list$.commit(() => {
          return res.list
        })
        this.page$.commit(() => {
          return res.page
        })
        this.total$.commit(() => {
          return res.info
        })
      })
    )
  }
  beforeEach(to: ServiceRoute, form: ServiceRoute) {
    return this.getList(to.meta.query)
  }
}
