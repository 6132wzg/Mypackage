import { Controller, ServiceRoute, Injectable } from 'vue-service-app'
import { AuthService } from '@/services/auth.service'
import { State, Effect } from 'rx-state/src'

@Injectable()
export class StatService implements Controller {
  authTabs$ = this.authService.getAuthTabs$('brand-stat')
  constructor(private authService: AuthService) {}
  beforeRouteEnter(to: ServiceRoute, from: ServiceRoute, next: any) {
    next()
  }
}
