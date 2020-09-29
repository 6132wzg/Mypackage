import { Injectable } from 'vue-service-app'
import { UserService } from '@/services/user.service'

@Injectable()
export class IsBuyPersonalService {
  buyPersonalCourse$ = this.userService.getOptions$(
    'member.buy_personal_course'
  )
  constructor(private userService: UserService) {}
}
