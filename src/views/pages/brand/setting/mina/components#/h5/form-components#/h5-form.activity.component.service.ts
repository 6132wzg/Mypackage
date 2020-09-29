import { Injectable } from 'vue-service-app'
import { State } from 'rx-state/src'
import { UserService } from '@/services/user.service'

@Injectable()
export class H5FormActivityComponentService {
  loading$ = new State({})
  constructor(private userService: UserService) {}
  directionOptions$ = this.userService.getOptions$(
    'mina_setting.show_direction'
  )
}
