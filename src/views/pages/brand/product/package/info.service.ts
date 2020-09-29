import { Controller, ServiceRoute, Injectable } from 'vue-service-app'
import { State } from 'rx-state'
import { BrandPackageApi, GetDetailInput } from '@/api/v1/package/brand'
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
    private brandPackageApi: BrandPackageApi,
    private commonApi: CommonPackageApi
  ) {}
  SET_INFO(info) {
    this.info$.commit(() => info)
  }
  getInfo(query: GetDetailInput) {
    return this.brandPackageApi.getPackageDetail(query).pipe(
      tap(res => {
        this.SET_INFO(res.info)
        this.auth$.commit(() => res.auth)
      })
    )
  }
  init(query: any) {
    return anyAll(this.getInfo(query))
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    to.query.id = to.query.id || '647530610753617'
    to.query.packageType = 'brand'
    return this.init(to.query)
  }
}
