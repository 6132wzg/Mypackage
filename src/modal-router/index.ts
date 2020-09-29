import Vue from 'vue'
// @ts-ignore
import VueModalRouter from 'vue-modal-router'
import container from '@/container'
import routes from './routes'

Vue.use(VueModalRouter, {
  model: 'show',
  delay: 300
})

export const modalRouter = new VueModalRouter(routes)

container.bindValue(VueModalRouter, modalRouter)

modalRouter
  .beforeEachOpen((to: any) => {
    // @ts-ignore
    window.currentModalName = to.name
    modalRouter.isOpening = true
  })
  .afterEachClosed(() => {
    // @ts-ignore
    delete window.currentModalName
    modalRouter.isOpening = false
  })
