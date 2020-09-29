import Login from '../views/pages/account/login.vue'
import { LoginService } from '../views/pages/account/login.service'
import Find from '../views/pages/account/find.vue'
import { FindService } from '../views/pages/account/find.service'
import { ProgressGuard } from '@/guards/progress.guard'
import { TitleGuard } from '@/guards/title.guard'
import { TrackGuard } from '@/guards/track.guard'

const accountGuards: any[] = [ProgressGuard, TrackGuard, TitleGuard]

export default [
  {
    name: 'account-login',
    path: '/account/login',
    component: Login,
    guards: accountGuards,
    controller: LoginService,
    meta: {
      title: '登录'
    }
  },
  {
    name: 'account-find',
    path: '/account/find',
    component: Find,
    guards: accountGuards,
    controller: FindService,
    meta: {
      title: '找回密码'
    }
  }
]
