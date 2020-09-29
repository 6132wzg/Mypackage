import { Injectable, Controller } from 'vue-service-app'
import { RedirectService } from '@/services/redirect.service'
@Injectable()
export class TeamService implements Controller {
  constructor(private redirectService: RedirectService) {}
  beforeEach() {
    return this.redirectService.redirect({
      locateRouteName: 'brand-stat-course-team',
      redirectRoute: {
        name: 'brand-stat-course-team-coach'
      }
    })
  }
}
