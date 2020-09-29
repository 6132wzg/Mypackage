import { Injectable } from 'vue-service-app'
import { AuthService } from '@/services/auth.service'
@Injectable()
export class OrdersService {
  authTabs$ = this.authService.getAuthTabs$('shop-stat-orders')
  constructor(private authService: AuthService) {}
}
