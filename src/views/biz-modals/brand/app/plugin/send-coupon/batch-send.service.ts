import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { GroupApi } from '@/api/v1/setting/sms/group'
import { DirectionalIssuanceApi } from '@/api/v1/plugin/directional_issuance'
import { UserService } from '@/services/user.service'
import { tap } from 'rxjs/operators'

@Injectable()
export class BatchSendService {
  loading$ = new State({})
  crowdList$ = new State({})
  templateList$ = new State([])
  info$ = new State([])
  sign$ = new State({})
  userType$ = this.userService.getOptions$('plugin.user_type')

  constructor(
    private GroupApi: GroupApi,
    private userService: UserService,
    private directionalIssuanceApi: DirectionalIssuanceApi
  ) {}
  @Effect()
  getCrowdList(query: any) {
    return this.GroupApi.getCrowdList(query).pipe(
      tap((res: any) => {
        this.crowdList$.commit(() => res.list)
      })
    )
  }
  @Effect()
  sendCoupon(query: any) {
    return this.directionalIssuanceApi
      .sendCoupon(query)
      .pipe(tap((res: any) => res))
  }
}
