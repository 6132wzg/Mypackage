import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { SoldMemberCardApi } from '@/api/v1/sold/cards/member'
import { SoldApi } from '@/api/v1/cards/member/sold'
import { tap } from 'rxjs/operators'
import { UserService } from '@/services/user.service'

@Injectable()
export class UpdateRightsService {
  info$ = new State({})
  infoItems$ = new State([])
  loading$ = new State({})
  transferUnitOptions$ = this.userService.getOptions$('member_card.unit')
  inoutTypeOptions$ = this.userService.getOptions$('member_card.inout_type')
  supportMemberNumOptions$ = this.userService.getOptions$(
    'member_card.support_member_num'
  )
  constructor(
    private soldMemberCardApi: SoldMemberCardApi,
    private cardSyncApi: SoldApi,
    private userService: UserService
  ) {}
  @Effect()
  getInfo(id: number, isSync) {
    if (isSync) {
      return this.cardSyncApi.getSyncInfo(id).pipe(
        tap((res: any) => {
          this.info$.commit(() => {
            res.info.admission_range = {
              admission_range_type: -1,
              select_shops: []
            }
            res.info.course_interests = {
              course_interests_type: -1,
              select_courses: []
            }
            return res.info
          })
        })
      )
    }
    return this.soldMemberCardApi.getRightsInfo(id).pipe(
      tap((res: any) => {
        this.info$.commit(() => res.info)
      })
    )
  }
  @Effect()
  updateRights(id: number, params, isSync) {
    if (isSync) {
      return this.cardSyncApi.sync(id, params)
    }
    return this.soldMemberCardApi.updateRights(id, params)
  }
}
