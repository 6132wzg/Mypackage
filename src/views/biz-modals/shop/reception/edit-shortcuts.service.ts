import { Injectable } from 'vue-service-app'
import { IconsApi, FrontIconsInput } from '@/api/v1/front/icons'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { AuthService } from '@/services/auth.service'

@Injectable()
export class EditShortcutService {
  list$ = new State({})
  auth$ = this.authService.authMap$({
    memberBill: 'shop:front_end:module|member_card',
    depositBill: 'shop:front_end:module|deposit_card',
    personalBill: 'shop:front_end:module|personal_course',
    packageBill: 'shop:front_end:module|package_course',
    smallCourseBill: 'shop:front_end:module|small_course',
    cabinetBill: 'shop:front_end:module|cabinet',
    reserveAdd: 'shop:reserve:visit_reserve|add',
    earnestAdd: 'shop:temporary_payment:bargin|add',
    modelSetting: 'shop:front_end:module|option_setting'
  })
  constructor(private authService: AuthService, private iconsApi: IconsApi) {}
  @Effect()
  getIcons() {
    return this.iconsApi.getFrontIcons().pipe(
      tap((res: any) => {
        this.list$.commit(() => res.info)
      })
    )
  }
  @Effect()
  setIcons(query: FrontIconsInput) {
    return this.iconsApi.setFrontIcons(query)
  }
}
