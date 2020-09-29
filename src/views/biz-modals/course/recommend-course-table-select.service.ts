import { UserService } from '@/services/user.service'
import { Injectable, ServiceRoute } from 'vue-service-app'
import { SettingMinaApi } from '@/api/v1/setting/mina'
import { Effect, State } from 'rx-state'
import { then } from '@/operators'

@Injectable()
export class RecommendCourseTableSelectService {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  constructor(private api: SettingMinaApi, private userService: UserService) {}
  RESET_LIST() {
    this.list$.commit(() => [])
  }

  @Effect()
  getPersonalCourseList(params: any) {
    return this.api.getPersonalCourseList(params).pipe(
      then((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  @Effect()
  getSmallCourseList(params: any) {
    return this.api.getSmallCourseList(params).pipe(
      then((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  @Effect()
  getTeamCourseList(params: any) {
    return this.api.getTeamCourseList(params).pipe(
      then((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
}
