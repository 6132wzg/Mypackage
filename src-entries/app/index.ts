import '../_before-bootstrap'

import VueStForm from 'vue-st-form'
// @ts-ignore
import Viewer from 'v-viewer'
import PortalVue from 'portal-vue'
// @ts-ignore
import Scrollbar from '@/vendor/vue-scrollbar'
// @ts-ignore
import VueComponentHooks from '@/vendor/vue-component-hooks'

// components
import components from './components'
import ICountUp from 'vue-countup-v2'

// proto
import container from '@/container'
import { UserService } from '@/services/user.service'

import App from '@/views/App.vue'
import routes from '@/router/routes'

import '@/filters/register'
import '@/directives/register'

import '@/style'

import bootstrap from '../bootstrap'

// @ts-ignore
bootstrap({
  AppComponent: App,
  routes,
  vueUse(Vue) {
    // plugins
    Vue.use(VueStForm)
    Vue.use(Scrollbar)
    Vue.use(Viewer)
    Vue.use(PortalVue)
    Vue.use(VueComponentHooks)

    // componetns
    Vue.component(ICountUp.name, ICountUp)

    components.forEach(C => {
      Vue.component(C.name, C)
    })
    // proto
    Vue.prototype.$c = (...args: any[]) => {
      return container.get(UserService).c(...args)
    }
  }
})
