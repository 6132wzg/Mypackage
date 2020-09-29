import { Controller, ServiceRoute, Injectable } from 'vue-service-app'
import { AuthService } from '@/services/auth.service'

@Injectable()
export class RevenueService implements Controller {
  authTabs$ = this.authService.getAuthTabs$('shop-stat-revenue')
  constructor(private authService: AuthService) {}
  beforeRouteEnter(to: ServiceRoute, from: ServiceRoute, next: any) {
    next()
  }
}
