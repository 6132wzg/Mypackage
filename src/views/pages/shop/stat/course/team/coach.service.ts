import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { CourseApi, CourseDataParams } from '@/api/v1/stat/shop/course'
import { AuthService } from '@/services/auth.service'
import { anyAll } from '@/operators'

@Injectable()
export class CoachService {
  list$ = new State([])
  page$ = new State({})
  total$ = new State({})
  loading$ = new State({})
  auth$ = this.authService.authMap$({
    export: 'shop:stat:class_reports|team_coach_export'
  })
  constructor(private api: CourseApi, private authService: AuthService) {}
  // 列表
  @Effect()
  getList(query: CourseDataParams) {
    return this.api.getShopTeamCoachList(query).pipe(
      tap(res => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  getTotal(query: CourseDataParams) {
    return this.api.getShopTeamCoachTotal(query).pipe(
      tap(res => {
        this.total$.commit(() => res.info)
      })
    )
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return anyAll(this.getList(to.meta.query), this.getTotal(to.meta.query))
  }
}
