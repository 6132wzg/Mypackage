import { Injectable, Controller } from 'vue-service-app'
import { FrontApi } from '@/api/v1/front'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { forkJoin } from 'rxjs'
import { AuthService } from '@/services/auth.service'
@Injectable()
export class TodoListService implements Controller {
  workNoteList$ = new State([])
  workNoteDoneList$ = new State([])
  loading$ = new State({})
  auth$ = this.authService.authMap$({
    addTodo: 'shop:front_end:todo|add'
  })
  constructor(private authService: AuthService, private frontApi: FrontApi) {}
  // 完成待办
  setWorkNote(id: string) {
    return this.frontApi.setWorkNote(id)
  }
  // 获取待办列表
  @Effect()
  getWorkNoteList() {
    return this.frontApi.getWorkNoteList().pipe(
      tap((res: any) => {
        this.workNoteList$.commit(() => res.list)
      })
    )
  }
  // 获取已完成待办列表
  @Effect()
  getWorkNoteDoneList() {
    return this.frontApi.getWorkNoteDoneList().pipe(
      tap((res: any) => {
        this.workNoteDoneList$.commit(() => res.list)
      })
    )
  }
  init() {
    return forkJoin(this.getWorkNoteList(), this.getWorkNoteDoneList())
  }
  beforeEach() {
    return this.init()
  }
}
