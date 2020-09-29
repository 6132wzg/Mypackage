import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import {
  SoldDepositCardApi,
  UpdateRightsInput
} from '@/api/v1/sold/cards/deposit'
import { tap } from 'rxjs/operators'
import { UserService } from '@/services/user.service'

@Injectable()
export class UpdateRightsService {
  info$ = new State({})
  infoItems$ = new State([])
  loading$ = new State({})
  consumeTypeOptions$ = this.userService.getOptions$(
    'deposit_card.consumer_type'
  )
  transferUnitOptions$ = this.userService.getOptions$(
    'deposit_card.transfer_unit'
  )
  constructor(
    private cardApi: SoldDepositCardApi,
    private userService: UserService
  ) {}
  @Effect()
  getInfo(id: number) {
    return this.cardApi.getRightsInfo(id).pipe(
      tap((res: any) => {
        this.info$.commit(() => res.info)
      })
    )
  }
  @Effect()
  updateRights(id: number, params: UpdateRightsInput) {
    return this.cardApi.updateRights(id, params)
  }
}
