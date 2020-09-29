import { ApplicationApi, GetCardListInput } from '@/api/v1/applications'
import { Injectable, ServiceRoute } from 'vue-service-app'
import { AuthService } from '@/services/auth.service'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'

@Injectable()
export class AutoRenewalEditService {
  auth$ = this.authService.authMap$({
    checkout: 'shop:front_end:check_in_out|checkout',
    batchCheckout: 'shop:front_end:check_in_out|batch_checkout'
  })
  loading$ = new State({})
  page$ = new State({})
  finished$ = new State({})
  list$ = new State([])
  product$ = new State({})
  specs$ = new State([])
  constructor(
    private authService: AuthService,
    private applicationApi: ApplicationApi
  ) {}
  resetProductDetail() {
    this.product$.commit(() => {})
    this.specs$.commit(() => [])
  }
  setList(list) {
    this.list$.commit(() => list)
  }
  editProductSpec(res) {
    this.specs$.commit(() => res)
  }
  @Effect()
  getCardList(query: GetCardListInput) {
    console.log('query', query)
    return this.applicationApi.getCardList(query).pipe(
      tap((res: any) => {
        this.page$.commit(() => res.page)
        this.finished$.commit(() => {
          return res.page.current_page >= res.page.total_pages
        })
        this.list$.commit((preList: any) => {
          if (res.page.current_page === 1) {
            preList = []
          }
          return preList.concat(res.list)
        })
      })
    )
  }
  @Effect()
  getProductDetail(query: { id: number }) {
    return this.applicationApi.getProductDetail(query).pipe(
      tap((res: any) => {
        this.product$.commit(() => res)
        this.specs$.commit(() => res.specs)
      })
    )
  }
  @Effect()
  productAdd(params: any) {
    return this.applicationApi.productAdd(params)
  }
  @Effect()
  productEdit(params: any) {
    return this.applicationApi.productEdit(params)
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {}
}
