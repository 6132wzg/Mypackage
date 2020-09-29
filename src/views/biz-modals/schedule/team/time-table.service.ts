import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { TeamScheduleTimeTableApi } from '@/api/v1/schedule/team/timetable'

@Injectable()
export class TeamTimeTableService {
  loading$ = new State({})
  courtList$ = new State({})
  constructor(private timeTableApi: TeamScheduleTimeTableApi) {}
  getTimeTableTemplate() {
    return this.timeTableApi.getTimeTableTemplate()
  }
  @Effect()
  saveTimeTableTemplate(data: any) {
    return this.timeTableApi.saveTimeTableTemplate(data)
  }
  @Effect()
  getTimeTableList(query: any) {
    return this.timeTableApi.getTimeTableList(query)
  }
}
