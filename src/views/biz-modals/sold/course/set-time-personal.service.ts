import { Injectable } from 'vue-service-app'
import { CourseApi, ReducePersonalCourseTimeInput } from '@/api/v1/sold/course'
import { State, Effect } from 'rx-state'

@Injectable()
export class SettimeService {
  loading$ = new State({})
  constructor(private courseApi: CourseApi) {}
  @Effect()
  reduceTime(params: ReducePersonalCourseTimeInput) {
    return this.courseApi.reducePersonalCourseTime(params)
  }
}
