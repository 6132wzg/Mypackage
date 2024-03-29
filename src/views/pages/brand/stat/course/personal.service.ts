import { Injectable, Controller } from 'vue-service-app'
import { RedirectService } from '@/services/redirect.service'
@Injectable()
export class PersonalService implements Controller {
  constructor(private redirectService: RedirectService) {}
  beforeEach() {
    return this.redirectService.redirect({
      locateRouteName: 'brand-stat-course-personal',
      redirectRoute: {
        name: 'brand-stat-course-personal-coach'
      }
    })
  }
}
