import { Injectable } from 'vue-service-app'
import { Effect, State } from 'rx-state'
import { tap } from 'rxjs/operators'
import { AuthService } from '@/services/auth.service'
// import { StatApi } from '@/api/v1/stat/shop'
import { CourseApi, CourseDataParams } from '@/api/v1/stat/common/course'

@Injectable()
export class PersonalService {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  auth$ = this.authService.authMap$({
    'brand-personal-coach': 'brand:stat:course|personal_coach_export',
    'brand-personal-member': 'brand:stat:course|personal_member_export',
    'shop-personal-coach': 'shop:stat:class_reports|personal_coach_export',
    'shop-personal-member': 'shop:stat:class_reports|personal_member_export'
  })
  constructor(private courseApi: CourseApi, private authService: AuthService) {}

  @Effect()
  getReserveList(query: CourseDataParams, type: string) {
    this.list$.commit(() => [])
    return this.courseApi.getReserveList(query, type).pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
}
