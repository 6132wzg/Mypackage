import { Injectable } from 'vue-service-app'
import { State, Effect, Action } from 'rx-state'
import { MessageService } from '@/services/message.service'
import { tap } from 'rxjs/operators'
import { PointsApi, EditPointsInput } from '@/api/v1/marketing/points'

@Injectable()
export class AddByBatchService {
  loading$ = new State({})
  constructor(private api: PointsApi, private msg: MessageService) {}
  @Effect()
  addOrMinusPoints(params: EditPointsInput, type: any) {
    const messageMap = {
      add: '添加积分成功',
      'shop-add': '添加积分成功',
      'add-by-batch': '批量添加积分成功',
      minus: '扣减积分成功',
      'shop-minus': '扣减积分成功',
      'minus-by-batch': '批量减积积分成功'
    }
    return this.api.addOrMinusPoints(params, type).pipe(
      tap(res => {
        this.msg.success({ content: messageMap[type] || '操作成功' })
      })
    )
  }
}
