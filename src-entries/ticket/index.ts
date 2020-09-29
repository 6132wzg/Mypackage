import '../_before-bootstrap'
import App from './views/App.vue'
import routes from './router/routes'

import './index.less'

import bootstrap from '../bootstrap'

bootstrap({
  AppComponent: App,
  routes
})
