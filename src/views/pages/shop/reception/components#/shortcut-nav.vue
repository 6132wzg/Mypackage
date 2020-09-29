<template>
  <div class="shortcut-jump" :class="{ showDropDown }" ref="shortcutNav">
    <div class="label">快捷跳转：</div>
    <div class="nav" ref="shortcuts">
      <div
        class="nav-item"
        v-for="(item, index) in nodropdownList"
        :disabled="!item.auth"
        :key="index"
        @click="onShortcut(item.id)"
      >
        {{ item.label }}
      </div>
      <template v-if="showDropDown">
        <a-dropdown v-model="visible" placement="bottomRight">
          <a class="dropdown" @click="visible = !visible">
            <div class="dropdown-icon">
              <img src="~@/assets/img/icon_dropdown.png" alt="" />
            </div>
          </a>
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item v-for="shortcut in dropdownList" :key="shortcut.id">
              {{ shortcut.label }}
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </template>
    </div>
  </div>
</template>

<script>
import { shortcutNavList } from './shortcut.config'
import { ShortcutNavService } from './shortcut-nav.service'

import { cloneDeep, throttle } from 'lodash-es'

export default {
  name: '',

  bem: {},

  components: {},

  serviceInject() {
    return {
      shortcutNavService: ShortcutNavService
    }
  },
  rxState() {
    return {
      auth: this.shortcutNavService.auth$
    }
  },

  props: {},

  data() {
    return {
      // 根据权限处理后的快捷操作列表
      dropdownList: [],
      nodropdownList: [],
      visible: false,
      needResize: false,
      safeWidth: 142,
      resizeSmall: false
    }
  },

  computed: {
    shortcutNavList,
    showDropDown() {
      return !!this.dropdownList.length
    }
  },

  async: {},

  mounted() {
    this.formatShortcutList()
    window.addEventListener('resize', this.judgeIfNeedResizeShortNav)
  },

  methods: {
    judgeIfNeedResizeShortNav() {
      let shortcutNav = this.$refs.shortcutNav
      let shortcuts = this.$refs.shortcuts
      if (shortcuts && shortcutNav) {
        let nWidth = shortcutNav.offsetWidth
        let sWidth = shortcuts.offsetWidth
        let offsetWidth = nWidth - sWidth
        console.log('offsetWidth', offsetWidth)
        if (offsetWidth > 290) {
          this.needResize = false
          this.resizeShortcutList()
        }
        if (offsetWidth < 200) {
          this.needResize = true
          this.resizeShortcutList()
        }
      }
    },
    // 快捷操作
    onShortcut(data) {
      switch (data) {
        case 'checkInoutRecord':
          window.open('/shop/reception/entrance')
          break
        case 'scheduleAgency':
          window.open('/shop/product/course/schedule/team')
          break
        case 'courseSign':
          window.open('/shop/reception/reserve')
          break
        case 'receptionCabinet':
          window.open('/shop/reception/cabinet')
          break
        case 'earnestManage':
          window.open('/shop/finance/gathering/earnest')
          break
        case 'store':
          window.open('/shop/sold/transaction/store')
          break
        case 'soldCard':
          window.open('/shop/sold/card/list')
          break
        case 'soldCourse':
          window.open('/shop/sold/course/list')
          break
        case 'receptionRecord':
          window.open('/shop/store/order/list/verification')
          break
      }
    },
    openNewTab(path) {
      let a = document.createElement('a')
      let url = location.origin + path
      a.setAttribute('href', url)
      a.setAttribute('target', '_blank')
      a.setAttribute('id', 'camnpr')
      document.body.appendChild(a)
      a.click()
    },
    handleMenuClick(e) {
      let key = e.key
      this.onShortcut(key)
    },
    formatShortcutList() {
      let trueArray = this.shortcutNavList
        .map(i => {
          i.auth = this.auth[i.id] || false
          return i
        })
        .filter(i => i.auth)
      this.nodropdownList = cloneDeep(trueArray)
      this.$nextTick(() => {
        this.initShortcutList()
      })
    },
    initShortcutList(val) {
      let shortcutNav = this.$refs.shortcutNav
      let shortcuts = this.$refs.shortcuts
      if (shortcuts && shortcutNav) {
        let nWidth = shortcutNav.offsetWidth
        let sWidth = shortcuts.offsetWidth
        let offsetWidth = nWidth - sWidth
        console.log('initShortcutList offsetWidth', offsetWidth)
        if (offsetWidth > 290) {
          this.needResize = false
          return false
        } else if (offsetWidth < 180) {
          this.deleteDropDownList()
        }
      }
    },
    computedOffsetWidth() {
      let shortcutNav = this.$refs.shortcutNav
      let shortcuts = this.$refs.shortcuts
      let nWidth = shortcutNav.offsetWidth
      let sWidth = shortcuts.offsetWidth
      let offsetWidth = nWidth - sWidth
      return offsetWidth < 180
    },
    deleteDropDownList() {
      let len = this.nodropdownList.length
      console.log('deleteDropDownList', len)
      if (len) {
        let list = this.nodropdownList.splice(len - 1)
        this.dropdownList = [...this.dropdownList, ...list]
        this.$nextTick(() => {
          if (this.computedOffsetWidth()) {
            return this.deleteDropDownList()
          } else {
            return false
          }
        })
      } else {
        return false
      }
    },
    resizeShortcutList() {
      if (this.needResize) {
        let len = this.nodropdownList.length
        if (len) {
          let list = this.nodropdownList.splice(len - 1)
          this.dropdownList = [...this.dropdownList, ...list]
        }
      } else {
        let len = this.dropdownList.length
        if (len) {
          let list = this.dropdownList.splice(len - 1)
          this.nodropdownList = [...this.nodropdownList, ...list]
        }
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
