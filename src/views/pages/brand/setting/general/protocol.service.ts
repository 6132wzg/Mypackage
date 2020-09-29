import { Injectable, ServiceRoute, Controller } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { ProtocolApi, ProtocalInput } from '@/api/v1/setting/protocol'

@Injectable()
export class ProtocolService implements Controller {
  protocolInfo$ = new State({})
  loading$ = new State({})
  constructor(private ProtocolApi: ProtocolApi) {}
  getInfo() {
    return this.ProtocolApi.getInfo().pipe(
      tap((res: any) => {
        this.protocolInfo$.commit(() => res.info)
      })
    )
  }
  @Effect()
  update(data: ProtocalInput) {
    return this.ProtocolApi.update(data)
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return this.getInfo()
  }
}
