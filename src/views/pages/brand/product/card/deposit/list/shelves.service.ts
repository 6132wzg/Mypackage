import { Injectable, Controller, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import {
  CardsApi,
  CardShelfListInput,
  BrandCardShelfDownInput
} from '@/api/v1/cards'
import { tap, map } from 'rxjs/operators'
import { ShopApi } from '@/api/v1/shop'
import { forkJoin } from 'rxjs'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'

@Injectable()
export class ShelvesService implements Controller {
  shopList$ = new State([])
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  auth$ = this.authService.authMap$({
    batchDown: 'brand_shop:product:deposit_card|batch_down'
  })
  publishChannel$ = this.userService
    .getOptions$('deposit_card.publish_channel')
    .pipe(map(options => [{ value: -1, label: '所有渠道' }].concat(options)))

  constructor(
    private cardApi: CardsApi,
    private shopApi: ShopApi,
    private userService: UserService,
    private authService: AuthService
  ) {}
  @Effect()
  getList(query: CardShelfListInput) {
    return this.cardApi.getCardShelfList(query, 'brand', 'deposit').pipe(
      tap((res: any) => {
        this.page$.commit(() => res.page)
        this.list$.commit(() => res.list)
      })
    )
  }
  getShopList() {
    return this.shopApi.getShopListForSelect().pipe(
      tap((res: any) => {
        this.shopList$.commit(() => res.shops)
      })
    )
  }
  init(query: CardShelfListInput) {
    return forkJoin(this.getList(query), this.getShopList())
  }
  @Effect()
  setCardShelfDown(params: BrandCardShelfDownInput) {
    return this.cardApi.setBrandDepositShelfDown(params)
  }
  beforeEach(to: ServiceRoute) {
    return this.init(to.meta.query)
  }
}
