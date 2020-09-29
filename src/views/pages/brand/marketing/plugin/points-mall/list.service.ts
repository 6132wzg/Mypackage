import { RedirectService } from '@/services/redirect.service'
import { State } from 'rx-state'
import { Injectable, Controller, ServiceRoute } from 'vue-service-app'

import { AuthService } from '@/services/auth.service'

@Injectable()
export class ListService implements Controller {
  // authTabs$ = this.authService.getAuthTabs$('brand-product-card-deposit-list')
  // authTabs$ = this.authService.authMap$({
  //   add: 'brand:activity:coupon|add'
  // })
  authTabs$ = new State([
    {
      label: '商品列表',
      route: {
        name: 'brand-marketing-plugin-points-mall-list-good-list',
        query: {}
      }
    },
    {
      label: '兑现记录',
      route: {
        name: 'brand-marketing-plugin-points-mall-list-exchange-log',
        query: {}
      }
    }
  ])
  authTabs: any[] = this.authTabs$.snapshot() as any[]

  constructor(
    private authService: AuthService,
    private redirectService: RedirectService
  ) {}
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return this.redirectService.redirect({
      locateRouteName: 'brand-marketing-plugin-points-mall-list',
      redirectRoute: {
        name: this.authTabs[0].route.name
      }
    })
  }
}
