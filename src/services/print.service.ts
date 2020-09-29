import { Injectable } from 'vue-service-app'
@Injectable()
export class PrintService {
  constructor() {}
  /**
   * 打印小票
   */
  printSmallTicket(order_id) {
    window.open(
      `/ticket/gathering-print?id=${order_id}`,
      '_blank',
      'width=800,height=600'
    )
  }
}
