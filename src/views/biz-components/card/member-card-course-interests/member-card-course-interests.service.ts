import { UserService } from '@/services/user.service'
import { Injectable } from 'vue-service-app'
import { State, Effect, Action } from 'rx-state'
import { tap, debounceTime, switchMap, catchError } from 'rxjs/operators'
import { EMPTY } from 'rxjs'
import { CardsApi, CourseTeamShelfListInput } from '@/api/v1/cards'

@Injectable()
export class CourseIntersetsService {
  loading$ = new State({})
  types$ = this.userService.getOptions$('member_card.course_interests')
  courseList$ = new State([])
  courseListAction$: Action<any>
  constructor(private userService: UserService, private cardApi: CardsApi) {
    this.courseListAction$ = new Action(data$ => {
      return data$.pipe(
        debounceTime(200),
        switchMap((query: CourseTeamShelfListInput) =>
          this.getCourseList(query).pipe(catchError(() => EMPTY))
        ),
        tap(res => {
          this.courseList$.commit(() => res.list)
        })
      )
    })
  }
  @Effect()
  getCourseList(query: CourseTeamShelfListInput) {
    return this.cardApi.getCourseTeamShelfList(query, 'brand')
  }
}
