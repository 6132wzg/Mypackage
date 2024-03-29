import { Injectable, Controller, ServiceRoute } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { CardsApi, CardListInput } from '@/api/v1/cards'
import { AuthService } from '@/services/auth.service'
import { tap, map } from 'rxjs/operators'
import { UserService } from '@/services/user.service'
import { forkJoin } from 'rxjs'
import { TitleService } from '@/services/title.service'
@Injectable()
export class AllService implements Controller {
  list$ = new State([])
  page$ = new State({})
  loading$ = new State({})
  auth$ = this.authService.authMap$({
    add: 'brand:product:member_card|add'
  })
  publishChannel$ = this.userService
    .getOptions$('member_card.publish_channel')
    .pipe(map(options => [{ value: -1, label: '所有渠道' }].concat(options)))
  cardType$ = this.userService
    .getOptions$('member_card.card_type')
    .pipe(map(options => [{ value: -1, label: '所有类型' }].concat(options)))
  sellStatus$ = this.userService
    .getOptions$('member_card.sell_status')
    .pipe(
      map(options => [{ value: -1, label: '所有售卖状态' }].concat(options))
    )
  cardNumberTypeOptions$ = this.userService
    .getOptions$('member_card.support_member_num_simple')
    .pipe(
      map(options => [{ value: -1, label: '支持入场人数' }].concat(options))
    )

  constructor(
    private cardsApi: CardsApi,
    private userService: UserService,
    private authService: AuthService,
    private titleService: TitleService
  ) {}
  @Effect()
  getList(query: CardListInput) {
    return this.cardsApi.getCardList(query, 'brand', 'member').pipe(
      tap((res: any) => {
        this.list$.commit(() => res.list)
        this.page$.commit(() => res.page)
      })
    )
  }
  @Effect()
  deleteCard(id: string) {
    return this.cardsApi.setCardsDelete(id, 'brand', 'member')
  }
  init(query: CardListInput) {
    return forkJoin([this.getList(query)])
  }
  beforeEach(to: ServiceRoute) {
    this.titleService.SET_TITLE(`全部${this.userService.c('member_card')}项`)
    return this.init(to.meta.query)
  }
}
