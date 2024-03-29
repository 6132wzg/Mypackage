import { Controller, Injectable } from 'vue-service-app'
import { UserService } from '@/services/user.service'
import { RedirectService } from '@/services/redirect.service'

@Injectable()
export class DashboardService implements Controller {
  constructor(
    private redirectService: RedirectService,
    private userService: UserService
  ) {}
  beforeEach() {
    return this.redirectService.redirect({
      locateRouteName: 'shop-dashboard',
      redirectRoute: {
        name: `shop-dashboard-${this.userService.useVersion$.snapshot()}`
      }
    })
  }
}
