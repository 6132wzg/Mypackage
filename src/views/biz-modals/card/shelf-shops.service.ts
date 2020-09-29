import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { ShelfApi, GetShelfListInput } from '@/api/v1/cards/member/shelf'
import { tap } from 'rxjs/operators'
import { UserService } from '@/services/user.service'

@Injectable()
export class ShelfShopsService {
  loading$ = new State({})
  list$ = new State([])
  page$ = new State({})
  shelfStatusOptions$ = this.userService.getOptions$(
    'member_card.shelf_status',
    {
      addAll: '全部状态'
    }
  )
  constructor(private shelfApi: ShelfApi, private userService: UserService) {}
  @Effect()
  getList(id: number, query: GetShelfListInput) {
    return this.shelfApi.getShelfList(id, query).pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
}
