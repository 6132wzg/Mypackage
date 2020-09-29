import { UserService } from '@/services/user.service'
import { State } from 'rx-state'
import { Controller, ServiceRoute, Injectable } from 'vue-service-app'
import { tap } from 'rxjs/operators'
import { PointsApi } from '@/api/v1/marketing/points'
@Injectable()
export class FlowRecordService implements Controller {
  total$: State<object> = new State({})
  page$: State<object> = new State({})
  list$: State<object[]> = new State([])
  sourceTypeOptions$ = this.userService.getOptions$(
    'plugin_points.source_type',
    { addAll: '全部积分' }
  )
  constructor(private pointsApi: PointsApi, private userService: UserService) {}
  getList(query: any) {
    return this.pointsApi.getPointsDetailsList(query).pipe(
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
