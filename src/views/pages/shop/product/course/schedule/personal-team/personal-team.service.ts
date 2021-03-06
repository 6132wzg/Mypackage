import { Controller, Injectable, ServiceRoute } from 'vue-service-app'
import { forkJoin } from 'rxjs'
import { PersonalTeamScheduleScheduleService } from './service#/schedule.service'
import { PersonalTeamScheduleCommonService } from './service#/common.service'
import { AuthService } from '@/services/auth.service'
import { State } from 'rx-state'

@Injectable()
export class PersonalTeamService implements Controller {
  state$: State<any>
  auth$ = this.authService.authMap$({
    add: 'shop:schedule:personal_team_course_schedule|add',
    addBatch: 'shop:schedule:personal_team_course_schedule|batch_add',
    copy: 'shop:schedule:personal_team_course_schedule|copy'
  })
  constructor(
    private commonService: PersonalTeamScheduleCommonService,
    private authService: AuthService,
    private scheduleService: PersonalTeamScheduleScheduleService
  ) {
    this.state$ = new State({})
  }

  initOptions() {
    const commonService = this.commonService
    return forkJoin(commonService.getCoachList(), commonService.getCourseList())
  }
  beforeEach(to: ServiceRoute, form: ServiceRoute) {
    return this.scheduleService.getList(to.meta.query)
  }
  beforeRouteEnter(to: ServiceRoute, form: ServiceRoute) {
    return this.initOptions()
  }
}
