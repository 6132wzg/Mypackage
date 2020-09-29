import { Api } from '@/api/api'

export class ProtocolApi extends Api {
  getInfo() {
    return this.http.get('/v1/protocol/mina/get-info')
  }
  update(params: ProtocalInput) {
    return this.http.post('/v1/protocol/mina', { params })
  }
}

export interface ProtocalInput {
  /**
   * 会员状态是否开启 1开启 2关闭
   */
  protocol_status: number
  /**
   * 协议标题
   */
  title: string
  /**
   * 协议正文
   */
  content: string
}
