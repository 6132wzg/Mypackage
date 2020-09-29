import { UserService } from '../../../../services/user.service'
import { Injectable } from 'vue-service-app'
import { Effect, State } from 'rx-state/src'
import { map, tap } from 'rxjs/operators'
import { CabinetApi } from '@/api/v1/setting/cabinet'

@Injectable()
export class EditStatusService {
  loading$ = new State({})
  cabinetBusinessTypes$ = this.userService
    .getOptions$('cabinet.cabinet_business_type')
    .pipe(
      map(res => {
        res = res.filter(item => item.value !== 2)
        return res
      })
    )
  constructor(
    private cabinetApi: CabinetApi,
    private userService: UserService
  ) {}
  @Effect()
  editCabinetStatus(id: number, params: any) {
    return this.cabinetApi.editCabinetStatus(id, params)
  }
}
