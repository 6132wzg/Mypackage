<template>
  <div class="layout-default" :class="theme">
    <aside class="layout-default-sider">
      <!-- 门店维度下 -->
      <div class="layout-default-sider__shop" v-if="isInShop">
        <div class="layout-default-sider__shop-top">
          <div class="layout-default-sider__logo">
            <img
              width="100%"
              height="100%"
              :src="shop.logo | imgFilter({ w: 128, h: 128 })"
              alt="logo"
            />
            <!-- <i class="layout-default-sider__certification st-icon-certified"></i> -->
          </div>
          <div class="layout-default-sider__shop-brand-name">
            {{ brand.name }}
          </div>
        </div>
        <div
          class="layout-default-sider__name cursor-pointer"
          @click="switchShop"
        >
          <span>{{ shop.name }}</span>
          <st-icon
            type="arrow-arc-right"
            class="layout-default-sider__arrow"
          ></st-icon>
        </div>
        <img
          class="layout-default-sider__shop-tag"
          src="~@/assets/img/brand/tag-shop.png"
        />
      </div>
      <!-- 品牌维度下 -->
      <div class="layout-default-sider__brand" v-else>
        <div class="layout-default-sider__logo">
          <img
            width="100%"
            height="100%"
            :src="brand.logo | imgFilter({ w: 96, h: 96 })"
            alt="logo"
          />
          <!-- <i class="layout-default-sider__certification st-icon-certified"></i> -->
        </div>
        <div
          class="layout-default-sider__name cursor-pointer"
          @click="switchShop"
        >
          <span>{{ brand.name }}</span>
          <st-icon
            type="arrow-arc-right"
            class="layout-default-sider__arrow"
          ></st-icon>
        </div>
        <img
          class="layout-default-sider__brand-tag"
          src="~@/assets/img/brand/tag-brand.png"
        />
      </div>
      <div
        class="layout-default-sider__scrollbox"
        v-scrollBar
        @click="onClickSiderMenu"
      >
        <default-sider-menu @change="onSiderMenuChange" />
        <div class="layout-default-sider__version">
          <div class="layout-default-sider__version-bg"></div>
          <label class="layout-default-sider__version-text">
            {{ siderMenuTip }}
          </label>
        </div>
      </div>
    </aside>
    <header
      class="layout-default-body__header"
      :class="{ 'layout-default-body__header--schedule': isSchedule }"
    >
      <div class="layout-default-body__location">
        <a-breadcrumb>
          <img
            slot="separator"
            src="~@/assets/img/separator.png"
            alt="separator"
            width="4px"
            class="layout-default-body__bread-separator"
          />
          <a-breadcrumb-item class="layout-default-body__bread-home">
            <router-link to="/">
              <st-icon type="home" class="layout-default-body__icon" />
            </router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item v-for="b in breadCrumbs" :key="b.label">
            <router-link :to="b.route" v-if="b.label && b.route.name">
              <span class="layout-default-body__breadtext">{{ b.label }}</span>
            </router-link>
            <span v-if="!b.route.name" class="layout-default-body__breadtext">
              {{ b.label }}
            </span>
          </a-breadcrumb-item>
          <a-breadcrumb-item
            v-if="title"
            class="layout-default-body__breadtext layout-default-body__breadtext--title"
          >
            <span>{{ title }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div class="layout-default-body__personal">
        <!-- 消息通知 -->
        <default-notify></default-notify>
        <!-- 九宫格 -->
        <a-dropdown
          :trigger="['hover']"
          placement="bottomRight"
          @visibleChange="onFastEntryVisible"
        >
          <div class="layout-default-body__avatar">
            <st-icon
              class="layout-fast-entry_icon"
              type="square"
              color="#9BACB9"
            ></st-icon>
          </div>
          <div slot="overlay">
            <componet :is="fastEntryComp" />
          </div>
        </a-dropdown>

        <a-dropdown :trigger="['hover']" placement="bottomRight">
          <div class="layout-default-body__avatar">
            <img
              :src="user.avatar | imgFilter({ w: 64, h: 64 })"
              width="32"
              height="32"
              alt="avatar"
            />
          </div>
          <div slot="overlay" class="layout-default-body__dropdown">
            <div class="layout-default-body__username">
              <p class="layout-default-body__name">{{ user.name }}</p>
              <p class="layout-default-body__mobile">{{ user.mobile }}</p>
            </div>
            <a-menu class="layout-default-body__menu">
              <!-- <a-menu-item class="layout-default-body__options">
                  <st-icon type="safety"></st-icon>
                  <span>账号安全</span>
              </a-menu-item>-->
              <!-- <a-menu-item class="layout-default-body__options">
                  <a v-modal-link="{ name: 'brand-switch' }">
                    <st-icon type="switch"></st-icon>
                    <span>切换品牌</span>
                  </a>
              </a-menu-item>-->
              <!-- <a-menu-divider/> -->
              <a-menu-item
                @click="onClickNotifyConfig"
                class="layout-default-body__options"
              >
                <st-icon type="notify-config" color="#000000"></st-icon>
                <span>通知设置</span>
              </a-menu-item>
              <a-menu-item
                @click="onClickBind"
                class="layout-default-body__options"
              >
                <st-icon type="bind-phone" size="16px"></st-icon>
                <span>绑定手机号</span>
              </a-menu-item>
              <a-menu-item
                @click="onClickModifyPass"
                class="layout-default-body__options"
              >
                <st-icon type="modify" size="16px"></st-icon>
                <span>修改密码</span>
              </a-menu-item>
              <a-menu-item
                @click="onClickLogout"
                class="layout-default-body__options"
              >
                <st-icon type="logout" size="16px"></st-icon>
                <span>退出</span>
              </a-menu-item>
            </a-menu>
          </div>
        </a-dropdown>
      </div>
    </header>
    <main class="layout-default-body">
      <article
        class="layout-default-body__content"
        :class="{ 'layout-default-body__content--reception': isReception }"
      >
        <router-view></router-view>
        <div class="layout-default-body__footer">
          <copyright></copyright>
        </div>
      </article>
    </main>
    <switch-shop v-model="isShowSwitchShop"></switch-shop>
    <st-udesk-btn v-show="isShowUdeskBtn" />
  </div>
</template>
<script>
import DefaultSiderMenu from './default#/sider-menu.vue'
import DefaultNotify from './default#/notify.vue'
import SwitchShop from '@/views/fragments/shop/switch'
import { find } from 'lodash-es'
import { UserService } from '@/services/user.service'
import { TokenService } from '@/services/token.service'
import { TitleService } from '@/services/title.service'

import AccountBind from '@/views/biz-modals/account/bind'
import AccountUnbind from '@/views/biz-modals/account/unbind'
import AccountModify from '@/views/biz-modals/account/modify'
import { UdeskService } from '@/services/udesk.service'
import StUdeskBtn from '@/views/biz-components/udesk-btn/udesk-btn'
import { WsNotifyService } from './default#/ws-notify.service'
import Copyright from '@/views/biz-components/copyright/copyright'

export default {
  name: 'SaasLayout',
  components: {
    DefaultSiderMenu,
    SwitchShop,
    DefaultNotify,
    StUdeskBtn,
    Copyright
  },
  serviceInject() {
    return {
      userService: UserService,
      tokenService: TokenService,
      titleService: TitleService,
      udeskService: UdeskService,
      wsNotifyService: WsNotifyService
    }
  },
  rxState() {
    const { systemList$, activityList$ } = this.wsNotifyService
    return {
      systemList$,
      activityList$,
      user: this.userService.user$,
      brand: this.userService.brand$,
      shop: this.userService.shop$,
      theme: this.userService.theme$,
      title: this.titleService.title$,
      isThemeStudio: this.userService.isThemeStudio$,
      isShowUdeskBtn: this.udeskService.isShowUdeskBtn$
    }
  },
  data() {
    return {
      isShowSwitchShop: false,
      systemListLength: 0,
      menuObj: {},
      fastEntryComp: null
    }
  },
  modals: {
    CommonNotifyConfig: () =>
      import(
        /* webpackChunkName: "notify-config" */ '@/views/biz-modals/common/notify/config'
      ),
    CommonNotifyActivity: () =>
      import(
        /* webpackChunkName: "notify-activity" */ '@/views/biz-modals/common/notify/activity'
      ),
    CommonNotifySystem: () =>
      import(
        /* webpackChunkName: "notify-system" */ '@/views/biz-modals/common/notify/system'
      ),
    AccountBind,
    AccountUnbind,
    AccountModify
  },
  computed: {
    breadCrumbs() {
      const menuBreadCrumb = this.getSiderMenuBreadCrumb()
      const parentBreadCrumb = this.getParentBreadCrumb()
      return [...menuBreadCrumb, ...parentBreadCrumb]
    },
    isInShop() {
      return this.shop.id
    },
    isSchedule() {
      return this.$route.path.includes('shop/product/course/schedule')
    },
    isReception() {
      return this.$route.path.includes('shop/reception/index')
    },
    siderMenuTip() {
      return this.isThemeStudio ? '工作室版' : '俱乐部版'
    }
  },
  watch: {
    systemList$(newValue, oldValue) {
      if (newValue.length === 0) {
        if (this.activityList$.length > 0) {
          this.$modalRouter.push({
            name: 'common-notify-activity',
            props: { list: this.activityList$ },
            on: {
              success: res => {
                this.wsNotifyService.setRead().subscribe()
              }
            }
          })
        }
        return
      }
      if (newValue.length === 0) return
      this.onSuccess()
    }
  },
  methods: {
    onFastEntryVisible(visible) {
      if (visible) {
        import(
          /* webpackChunkName: "fast-entry" */ './default#/fast-entry'
        ).then(C => {
          this.fastEntryComp = C.default || C
        })
      }
    },
    onSuccess() {
      const len = this.systemList$.length
      if (this.systemListLength === len) {
        if (this.activityList$.length > 0) {
          this.$modalRouter.push({
            name: 'common-notify-activity',
            props: { list: this.activityList$ },
            on: {
              success: res => {
                this.wsNotifyService.setRead().subscribe()
              }
            }
          })
        }
        return
      }
      this.$modalRouter.push({
        name: 'common-notify-system',
        props: { info: this.systemList$[this.systemListLength] },
        on: {
          // 模态窗动画400ms
          success: res => {
            this.systemListLength++
            setTimeout(() => {
              this.wsNotifyService.setRead().subscribe()
              this.onSuccess()
            }, 400)
          },
          cancel: res => {
            this.systemListLength++
            setTimeout(() => {
              this.onSuccess()
            }, 400)
          }
        }
      })
    },
    onClickNotifyConfig() {
      this.$modalRouter.push({ name: 'common-notify-config' })
    },
    switchShop() {
      this.isShowSwitchShop = !this.isShowSwitchShop
    },
    onClickBind() {
      this.$modalRouter.push({
        name: 'account-bind'
      })
    },
    onClickUnbind() {
      this.$modalRouter.push({
        name: 'account-unbind'
      })
    },
    onClickModifyPass() {
      this.$modalRouter.push({
        name: 'account-modify'
      })
    },
    onClickLogout() {
      this.tokenService.REMOVE_TOKEN()
      location.href = '/account/login'
    },
    getParentBreadCrumb() {
      const parentRouteName = this.$route.meta.parentRouteName
      let parentRoute
      if (parentRouteName) {
        parentRoute = this.$router.resolve({
          name: parentRouteName
        }).resolved
      }
      if (parentRoute) {
        const name = parentRoute.name
        const title = this.userService.interpolation(parentRoute.meta.title)
        return [
          {
            label: title,
            route: {
              name
            }
          }
        ]
      } else {
        return []
      }
    },
    getSiderMenuBreadCrumb() {
      const { selectedKey, currentSiderMenu } = this.menuObj
      if (selectedKey) {
        const menuBreadCrumb = []
        menuBreadCrumb.push({
          label: currentSiderMenu.name,
          route: {
            name: currentSiderMenu.url
          }
        })
        if (selectedKey) {
          const currentSubMenu = find(currentSiderMenu.children, subMenu => {
            return subMenu.id === selectedKey
          })
          if (currentSubMenu) {
            menuBreadCrumb.push({
              label: currentSubMenu.name,
              route: {
                name: currentSubMenu.url
              }
            })
          }
        }
        return menuBreadCrumb
      } else {
        return []
      }
    },
    onSiderMenuChange(menuObj) {
      this.menuObj = menuObj
    },
    onClickSiderMenu() {
      /**
       * 切换路由时关闭切换门店 drawer
       */
      this.isShowSwitchShop = false
    }
  }
}
</script>
