import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { UserService } from '@/services/user.service'
import { GroupBuyApi } from '@/api/v1/marketing/group-buy'

@Injectable()
export class ProductSettingService {
  loading$ = new State({})
  memberList$ = new State([])
  depositList$ = new State([])
  personalList$ = new State([])
  coachLevelList$ = new State([])
  brand$ = this.userService.brand$
  productType$ = this.userService.getOptions$(
    'limited_time_discount.product_type'
  )
  constructor(
    private groupBuyApi: GroupBuyApi,
    private userService: UserService
  ) {}
  // 获取会籍卡列表
  @Effect()
  getMemberList() {
    return this.groupBuyApi.getMemberList({ sell_status: 1 }).pipe(
      tap((res: any) => {
        this.memberList$.commit(() => res.list)
      })
    )
  }
  // 获取储值卡列表
  @Effect()
  getDepositList() {
    return this.groupBuyApi.getDepositList({ sell_status: 1 }).pipe(
      tap((res: any) => {
        this.depositList$.commit(() => res.list)
      })
    )
  }
  // 获取私教课列表
  @Effect()
  getPersonalList() {
    return this.groupBuyApi.getPersonalList().pipe(
      tap((res: any) => {
        this.personalList$.commit(() => res.list)
      })
    )
  }
  // 获取该课程的教练等级列表
  @Effect()
  getCoachLevelList(id: number) {
    return this.groupBuyApi.getCoachList(id, { is_group: false }).pipe(
      tap((res: any) => {
        this.coachLevelList$.commit(() => res.list)
      })
    )
  }
}
