import {
  BrandPackageApi,
  QueryInfo,
  QueryInput,
  UpShelfInput
} from '@/api/v1/package/brand'
import { ShopPackageApi } from '@/api/v1/package/shop'
import { Injectable } from 'vue-service-app'
import { State, Effect, Action } from 'rx-state'
import { tap } from 'rxjs/operators'
import { MessageService } from '@/services/message.service'
import { anyAll } from '@/operators'

@Injectable()
export class OffSalesService {
  loading$ = new State({})
  shopOptions$ = new State([])
  info$ = new State({})
  constructor(
    private brandApi: BrandPackageApi,
    private shopApi: ShopPackageApi,
    private msg: MessageService
  ) {}
  @Effect()
  getDownShelfInfo(query: QueryInput) {
    const api = query.pageType === 'brand' ? this.brandApi : this.shopApi
    return api.getDownShelf(query).pipe(
      tap((res: any) => {
        this.info$.commit(() => res.info)
      })
    )
  }
  SET_LIST(list) {
    list = list.map(item => {
      return {
        label: item.shop_name,
        value: item.shop_id
      }
    })
    this.shopOptions$.commit(() => list)
  }
  getShopList(id: string | number) {
    return this.brandApi.getDownShelfShopList(id).pipe(
      tap((res: any) => {
        this.SET_LIST(res.list)
      })
    )
  }
  setDownShelf(params: UpShelfInput) {
    const api = params.pageType === 'brand' ? this.brandApi : this.shopApi
    return api.setDownShelf(params).pipe(
      tap((res: any) => {
        this.info$.commit(() => res.info)
      })
    )
  }
}
