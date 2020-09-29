import { Injectable, ServiceRoute, Controller } from 'vue-service-app'
import { State } from 'rx-state'
import { tap } from 'rxjs/operators'
import { MemberApi, EditFaceParams } from '@/api/v1/member'
import { AuthService } from '@/services/auth.service'
import { forkJoin } from 'rxjs'
import { MessageService } from '@/services/message.service'

@Injectable()
export class InfoService implements Controller {
  info$ = new State({})
  basicInfo$ = new State({})
  auth$ = new State({})
  authCommon$ = this.authService.authMap$({
    add: 'shop:member:member|tag',
    face: 'brand_shop:iot:face|edit',
    delFace: 'shop:member:member|del_face'
  })
  constructor(
    private cardsApi: MemberApi,
    private authService: AuthService,
    private message: MessageService
  ) {}
  getHeaderInfo(id: string) {
    return this.cardsApi.getHeaderInfo(id).pipe(
      tap(res => {
        this.info$.commit(() => res.common_info)
        this.auth$.commit(() => res.auth)
      })
    )
  }
  getBasicInfo(id: string) {
    return this.cardsApi.getBasicInfo(id).pipe(
      tap(res => {
        this.basicInfo$.commit(() => res.basic_info)
      })
    )
  }

  removeWechatBind(id: number) {
    return this.cardsApi.removeWechatBind(id)
  }

  getMemberLabelDelete(obj: any) {
    return this.cardsApi.getMemberLabelDelete(obj)
  }

  // 删除用户人脸
  deleteMemberFace(id: string) {
    return this.cardsApi.deleteMemberFace(id)
  }

  // 修改人脸图片
  editFace(id: number, params: EditFaceParams) {
    return this.cardsApi.updateUserFace(id, params)
  }
  // 清空指纹信息
  deleteMemberFinger(id: string) {
    return this.cardsApi.deleteMemberFinger(id).pipe(
      tap(res => {
        this.message.success({ content: '指纹信息清空成功' })
      })
    )
  }
  // 清空硬件（储物柜）密码
  deleteMemberCabinetPassword(id: string) {
    return this.cardsApi.deleteMemberCabinetPassword(id).pipe(
      tap(res => {
        this.message.success({ content: '硬件密码清空成功' })
      })
    )
  }
  init(id: any) {
    return forkJoin(this.getBasicInfo(id), this.getHeaderInfo(id))
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    const { id } = to.meta.query
    return this.init(id)
  }
}
