import { UserService } from '@/services/user.service'
import { Injectable, Controller, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import {
  PackageApi,
  GetPackageListInput,
  OnsalePackageInput
} from '@/api/v1/course/package'
import { MessageService } from '@/services/message.service'
import { BrandPackageApi } from '@/api/v1/package/brand'
import { ShopPackageApi } from '@/api/v1/package/shop'
import { tap } from 'rxjs/operators'
import { AuthService } from '@/services/auth.service'
import { PackageCommit } from '@/views//biz-service/product/package.commit'

@Injectable()
export class ListService implements Controller {
  list$ = new State({})
  page$ = new State({})
  loading$ = new State({})
  packageType$ = this.userService.getOptions$('package_course.package_type', {
    addAll: '全部属性'
  })
  shelfStatus$ = this.userService.getOptions$('package_course.shelf_status', {
    addAll: '全部状态'
  })
  auth$ = this.authService.authMap$({
    add: 'shop:product:package_course|add'
  })

  supportNum$ = this.userService.getOptions$('package_course.support_num', {
    addAll: '支持使用人数'
  })
  publicChannel$ = this.userService.getOptions$(
    'package_course.publish_channel',
    {
      addAll: '全部发布渠道'
    }
  )
  constructor(
    private packageApi: PackageApi,
    private authService: AuthService,
    private userService: UserService,
    private msg: MessageService,
    private brandPackageApi: BrandPackageApi,
    private commit: PackageCommit,
    private shopPackageApi: ShopPackageApi
  ) {}
  @Effect()
  getList(params: GetPackageListInput) {
    return this.shopPackageApi.getPackageList(params).pipe(
      tap((res: any) => {
        this.list$.commit(() => this.commit.SET_PACKAGE_LIST(res.list))
        this.page$.commit(() => res.page)
      })
    )
  }
  @Effect()
  offsalePackage(params: any) {
    return this.packageApi.offsaleCoursePackage(params)
  }
  setSyncSold(id: string | number) {
    return this.brandPackageApi.setSyncSold(id).pipe(
      tap(() => {
        this.msg.success({ content: '同步至售出成功' })
      })
    )
  }
  @Effect()
  deletePackage(id: string) {
    return this.packageApi.deleteCoursePackage(id)
  }
  @Effect()
  onsalePackage(params: OnsalePackageInput) {
    return this.packageApi.onsaleCoursePackage(params)
  }
  init(params: GetPackageListInput) {
    return this.getList(params)
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return this.init(to.meta.query)
  }
}
