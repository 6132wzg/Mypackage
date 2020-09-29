import Vue from 'vue'
import VueAntd from 'ant-design-vue'
import VueServiceApp from 'vue-service-app'
import { modalRouter } from '@/modal-router/index'
// @ts-ignore
import VueBemHelper from '@/vendor/vue-bem-helper'
// @ts-ignore
import VueRxState from '@/vendor/vue-rx-state'
import container from '@/container'
import i18n from '@/i18n'

import { MessageService } from '@/services/message.service'
import { NotificationService } from '@/services/notification.service'

Vue.use(VueAntd)
Vue.use(VueServiceApp, container)
Vue.use(VueBemHelper)
Vue.use(VueRxState)

interface BootstrapConfig {
  AppComponent: any
  routes: any[]
  vueUse?(Vue: any): void
}

export default function bootstrap(bootstrapConfig: BootstrapConfig) {
  if (bootstrapConfig.vueUse) {
    bootstrapConfig.vueUse(Vue)
  }
  const routes = bootstrapConfig.routes.concat([
    {
      path: '*',
      beforeEnter() {
        location.href = '/404'
      }
    }
  ])
  const { router } = new VueServiceApp({
    container,
    routes,
    scrollBehavior: (to: any, from: any) => {
      if (to.name === from.name) {
        return
      }
      return {
        y: 0
      }
    }
  })
  Vue.prototype.$message = container.get(MessageService)
  Vue.prototype.$notification = container.get(NotificationService)

  new Vue({
    el: '#app',
    router,
    i18n,
    // @ts-ignore
    modalRouter,
    render: h => h(bootstrapConfig.AppComponent)
  })
}
