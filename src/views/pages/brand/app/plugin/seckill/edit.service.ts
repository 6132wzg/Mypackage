import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { AuthService } from '@/services/auth.service'
import { anyAll } from '@/operators'
import { SeckillApi, EditSeckill } from '@/api/v1/app/plugin/seckill'

@Injectable()
export class EditService {
  loading$ = new State({})
  info$ = new State({})
  courseList$ = new State([])
  courseListPage$ = new State({})
  categoryList$ = new State([])
  auth$ = this.authService.authMap$({
    export: 'brand:stat:course|personal_course_export'
  })
  constructor(private api: SeckillApi, private authService: AuthService) {}

  // 列表
  @Effect()
  getInfo(query: EditSeckill) {
    return this.api.getSeckillInfo(query).pipe(
      tap(res => {
        this.info$.commit(() => res.info)
      })
    )
  }
  @Effect()
  editSeckill(query: EditSeckill) {
    return this.api.editSeckill(query)
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return anyAll(this.getInfo(to.meta.query.id))
  }
}
