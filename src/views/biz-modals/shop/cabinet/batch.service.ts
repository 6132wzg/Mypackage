import { Injectable } from 'vue-service-app'
import { Effect } from 'rx-state'
import { CabinetApi, DelInput } from '@/api/v1/setting/cabinet'
@Injectable()
export class BatchService {
  constructor(private cabinetApi: CabinetApi) {}
  @Effect()
  del(params: DelInput) {
    return this.cabinetApi.deleteCabinet(params)
  }
  @Effect()
  clearCabinet(params: any) {
    return this.cabinetApi.clearCabinet(params)
  }
}
