import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { DiscountApi, EditDiscount } from '@/api/v1/app/plugin/discount'
import { AuthService } from '@/services/auth.service'

@Injectable()
export class AddService {
  loading$ = new State({})
  info$ = new State({})
  courseList$ = new State([])
  courseListPage$ = new State({})
  categoryList$ = new State([])
  auth$ = this.authService.authMap$({
    add: 'brand:activity:limit_time_discount|add'
  })
  constructor(private api: DiscountApi, private authService: AuthService) {}

  // 列表
  @Effect()
  addDiscount(query: EditDiscount) {
    return this.api.addDiscount(query)
  }
}
