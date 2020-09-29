import { Injectable } from 'vue-service-app'
import { State } from 'rx-state'

import { AuthService } from '@/services/auth.service'
@Injectable()
export class ReserveService {
  authTabs$ = this.authService.getAuthTabs$('shop-reception-reserve')
  constructor(private authService: AuthService) {}
}
