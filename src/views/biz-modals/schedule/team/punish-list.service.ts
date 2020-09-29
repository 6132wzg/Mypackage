import { Injectable, Controller } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import {
  TeamSchedulePunishApi,
  GetListQuery
} from '@/api/v1/schedule/team/punish'

@Injectable()
export class PunishListService {
  list$ = new State([])
  page$ = new State({
    current_page: 1,
    size: 10
  })
  loading$ = new State({})
  constructor(private punishApi: TeamSchedulePunishApi) {}
  @Effect()
  getList(query: GetListQuery) {
    return this.punishApi.getList(query).pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  delPunishment(id: number) {
    return this.punishApi.delPunishment(id)
  }
}
