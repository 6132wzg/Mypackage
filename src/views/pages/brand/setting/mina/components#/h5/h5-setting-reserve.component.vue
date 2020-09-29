<template>
  <div :class="h5()">
    <div :class="h5('shop-title')">
      <div :class="h5('shop-title__shop-select')">
        <h5ShopListComponent
          @change="switchShop"
          :shopList="shopList"
          :shopActiveIndex="shopActiveIndex"
        />
      </div>
      <div :class="h5('shop-title__submit')">
        <st-button
          type="primary"
          @click="submitForm"
          :loading="loading.postShopModules"
        >
          保存并发布
        </st-button>
      </div>
    </div>
    <a-spin :spinning="loading.getShopModules">
      <div :class="h5('content__wrap')">
        <div :class="h5('left')">
          <div :class="h5('title')">
            <div :class="h5('title--text')" class="color-title mg-b0">
              预约页面模块
            </div>
            <div
              :class="h5('title--text__tips')"
              class="color-text-light mg-t16"
            >
              该模块不可编辑
            </div>
          </div>
          <div :class="h5('modules')" v-if="modulesData.length">
            <h5ModuleComponent
              :isActive="sliderIndex === 0"
              :moduleInfo="modulesData[0]"
              :isNoChange="true"
            ></h5ModuleComponent>
          </div>
        </div>
        <div :class="h5('right')">
          <div :class="h5('content')">
            <div :class="h5('phone')">
              <div :class="h5('phone-placeholder')"></div>
              <h5PhoneComponent
                :class="h5('phone-content')"
                :moduleDatas="modulesDataString"
                :selectIndex="sliderIndex"
                @tapSlide="tapSlide"
                isActive="2"
                :tabSelect="1"
              />
            </div>
            <div :class="h5('form')">
              <div
                :class="h5('form-container')"
                v-if="modulesDataString.length"
              >
                <h5-form-reserveinfo-component
                  :moduleDatas="modulesDataString"
                  @draggChange="draggChange"
                  @change="editEmit"
                />
              </div>
              <div :class="h5('form-arrows')"></div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script>
import h5PhoneComponent from './h5-phone.component'
import { H5SettingReserveService } from './h5-setting-reserve.service'
import { MessageService } from '@/services/message.service'
import h5ModuleComponent from './h5-module.component'
import h5ShopListComponent from './h5-shop-list.component'
// 模块组件
import h5FormReserveinfoComponent from './form-components#/h5-form.reserveinfo.component'
export default {
  name: 'H5SettingReserveComponent',
  components: {
    h5PhoneComponent,
    h5ModuleComponent,
    h5ShopListComponent,
    h5FormReserveinfoComponent
  },
  bem: {
    h5: 'h5-setting-reserve-component'
  },
  data() {
    return {
      // 选择的 module
      selectModuleId: '',
      sliderIndex: 0,
      modulesDataString: [],
      shopId: -1,
      shopActiveIndex: 0,
      isEditFlag: false
    }
  },
  serviceInject() {
    return {
      messageService: MessageService,
      h5SettingReserveService: H5SettingReserveService
    }
  },
  rxState() {
    return {
      shopList: this.h5SettingReserveService.shopList$,
      modulesData: this.h5SettingReserveService.modulesData$,
      loading: this.h5SettingReserveService.loading$
    }
  },
  created() {
    this.init()
  },
  watch: {
    modulesData: {
      handler(val) {
        console.log('XXXXX', val)
        this.modulesDataString = JSON.parse(JSON.stringify(val))
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    init() {
      this.h5SettingReserveService.getShopList().subscribe(res => {
        this.selectModuleId = res.info.module_list[0].id
        this.sliderIndex = 0
        this.shopId = res.info.shop_id
        this.shopActiveIndex = 0
      })
    },
    // 切换了门店
    switchShop(shopId) {
      if (shopId != this.shopId) {
        if (this.isEditFlag) {
          this.$confirm({
            title: '确定要离开？',
            content: '此时离开将丢失已编辑的内容，是否确认离开？',
            onOk: () => {
              this.changShopRegetHandle(shopId)
              this.editEmit(false)
            }
          })
        } else {
          this.changShopRegetHandle(shopId)
        }
      }
    },
    changShopRegetHandle(shopId) {
      this.shopId = shopId
      const param = {
        shop_id: this.shopId,
        tab_type: '2'
      }
      this.shopActiveIndex = this.shopList.findIndex(item => {
        return item.shop_id === this.shopId
      })
      this.h5SettingReserveService.getShopModules(param).subscribe(res => {
        console.log(res)
      })
    },
    tapSlide({ selectModuleId, sliderIndex }) {
      this.selectModuleId = selectModuleId
      this.sliderIndex = sliderIndex
    },
    draggChange(list) {
      this.modulesDataString[0].content.list = []
      this.modulesDataString[0].content.list = list
      this.editEmit()
    },
    submitForm() {
      this.$confirm({
        title: '',
        content: '确认将当前设置内容发布到小程序？',
        onOk: () => {
          const list = this.modulesDataString[0].content.list
          const info = {
            tab_type: '2',
            shop_id: this.shopId,
            module_list: this.modulesDataString
          }
          console.log('info---', info)
          this.h5SettingReserveService
            .postShopModules({ info })
            .subscribe(res => {
              this.messageService.success({
                content: '保存成功'
              })
              this.editEmit(false)
            })
        }
      })
    },
    editEmit(flag = true) {
      this.isEditFlag = flag
      this.$emit('change', this.isEditFlag)
    }
  }
}
</script>
