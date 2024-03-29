import { Injectable, ServiceRoute, Controller } from 'vue-service-app'

@Injectable()
export class CourseService implements Controller {
  constructor() {}
  beforeEach(to: ServiceRoute, from: ServiceRoute, next: any) {
    if (to.name === 'shop-sold-course') {
      next({
        name: 'shop-sold-course-list'
      })
    } else {
      next()
    }
  }
}
