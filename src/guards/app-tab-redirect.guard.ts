import {
  RouteGuard,
  ServiceRoute,
  Injectable,
  ServiceRouter
} from 'vue-service-app'
import { RedirectService } from '@/services/redirect.service'
import { NotificationService } from '@/services/notification.service'
import { AuthService } from '@/services/auth.service'
import { Errors } from '@/constants/errors'

/**
 * 跳转守卫
 */
@Injectable()
export class AppTabRedirectGuard implements RouteGuard {
  constructor(
    private authService: AuthService,
    private redirectService: RedirectService,
    private router: ServiceRouter,
    private notification: NotificationService,
    private errors: Errors
  ) {}
  beforeEach(to: ServiceRoute) {
    // 当路由没有配置meta.tabs时直接next
    const hasTabsRoutes = to.matched.filter(r => r.meta.tabs)
    if (!hasTabsRoutes.length) {
      return
    }
    // 不管当前处于子路由还是父级路由,都要计算下授权的tabs
    hasTabsRoutes.forEach(route => {
      const authedTabs = this.authService.calcAuthedTabsByTabs(route.meta.tabs)
      if (route.name) {
        this.authService.UPDATE_AUTHED_TAB_MAP(route.name, authedTabs)
      }
    })
    // 父路由的跳转逻辑
    if (!to.meta.tabs) {
      return
    }
    // 获取当前路由下已授权的子路由
    const myAuthedTabs = this.authService.getAuthTabs$(to.name).snapshot()
    // 如果当前路由下还有子路由 但所有子路由都无权限访问 则结束重定向
    if (to.meta.tabs && !myAuthedTabs.length && to.meta.isStayCurrentPage)
      return

    if (!myAuthedTabs.length) {
      console &&
        console.error(`该路由下没有tab可跳转 ${to.name} [redirect.guard] `)
      this.router.next({
        name: 'welcome'
      })
      return false
    }

    const firstRouteName = myAuthedTabs[0] ? myAuthedTabs[0].route.name : ''
    return this.redirectService.redirect({
      locateRouteName: to.name,
      redirectRoute: {
        name: firstRouteName,
        query: to.query
      }
    })
  }
}
