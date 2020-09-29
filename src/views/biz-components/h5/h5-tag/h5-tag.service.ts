import { Injectable } from 'vue-service-app'
import { UserService } from '@/services/user.service'

@Injectable()
export class H5TagService {
  constructor(private userService: UserService) {}
  activityStatus$ = this.userService.getEnumValue$('plugin.activity_status')
}
