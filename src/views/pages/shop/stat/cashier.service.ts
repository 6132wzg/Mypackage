import { Injectable } from 'vue-service-app'
import { AuthService } from '@/services/auth.service'
@Injectable()
export class CashierService {
  authTabs$ = this.authService.getAuthTabs$('shop-stat-cashier')
  constructor(private authService: AuthService) {}
}
