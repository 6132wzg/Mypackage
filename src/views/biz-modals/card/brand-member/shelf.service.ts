import { UserService } from '@/services/user.service'
import { Injectable } from 'vue-service-app'
import { State, Effect, Action } from 'rx-state'
import {
  CardsApi,
  CourseTeamShelfListInput,
  GetCardShelfInfoInput,
  UpdateCardShelfInput
} from '@/api/v1/cards'
import { tap, debounceTime, switchMap, catchError } from 'rxjs/operators'
import { EMPTY } from 'rxjs'

@Injectable()
export class ShelfService {
  info$ = new State({})
  /**
   * 变更上架回显
   */
  shelfCardDetail$ = new State({})
  loading$ = new State({})
  courseListAction$: Action<any>
  courseList$ = new State([])
  course_interests$ = this.userService.getOptions$(
    'member_card.course_interests'
  )
  activateTypes$ = this.userService.getOptions$('member_card.activate_type')
  constructor(private cardApi: CardsApi, private userService: UserService) {
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
  getInfo(id: string, query: GetCardShelfInfoInput) {
    return this.cardApi.getCardShelfInfo(id, 'brand', 'member', query).pipe(
      tap((res: any) => {
        this.info$.commit(() => res.info)
        this.shelfCardDetail$.commit(() => res.shelf_card_detail)
      })
    )
  }
  @Effect()
  getCourseList(query: CourseTeamShelfListInput) {
    return this.cardApi.getCourseTeamShelfList(query, 'brand')
  }
  resetCourseList() {
    this.courseList$.commit(() => [])
  }
  @Effect()
  shelfCard(params: any, id: string) {
    return this.cardApi.setCardShelf(params, id, 'brand', 'member')
  }
  @Effect()
  updateShelf(id: number, params: UpdateCardShelfInput) {
    return this.cardApi.updateCardShelf(id, params, 'brand')
  }
}
