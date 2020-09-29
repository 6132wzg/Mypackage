import { Injectable, ServiceRoute, Controller } from 'vue-service-app'
import { RedirectService } from '@/services/redirect.service'
@Injectable()
export class PersonalService implements Controller {
  constructor(private redirectService: RedirectService) {}
  beforeEach() {
    return this.redirectService.redirect({
      locateRouteName: 'shop-stat-course-personal',
      redirectRoute: {
        name: 'shop-stat-course-personal-coach'
      }
    })
  }
}
