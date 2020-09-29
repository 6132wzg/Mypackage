import { Injectable } from 'vue-service-app'
import { CourseApi, EditCoursePersonalCoachInput } from '@/api/v1/sold/course'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { UserService } from '@/services/user.service'
import { TransactionApi } from '@/api/v1/sold/transaction'

@Injectable()
export class CoachService {
  loading$ = new State({})
  info$ = new State({})
  coachList$ = new State({})
  coachTypeOptions$ = this.userService.getOptions$('personal_course.coach_type')
  constructor(
    private transactionApi: TransactionApi,
    private courseApi: CourseApi,
    private userService: UserService
  ) {}
  @Effect()
  getInfo(id) {
    return this.courseApi.getSoldCoursePersonalInfo(id).pipe(
      tap((res: any) => {
        this.info$.commit(() => res)
      })
    )
  }
  @Effect()
  getCoachList(coachLevelId: number, courseId: string) {
    return this.transactionApi
      .getTransactionCoachList(coachLevelId, courseId)
      .pipe(
        tap((res: any) => {
          this.coachList$.commit(() => res.list)
        })
      )
  }
  @Effect()
  edit(params: EditCoursePersonalCoachInput, id: string) {
    return this.courseApi.editCoursePersonalCoach(params, id)
  }
}
