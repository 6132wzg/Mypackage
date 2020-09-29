import { Api } from '@/api/api'

export class CabinetCallConfirmApi extends Api {
  confirm(msgId: any, params: any) {
    return this.http.put(`/v1/setting/cabinet/call-confirm/${msgId}`, {
      params
    })
  }
}
