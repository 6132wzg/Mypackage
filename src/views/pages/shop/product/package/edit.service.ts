import { ShopPackageApi } from '@/api/v1/package/shop'
import { Controller, Injectable, ServiceRoute } from 'vue-service-app'
import { tap } from 'rxjs/operators'
import { MessageService } from '@/services/message.service'
import { State } from 'rx-state/src'
@Injectable()
export class EditService implements Controller {
  info$ = new State({})
  constructor(private api: ShopPackageApi, private msg: MessageService) {}
  editShowBack(id: any) {
    return this.api.editShowBack(id).pipe(
      tap(res => {
        this.info$.commit(() => res.info)
      })
    )
  }
  editPackageInfo(form: any) {
    return this.api.editPackageInfo(form).pipe(
      tap(res => {
        this.msg.success({ content: '课程包编辑成功' })
      })
    )
  }
  beforeEach(to: ServiceRoute) {
    return this.editShowBack(to.meta.query.id)
  }
}
