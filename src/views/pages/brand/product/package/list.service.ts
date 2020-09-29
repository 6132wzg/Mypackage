import { Query } from '@/api/v1/app/venue/data'
import { Controller, ServiceRoute, Injectable } from 'vue-service-app'
import { State } from 'rx-state'
import { BrandPackageApi, QueryInfo, QueryInput } from '@/api/v1/package/brand'
import { RedirectService } from '@/services/redirect.service'
import { anyAll } from '@/operators'
import { UserService } from '@/services/user.service'
import { tap } from 'rxjs/operators'
import { MessageService } from '@/services/message.service'
import { AuthService } from '@/services/auth.service'
import { PackageCommit } from '@/views/biz-service/product/package.commit'

@Injectable()
export class ListService implements Controller {
  list$ = new State([])
  page$ = new State({})
  upShelfInfo$ = new State({})
  downShelfInfo$ = new State({})
  loading$ = new State({})
  packageType$ = this.userService.getOptions$('package_course.package_type', {
    addAll: '全部属性'
  })
  supportNum$ = this.userService.getOptions$('package_course.support_num', {
    addAll: '支持使用人数'
  })
  auth$ = this.authService.authMap$({
    add: 'brand:product:package_course|add'
  })
  publicChannel$ = this.userService.getOptions$(
    'package_course.publish_channel',
    {
      addAll: '全部发布渠道'
    }
  )
  constructor(
    private userService: UserService,
    private msg: MessageService,
    private brandPackageApi: BrandPackageApi,
    private authService: AuthService,
    private commit: PackageCommit
  ) {}
  getList(query: QueryInfo) {
    return this.brandPackageApi.getList(query).pipe(
      tap(res => {
        // this.SET_PACKAGE_LIST(res.list)
        this.list$.commit(() => this.commit.SET_PACKAGE_LIST(res.list))
        this.page$.commit(() => res.page)
      })
    )
  }
  deletePackage(id: string | number) {
    return this.brandPackageApi.deletePackage(id).pipe(
      tap(res => {
        this.msg.success({ content: '删除课程包成功' })
      })
    )
  }
  setSyncSold(id: string | number) {
    return this.brandPackageApi.setSyncSold(id).pipe(
      tap(() => {
        this.msg.success({ content: '同步至售出成功' })
      })
    )
  }
  init(query: QueryInfo) {
    return anyAll(this.getList(query))
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return this.init(to.meta.query)
  }
}
