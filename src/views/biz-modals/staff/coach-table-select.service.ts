import { UserService } from '@/services/user.service'
import { Injectable, ServiceRoute } from 'vue-service-app'
import { SettingMinaApi } from '@/api/v1/setting/mina'
import { Effect, State } from 'rx-state'
import { then } from '@/operators'

@Injectable()
export class CoachTableSelectService {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  coach_type$ = this.userService.getOptions$('mina_setting.coach_identity')
  constructor(private api: SettingMinaApi, private userService: UserService) {}
  RESET_LIST() {
    this.list$.commit(() => [])
  }

  @Effect()
  getCoachList(query: any) {
    return this.api.getCoachList(query).pipe(
      then((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
}
