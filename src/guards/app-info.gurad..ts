import { UserService } from '@/services/user.service'
import { AuthService } from '@/services/auth.service'
import { RegionService } from '@/services/region.service'
import { NProgressService } from '@/services/nprogress.service'
import { forkJoin } from 'rxjs'
import { Injectable, RouteGuard } from 'vue-service-app'
import { anyAll, then } from '@/operators'
import { CdnService } from '@/services/cdn.service'
import { PluginService } from '@/services/plugin.service'
/**
 * 获取全局应用信息
 */
@Injectable()
export class AppInfoGuard implements RouteGuard {
  firstBootstrap = true
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private regionService: RegionService,
    private nprogressService: NProgressService,
    private cdnService: CdnService,
    private pluginService: PluginService
  ) {}
  /**
   *  单点故障接口
   */
  private fetchSinglePointReqs() {
    return forkJoin(
      // staff info 包含了 品牌信息 门店信息 用户信息
      this.userService.fetchStaffInfo(),
      // 获取全局权限列表数据
      this.authService.fetchList(),
      // 获取全局菜单数据
      this.userService.fetchMenuData(),
      // 获取全局枚举
      this.userService.fetchEnums(),
      // 获取全局切换门店列表数据
      this.userService.fetchShopList(),
      // 获取全局插件列表数据
      this.pluginService.fetchList()
    ).pipe(
      then(() => {
        this.nprogressService.SET_TEXT('核心数据加载完毕')
        this.cdnService.uploadError()
      })
    )
  }
  /**
   * 可故障接口
   */
  private fetchOptionalReqs() {
    return anyAll(
      // 获取无效的tooltips列表
      this.userService.fetchInvalidTooltips()
    ).pipe(
      then(() => {
        this.nprogressService.SET_TEXT('全部数据加载完毕')
      })
    )
  }
  private fetchAppReqs() {
    return forkJoin(this.fetchSinglePointReqs(), this.fetchOptionalReqs()).pipe(
      then(() => {
        this.firstBootstrap = false
      })
    )
  }
  beforeRouteEnter() {
    if (this.firstBootstrap) {
      return this.fetchAppReqs()
    }
  }
}
