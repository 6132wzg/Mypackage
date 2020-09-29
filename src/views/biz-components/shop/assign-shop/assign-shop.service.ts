import { UserService } from '@/services/user.service'
import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { ShopApi } from '@/api/v1/shop'

@Injectable()
export class AssignShopService {
  loading$ = new State({})
  shopList$ = new State([])
  types$ = new State([])
  constructor(private userService: UserService, private shopApi: ShopApi) {
    const shopTypes = this.userService
      .getOptions$('sold_common.product_support_shop')
      .snapshot()
    const brandTypes = this.userService
      .getOptions$('package_course.sale_range')
      .snapshot()
      .filter(item => item.value !== 1)
    const isShop = this.userService.isShop$.snapshot()
    this.types$ = new State(isShop ? shopTypes : brandTypes)
  }
  @Effect()
  getShopList() {
    return this.shopApi.getShopListForSelect().pipe(
      tap((res: any) => {
        this.shopList$.commit(() => res.shops)
      })
    )
  }
}
