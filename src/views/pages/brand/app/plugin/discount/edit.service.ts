import { Injectable, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { AuthService } from '@/services/auth.service'
import { anyAll } from '@/operators'
import { DiscountApi, EditDiscount } from '@/api/v1/app/plugin/discount'

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
  constructor(private api: DiscountApi, private authService: AuthService) {}

  // 列表
  @Effect()
  getInfo(query: EditDiscount) {
    return this.api.getDiscountInfo(query).pipe(
      tap(res => {
        this.info$.commit(() => res.info)
      })
    )
  }

  @Effect()
  editDiscount(query: EditDiscount) {
    return this.api.editDiscount(query)
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return anyAll(this.getInfo(to.meta.query.id))
  }
}
