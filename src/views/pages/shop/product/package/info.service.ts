import { Controller, ServiceRoute, Injectable } from 'vue-service-app'
import { State } from 'rx-state'
import { ShopPackageApi, GetDetailInput } from '@/api/v1/package/shop'
import { CommonPackageApi } from '@/api/v1/package/common'
import { anyAll } from '@/operators'
import { UserService } from '@/services/user.service'
import { tap } from 'rxjs/operators'

@Injectable()
export class InfoService implements Controller {
  info$ = new State({})
  auth$ = new State({})
  constructor(
    private userService: UserService,
    private shopPackageApi: ShopPackageApi,
    private commonApi: CommonPackageApi
  ) {}
  SET_INFO(info) {
    this.info$.commit(() => info)
  }
  getInfo(query: GetDetailInput) {
    return this.shopPackageApi.getPackageDetail(query).pipe(
      tap(res => {
        this.SET_INFO(res.info)
        this.auth$.commit(() => res.auth)
      })
    )
  }
  init(query: any) {
    return anyAll(this.getInfo(query))
  }
  beforeRouteEnter(to: ServiceRoute, from: ServiceRoute) {
    to.query.id = to.query.id || '647530610753617'
    to.query.packageType = 'shop'
    return this.init(to.query)
  }
}
