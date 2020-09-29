import { UserService } from '@/services/user.service'
import { BrandPackageApi, QueryInput } from '@/api/v1/package/brand'
import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'

@Injectable()
export class ShopListService {
  loading$ = new State({})
  list$ = new State([])
  constructor(private api: BrandPackageApi, private userService: UserService) {}
  SET_LIST(list) {
    let shelfStatus = this.userService
      .getOptions$('package_course.shelf_status')
      .snapshot()
    let isPermanentSale: any = this.userService
      .getEnumValue$('package_course.sale_time_is_forever')
      .snapshot()
    list = list.map((item, index) => {
      item.shelfDate = item.is_permanent_sale
        ? isPermanentSale[item.is_permanent_sale]
        : `${item.start_time} ~ ${item.end_time}`
      shelfStatus.forEach(ele => {
        if (ele.value === item.shelf_status) {
          item.shelfStatusName = ele.label
        }
      })
      item.id = index
      return item
    })
    this.list$.commit(() => list)
  }
  @Effect()
  getShelfStatusList(id: string | number) {
    return this.api.getShelfStatusList(id).pipe(
      tap(res => {
        this.SET_LIST(res.list)
      })
    )
  }
}
