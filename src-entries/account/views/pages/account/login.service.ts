import { MessageService } from '@/services/message.service'
import { Injectable, RouteGuard } from 'vue-service-app'
import { State, Effect } from 'rx-state'
import { tap } from 'rxjs/operators'
import { LoginApi, LoginAccountInput, LoginPhoneInput } from '@/api/login'
import { TokenService } from '@/services/token.service'

@Injectable()
export class LoginService implements RouteGuard {
  name$ = new State<string>('')
  isBind$ = new State('')
  loading$ = new State({})
  constructor(
    private loginApi: LoginApi,
    private tokenService: TokenService,
    private msg: MessageService
  ) {}
  @Effect()
  loginAccount(data: LoginAccountInput) {
    return this.loginApi.loginAccount(data).pipe(
      tap(res => {
        this.tokenService.SET_TOKEN(res.token)
        localStorage.clear()
      })
    )
  }
  loginPhone(params: LoginPhoneInput) {
    return this.loginApi.loginPhone(params).pipe(
      tap(res => {
        this.tokenService.SET_TOKEN(res.token)
        localStorage.clear()
      })
    )
  }
  logout() {
    return this.loginApi.logout().pipe(
      tap(res => {
        this.msg.success({ content: '注销成功' })
      })
    )
  }
  getCaptcha(params: any) {
    return this.loginApi.getCaptcha(params)
  }
  checkPhoneIsBind(params: any) {
    return this.loginApi.checkPhoneIsBind(params)
  }
  bindPhoneForAccount(params: any) {
    return this.loginApi.bindPhoneForAccount(params).pipe(
      tap(res => {
        this.tokenService.SET_TOKEN(res.token)
        localStorage.clear()
      })
    )
  }
  beforeRouteEnter(to: any) {
    if (to.meta.query.isBind) {
      this.isBind$.commit(() => to.meta.query.isBind)
    }
  }
}
