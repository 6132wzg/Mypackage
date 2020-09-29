import { UserService } from '@/services/user.service'
import { Injectable, ServiceRoute } from 'vue-service-app'
import { PluginSignUpApi } from '@/api/v1/plugin/sign_up'
import { Effect, State } from 'rx-state'
import { then } from '@/operators'

@Injectable()
export class ActivityTableSelectService {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  constructor(private api: PluginSignUpApi, private userService: UserService) {}
  RESET_LIST() {
    this.list$.commit(() => [])
  }

  @Effect()
  getSignUpList(query: any) {
    return this.api.getSignUpList(query).pipe(
      then((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
}
