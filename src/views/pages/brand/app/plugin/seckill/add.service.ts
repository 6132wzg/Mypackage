import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { SeckillApi, EditSeckill } from '@/api/v1/app/plugin/seckill'
import { AuthService } from '@/services/auth.service'

@Injectable()
export class AddService {
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
  addSeckill(query: EditSeckill) {
    return this.api.addSeckill(query)
  }
}
