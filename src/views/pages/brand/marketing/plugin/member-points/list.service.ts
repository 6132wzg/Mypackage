import { Injectable } from 'vue-service-app'

import { AuthService } from '@/services/auth.service'

@Injectable()
export class ListService {
  authTabs$ = this.authService.getAuthTabs$(
    'brand-marketing-plugin-member-points-list'
  )
  constructor(private authService: AuthService) {}
}
