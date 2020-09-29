<template>
  <div class="shortcut-models-wrapper">
    <div class="shortcut-models">
      <div
        class="shortcut-model"
        @click="onShortcut(item.id)"
        :disabled="!item.auth"
        :key="index"
        v-for="(item, index) in filterShortcutList"
      >
        <div class="shortcut-model-icon" :class="item.icon"></div>
        <div class="shortcut-model-label">{{ item.name }}</div>
        <div
          class="shortcut-model-del"
          v-if="auth.modelSetting"
          @click.stop="handleRemoveModels(item.id)"
        >
          <st-icon type="modal-close" size="12px"></st-icon>
        </div>
      </div>
      <div
        class="shortcut-model add"
        @click="onAddShortcut"
        v-if="!isAllShow && auth.modelSetting"
      >
        <div class="icon">
          <a-icon
            type="plus-circle"
            theme="filled"
            :style="{ fontSize: '36px', color: '#9BACB9' }"
          />
        </div>
        <div class="tip">新增常用功能</div>
      </div>
    </div>
    <sold-transaction ref="soldTransaction"></sold-transaction>
  </div>
</template>

<script>
import { ShortcutModelService } from './shortcut-model.service'

import FrontAddReserve from '@/views/biz-modals/front/add-reserve'
import ShopFinanceGatheringEarnestAdd from '@/views/biz-modals/shop/finance/gathering/earnest/add'
import ShopReceptionEditShortcuts from '@/views/biz-modals/shop/reception/edit-shortcuts'
import SoldTransaction from '@/views/biz-components/sold/transaction'
import { cloneDeep } from 'lodash-es'
import { PRODUCT_TYPE } from '@/constants/sold/transaction'
export default {
  name: '',

  bem: {},

  components: { SoldTransaction },

  serviceInject() {
    return {
      shortcutModelService: ShortcutModelService
    }
  },
  rxState() {
    return {
      auth: this.shortcutModelService.auth$,
      list: this.shortcutModelService.list$,
      loading: this.shortcutModelService.loading$
    }
  },

  modals: {
    FrontAddReserve,
    ShopFinanceGatheringEarnestAdd,
    ShopReceptionEditShortcuts
  },

  props: {},

  data() {
    return {
      // 根据权限处理后的快捷操作列表
      filterShortcutList: [],
      PRODUCT_TYPE
    }
  },

  computed: {
    isAllShow() {
      const len = this.list.length
      const fLen = this.filterShortcutList.length
      return len === fLen
    }
  },

  async: {},

  mounted() {
    this.getShortCutList()
  },

  methods: {
    getShortCutList() {
      this.shortcutModelService.getIcons().subscribe(res => {
        this.formatShortcutList()
      })
    },
    handleRemoveModels(id) {
      let icons = this.list.map(i => {
        if (i.id === id) i.is_show = 0
        return i
      })
      console.log('icons', icons)
      this.shortcutModelService
        .setIcons({
          icons
        })
        .subscribe(res => {
          this.show = false
          this.getShortCutList()
        })
    },
    // 快捷操作
    onShortcut(data) {
      if (data === 'reserveAdd' || data === 'earnestAdd') {
        switch (data) {
          case 'reserveAdd':
            this.$modalRouter.push({
              name: 'front-add-reserve',
              on: {
                success: result => {
                  this.$router.reload()
                }
              }
            })
            break
          case 'earnestAdd':
            this.$modalRouter.push({
              name: 'shop-finance-gathering-earnest-add',
              props: {},
              on: {
                success: res => {
                  this.$router.reload()
                  this.$refs.soldTransaction.payCallBack(
                    res.orderId,
                    '',
                    res.type,
                    res
                  )
                }
              }
            })
            break
        }
      } else {
        let typeMap = {
          memberBill: this.PRODUCT_TYPE.MEMBER_CARD,
          depositBill: this.PRODUCT_TYPE.DEPOSIT_CARD,
          personalBill: this.PRODUCT_TYPE.PERSONAL_COURSE,
          packageBill: this.PRODUCT_TYPE.PACKAGE,
          smallCourseBill: this.PRODUCT_TYPE.SMALL_COURSE,
          cabinetBill: this.PRODUCT_TYPE.CABINET
        }
        this.$refs.soldTransaction.onTransaction('', typeMap[data])
      }
    },
    formatShortcutList() {
      console.log('list', this.list)
      this.filterShortcutList = this.list
        .map(i => {
          i.auth = this.auth[i.id]
          return i
        })
        .filter(i => i.auth && i.is_show)
    },
    onAddShortcut() {
      this.$modalRouter.push({
        name: 'shop-reception-edit-shortcuts',
        on: {
          done: () => {
            this.getShortCutList()
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
