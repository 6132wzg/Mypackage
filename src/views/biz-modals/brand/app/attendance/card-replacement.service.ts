import { State, Effect } from 'rx-state'
import {
  ApplicationApi,
  PostAttendanceMendInterface
} from '@/api/v1/applications'
import { tap } from 'rxjs/operators'
import { Injectable, ServiceRoute } from 'vue-service-app'
@Injectable()
export class CardReplacementService {
  loading$ = new State({})
  constructor(private applicationApi: ApplicationApi) {}
  @Effect()
  // 根据员工查询门店信息
  getAttendanceListHandle(query: { id: [number, string] }) {
    return this.applicationApi.getStaffShops(query).pipe(tap((res: any) => {}))
  }
  // 补卡保存
  @Effect()
  postAttendanceMendHandle(query: PostAttendanceMendInterface) {
    return this.applicationApi
      .postAttendanceMend(query)
      .pipe(tap((res: any) => {}))
  }
}
