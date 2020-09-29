import { Injectable } from 'vue-service-app'
import { Effect, State } from 'rx-state'
import { tap } from 'rxjs/operators'
import { AuthService } from '@/services/auth.service'
import { CourseApi, FreeCoachParams } from '@/api/v1/stat/common/course'

@Injectable()
export class FreeCoachService {
  loading$ = new State({})
  list$ = new State([])
  page$ = new State({})
  auth$ = this.authService.authMap$({
    export: 'shop:stat:saler_reports|export_day'
  })
  constructor(private api: CourseApi, private authService: AuthService) {}

  @Effect()
  getFreeCoachList(query: FreeCoachParams, key) {
    this.list$.commit(() => [])
    return this.api.getCoachList(query, key).pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
}
