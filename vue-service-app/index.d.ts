import VueRouter, {
  Route as VueRoute,
  RouteConfig as VueRouteConfig,
  Location
} from 'vue-router'
import VueRouterPlus from 'vue-router-plus'
import { VueConstructor } from 'vue'
import Vue from 'vue'

type PluginFunction<T> = (Vue: VueConstructor, options?: T) => void

interface Dictionary<T> {
  [key: string]: T
}

interface Ctor<T> {
  new (...args: any[]): T
}

interface MyLocation extends Location {
  /**
   * 强制更新replaceState当前页，即使没有任何query更新
   */
  force?: Boolean
  query?: Dictionary<any>
}

interface QueryOption {
  default?: number | string
  type: NumberConstructor | StringConstructor
}

interface QueryOptions {
  [queryName: string]: QueryOption
}

interface RouteConfigMeta {
  [key: string]: any
  queryOptions?: QueryOptions
}

// 全局声明类型 declares
export interface ServiceRoute extends VueRoute {
  name: string
  meta: {
    [key: string]: any
    query: any
  }
}

export interface ServiceRouteConfig extends VueRouteConfig {
  guards?: any[] | never[]
  queryOptions?: QueryOptions
  children?: ServiceRouteConfig[]
  meta?: RouteConfigMeta
}

type ServiceProvideConfig =
  | Ctor<any>
  | {
      provide: any
      useValue?: any
      useClass?: Ctor<any>
    }

export interface RouteGuard {
  beforeEach?(to: ServiceRoute, from: ServiceRoute, next: Function): void
  beforeRouteEnter?(to: ServiceRoute, from: ServiceRoute, next: Function): void
  beforeRouteUpdate?(to: ServiceRoute, from: ServiceRoute, next: Function): void
  afterEach?(to: ServiceRoute, from: ServiceRoute, next: Function): void
}

export interface Controller {
  /**
   * 路由进入前和路由更新时
   */
  beforeEach?(to: ServiceRoute, from: ServiceRoute, next: Function): void
  /**
   * 路由进入前
   */
  beforeRouteEnter?(to: ServiceRoute, from: ServiceRoute, next: Function): void
  /**
   * 路由更新时
   */
  beforeRouteUpdate?(to: ServiceRoute, from: ServiceRoute, next: Function): void
  /**
   * 路由离开当前时
   */
  beforeRouteLeave?(to: ServiceRoute, from: ServiceRoute, next: Function): void
  /**
   * vue视图初始化时
   */
  beforeCreate?(): void
}

export class Container {
  get<T>(provide: Ctor<T>): T
  get(provide: any): any
  bindValue(token: any, value: any): this
  destroy(token: any): void
}

interface VueServiceAppConfig {
  base?: string
  container: Container
  routes?: ServiceRouteConfig[]
  scrollBehavior?: Function
}

declare module 'vue-service-app' {
  export class ServiceRouter extends VueRouterPlus {
    isHistoryBF: Boolean
  }
  export class InjectionToken {
    constructor(desc: string)
  }
  export function Injectable(): any
  export function Inject(provide: any): any
  export default class VueServiceApp {
    static install: PluginFunction<never>
    constructor(config: VueServiceAppConfig)
    router: ServiceRouter
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    /**
     * injects
     */
    serviceInject?: (this: V) => object
    /**
     * providers
     */
    serviceProviders?: (this: V) => object | Array<any>
  }
}
