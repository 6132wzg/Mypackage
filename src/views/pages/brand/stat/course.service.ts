import { Injectable } from 'vue-service-app'
import { State } from 'rx-state/src'
import { tap } from 'rxjs/operators'
import { CourseApi, CourseChartParams } from '@/api/v1/stat/brand/course'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'

@Injectable()
export class CourseService {
  saleChartData$ = new State<object[]>([])
  remainChartData$ = new State<object[]>([])
  amountChartData$ = new State<object[]>([])
  saleChartTotal$ = new State(0)
  remainCourseTotal$ = new State(0)
  amountCourseTotal$ = new State(0)
  authTabs$ = this.authService.getAuthTabs$('brand-stat-course')
  productType$ = this.userService.getEnumValue$(
    'report.course_overview_product_type'
  )

  auth$ = this.authService.authMap$({
    export: 'brand:stat:course|batch_export'
  })
  constructor(
    private api: CourseApi,
    private authService: AuthService,
    private userService: UserService
  ) {}
  GET_LIST(list: any = []) {
    const dataChart: any = []
    let productType: any = this.productType$.snapshot() || {}
    list.map(item => {
      dataChart.push({
        key: item.product_type,
        name: productType[item.product_type],
        value: item.value
      })
    })
    return dataChart
  }
  SET_SALE_COURSE_DATA(saleCourse: any = {}) {
    const dataChart: any = this.GET_LIST(saleCourse.list)
    this.saleChartData$.commit(() => dataChart)
    this.saleChartTotal$.commit(() => +saleCourse.total || 0)
  }
  SET_REMAING_COURSE_DATA(remaingCourse: any = {}) {
    const dataChart: any = this.GET_LIST(remaingCourse.list)
    this.remainChartData$.commit(() => dataChart)
    this.remainCourseTotal$.commit(() => +remaingCourse.total || 0)
  }
  SET_REMAING_AVG_AMOUNT_DATA(remaingAvgAmount: any = {}) {
    const dataChart: any = this.GET_LIST(remaingAvgAmount.list)
    this.amountChartData$.commit(() => dataChart)
    this.amountCourseTotal$.commit(() => +remaingAvgAmount.total || 0)
  }
  // 获取营收统计图信息
  getChart(query: CourseChartParams) {
    return this.api.getChart(query).pipe(
      tap(res => {
        const data = res.info || {}
        this.SET_SALE_COURSE_DATA(data.sale_course_total)
        this.SET_REMAING_COURSE_DATA(data.remaing_course_total)
        this.SET_REMAING_AVG_AMOUNT_DATA(data.remaing_course_amount_total)
      })
    )
  }
}
