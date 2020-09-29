import { BrandPackageApi } from '@/api/v1/package/brand'
import { Injectable } from 'vue-service-app'
import { tap } from 'rxjs/operators'
import { MessageService } from '@/services/message.service'

@Injectable()
export class AddService {
  constructor(private api: BrandPackageApi, private msg: MessageService) {}
  addPackageInfo(form) {
    return this.api.addPackageInfo(form).pipe(
      tap(res => {
        this.msg.success({ content: '添加课程包成功' })
      })
    )
  }
  shelfPackage(form) {
    return this.api.shelfPackage(form).pipe(
      tap(res => {
        this.msg.success({ content: '添加并上架课程包成功' })
      })
    )
  }
}
