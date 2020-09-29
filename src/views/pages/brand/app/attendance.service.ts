import { Injectable } from 'vue-service-app'
import { AuthService } from '@/services/auth.service'

@Injectable()
export class AttendanceService {
  authTabs$ = this.authService.getAuthTabs$('brand-app-attendance')
  constructor(private authService: AuthService) {}
}
