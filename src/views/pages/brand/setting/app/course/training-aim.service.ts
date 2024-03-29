import { Injectable, ServiceRoute, Controller } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { DeleteTrainingAimInput, TrainingApi } from '@/api/v1/setting/training'
import { AuthService } from '@/services/auth.service'

@Injectable()
export class TrainingAimService implements Controller {
  resData$ = new State({})
  loading$ = new State({})
  auth$ = this.authService.authMap$({
    add: 'brand_shop:course:training_aim|add'
  })
  constructor(
    private trainingApi: TrainingApi,
    private authService: AuthService
  ) {}
  @Effect()
  getTrainingAimList() {
    return this.trainingApi.getTrainingAimList().pipe(
      tap(res => {
        this.resData$.commit(() => res)
      })
    )
  }
  deleteTrainingAim(params: DeleteTrainingAimInput) {
    return this.trainingApi.deleteTrainingAim(params)
  }
  beforeEach(to: ServiceRoute, from: ServiceRoute) {
    return this.getTrainingAimList()
  }
}
