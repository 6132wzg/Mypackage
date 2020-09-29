import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { CourseApi } from '@/api/v1/sold/course'
import { PackageApi } from '@/api/v1/course/package'
import { tap, map } from 'rxjs/operators'
import { UserService } from '@/services/user.service'

@Injectable()
export class UpdateRightsService {
  info$ = new State({})
  infoItems$ = new State([])
  loading$ = new State({})
  transferUnitOptions$ = this.userService.getOptions$(
    'package_course.transfer_unit'
  )
  reserveLimitDayOptions$ = this.userService.getOptions$(
    'package_course.reserve_limit_day'
  )
  reserveIsLimitNewOptions$ = this.userService.getOptions$(
    'package_course.reserve_is_limit_new'
  )
  supportMemberNumOptions$ = this.userService.getOptions$(
    'member_card.support_member_num'
  )
  constructor(
    private courseApi: CourseApi,
    private packageApi: PackageApi,
    private userService: UserService
  ) {}
  @Effect()
  getInfo(id: number, isSync) {
    const api = isSync ? this.packageApi : this.courseApi
    return api.getRight(id).pipe(
      tap((res: any) => {
        this.info$.commit(() => res.info)
      })
    )
  }
  @Effect()
  updateRights(params, isSync) {
    if (isSync) {
      return this.packageApi.setRight(params)
    }
    return this.courseApi.setRight(params)
  }
}
