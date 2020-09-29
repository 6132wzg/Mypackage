import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import {
  SoldPersonalCourseApi,
  UpdateRightsInput
} from '@/api/v1/sold/course/personal'
import { tap } from 'rxjs/operators'
import { UserService } from '@/services/user.service'

@Injectable()
export class UpdateRightsService {
  info$ = new State({})
  infoItems$ = new State([])
  loading$ = new State({})
  transferUnitOptions$ = this.userService.getOptions$(
    'personal_course.transfer_unit'
  )
  constructor(
    private courseApi: SoldPersonalCourseApi,
    private userService: UserService
  ) {}
  @Effect()
  getInfo(id: number) {
    return this.courseApi.getRightsInfo(id).pipe(
      tap((res: any) => {
        this.info$.commit(() => res)
      })
    )
  }
  @Effect()
  updateRights(id: number, params: UpdateRightsInput) {
    return this.courseApi.updateRights(id, params)
  }
}
