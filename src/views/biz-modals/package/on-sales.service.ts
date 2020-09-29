import { shop_columns } from './../../pages/brand/product/card/member/period/info.config'
import { Injectable } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { MessageService } from '@/services/message.service'

import {
  BrandPackageApi,
  QueryInfo,
  QueryInput,
  UpShelfInput
} from '@/api/v1/package/brand'
import { ShopPackageApi } from '@/api/v1/package/shop'
@Injectable()
export class OnSalesService {
  loading$ = new State({})
  info$ = new State([])
  constructor(
    private brandApi: BrandPackageApi,
    private shopApi: ShopPackageApi,
    private msg: MessageService
  ) {}
  @Effect()
  getUpShelfInfo(query: QueryInput) {
    return this.brandApi.getUpShelf(query).pipe(
      tap((res: any) => {
        this.info$.commit(() => res.info)
      })
    )
  }
  setUpShelf(params: UpShelfInput) {
    if (params.pageType === 'brand') {
      return this.brandApi.setUpShelf(params).pipe(
        tap(res => {
          this.msg.success({ content: '课程包上架成功' })
        })
      )
    } else if (params.pageType === 'shop') {
      return this.shopApi.setUpShelf(params).pipe(
        tap(res => {
          this.msg.success({ content: '课程包上架成功' })
        })
      )
    }
  }
}
