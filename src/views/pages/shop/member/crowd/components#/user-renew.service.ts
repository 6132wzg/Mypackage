import { Injectable } from 'vue-service-app'
import { UserService } from '@/services/user.service'

@Injectable()
export class UserRenewService {
  renewProductType$ = this.userService.getOptions$('crowd.renew_product_type')
  constructor(private userService: UserService) {}
}
