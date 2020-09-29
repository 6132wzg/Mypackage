import '../_before-bootstrap'

// plugins
import VueStForm from 'vue-st-form'

// components
import components from './components'

import App from './views/App.vue'
import routes from './router/routes'

import './index.less'

import bootstrap from '../bootstrap'

bootstrap({
  AppComponent: App,
  routes,
  vueUse(Vue) {
    // plugins
    Vue.use(VueStForm)

    components.forEach(C => {
      Vue.component(C.name, C)
    })
  }
})
