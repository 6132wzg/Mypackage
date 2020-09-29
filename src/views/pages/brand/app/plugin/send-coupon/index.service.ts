import { Injectable, ServiceRoute, Controller } from 'vue-service-app'
import { DirectionalIssuanceApi } from '@/api/v1/plugin/directional_issuance'
import { forkJoin } from 'rxjs'
import { tap } from 'rxjs/operators'
import { State, Effect } from 'rx-state'
import { UserService } from '@/services/user.service'
import { AuthService } from '@/services/auth.service'

@Injectable()
export class IndexService implements Controller {
  list$ = new State({})
  page$ = new State({})
  loading$ = new State({})
  info$ = new State({})
  status$ = this.userService.getOptions$('plugin.activity_status', {
    addAll: '全部状态'
  })
  auth$ = this.authService.authMap$({
    add: 'brand:directional_issuance:options|issuing_coupons',
    list: 'brand:directional_issuance:coupon|list'
  })
  constructor(
    private directionalIssuanceApi: DirectionalIssuanceApi,
    private userService: UserService,
    private authService: AuthService
  ) {}
  @Effect()
  getList(query: any) {
    return this.directionalIssuanceApi.getList(query).pipe(
      tap(res => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  init(query: any) {
    return forkJoin(this.getList(query))
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return this.init(to.meta.query)
  }
}
