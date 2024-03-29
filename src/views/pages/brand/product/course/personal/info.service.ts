import { State } from 'rx-state'
import { Controller, ServiceRoute, Injectable } from 'vue-service-app'
import { tap, catchError } from 'rxjs/operators'
import {
  BrandPersonalCourseApi,
  GetPersonalBrandInfoInput
} from '@/api/v1/course/personal/brand'
@Injectable()
export class InfoService implements Controller {
  personalCourseInfo$ = new State({})
  constructor(private brandPersonalCourseApi: BrandPersonalCourseApi) {}
  SET_TEAM_COURSE_INFO(data: any) {
    this.personalCourseInfo$.commit(() => data.info)
  }
  getPersonalBrandInfo(query: GetPersonalBrandInfoInput) {
    return this.brandPersonalCourseApi.getPersonalBrandInfo(query).pipe(
      tap(
        res => {
          this.SET_TEAM_COURSE_INFO(res)
        },
        catchError((res: any) => {
          console.log('没有详情')
          return res
        })
      )
    )
  }
  init(query: GetPersonalBrandInfoInput) {
    return this.getPersonalBrandInfo(query)
  }
  beforeRouteEnter(to: ServiceRoute) {
    const course_id = to.query.id as string
    return this.init({ course_id })
  }
}
