<template>
  <div>
    <div :class="h5('header')">
      <div :class="h5('shops')">
        <h5ShopListComponent
          @change="switchShop"
          :class="h5('shops-module')"
          :shopList="shopList"
          :shopActiveIndex="shopActiveIndex"
        />
      </div>
      <st-button
        type="primary"
        @click="saveData"
        :loading="loading.saveIndexConfig"
      >
        保存并发布
      </st-button>
    </div>
    <a-spin :spinning="loading.getShopModules">
      <div :class="h5()">
        <div :class="h5('left')">
          <div :class="h5('title')">
            <div :class="h5('title--text')" class="color-title mg-b0">
              首页模块
            </div>
            <a-dropdown
              overlayClassName="setting-index__dropdown"
              :trigger="['click']"
              :getPopupContainer="trigger => trigger.parentNode"
            >
              <st-button
                icon="add"
                type="primary"
                @click="e => e.preventDefault()"
              >
                添加模块
              </st-button>
              <div slot="overlay" :class="h5('overlay')">
                <div :class="h5('overlay--content')">
                  <div
                    :class="h5('overlay--module')"
                    v-for="(item, index) in fnModules"
                    :key="index"
                    @click="selectModule(item)"
                  >
                    {{ item.module_name }}
                  </div>
                </div>
                <div :class="h5('overlay--content')">
                  <div
                    :class="h5('overlay--module')"
                    v-for="(item, index) in marketingModules"
                    :key="index"
                    @click="selectModule(item)"
                  >
                    {{ item.module_name }}
                  </div>
                </div>
              </div>
            </a-dropdown>
          </div>
          <div :class="h5('text')" class="st-des">
            点击可对模块进行隐藏、删除操作，支持拖动排序
          </div>
          <div
            :class="h5('modules')"
            v-if="modulesData.length"
            ref="leftModules"
          >
            <div @click="tapModuleItem(modulesData[0], 0)">
              <h5ModuleComponent
                :isActive="sliderIndex === 0"
                :moduleInfo="modulesData[0]"
                :hasSlot="true"
              >
                <div
                  :class="h5('shop-detail--button')"
                  v-if="modulesData[0].module_tag === 'shop_detail'"
                  @click="shopDetailChange"
                >
                  修改样式
                </div>
              </h5ModuleComponent>
            </div>
            <st-draggable
              v-model="modulesData"
              :animation="200"
              @change="dragModule"
              handle=".h5-setting-index-component__slider--canDrag"
            >
              <div
                :class="h5('slider', { canDrag: canDrag })"
                v-for="(item, index) in modulesData"
                :key="index"
                @click="tapModuleItem(item, index)"
              >
                <h5ModuleComponent
                  v-if="!item.module_is_delete && index"
                  :isActive="sliderIndex === index"
                  :moduleInfo="item"
                  @change="moduleItemChange($event, index)"
                  @delete="deleteModuleItem($event, index)"
                  @mouse="mouseEvent($event)"
                ></h5ModuleComponent>
              </div>
            </st-draggable>
          </div>
        </div>
        <div :class="h5('right')">
          <div :class="h5('content')">
            <div :class="h5('phone')">
              <div :class="h5('phone-placeholder')"></div>
              <h5PhoneComponent
                :class="h5('phone-content')"
                :moduleDatas="modulesData"
                :selectIndex="phoneIndex"
                :sliderIndex="sliderIndex"
                :currentShopInfo="currentShopInfo"
                @tapSlide="tapSlide"
              />
            </div>
            <div :class="h5('form')">
              <div :class="h5('form-container')" v-if="modulesData.length">
                <div
                  :class="h5('form-container__no-display')"
                  v-if="!modulesData[sliderIndex].module_is_display"
                >
                  <div :class="h5('form-container__no-display-box')">
                    <st-no-data :text="'该模块已隐藏'" />
                    <p>
                      请点击左侧模块按钮可解除隐藏状态
                    </p>
                  </div>
                </div>
                <component
                  v-else
                  :is="componentList[modulesData[sliderIndex].module_type]"
                  :moduleName="modulesData[sliderIndex].module_name"
                  :maxNum="modulesData[sliderIndex].max_num"
                  v-model="modulesData[sliderIndex].content"
                  :moduleType="modulesData[sliderIndex].module_type"
                  :shopId="shopId"
                  @change="editEmit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script>
import { cloneDeep, omit } from 'lodash-es'
import H5ModuleComponent from './h5-module.component'
import h5ShopListComponent from './h5-shop-list.component'
import h5PhoneComponent from './h5-phone.component'
import { H5SettingIndexService } from './h5-setting-index.service'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import draggable from 'vuedraggable'
import BrandSettingMinaCheckoutShopinfoLayout from '@/views/biz-modals/brand/setting/mina/checkout-shopinfo-layout'

import h5FormShopinfoComponent from './form-components#/h5-form.shopinfo.component'
import h5FormFnComponent from './form-components#/h5-form.fn.component'
import h5FormCoachComponent from './form-components#/h5-form.coach.component'
import h5FormCardComponent from './form-components#/h5-form.card.component'
import h5FormCourseComponent from './form-components#/h5-form.course.component'
import h5FormPackageComponent from './form-components#/h5-form.package.component'
import h5FormCouponComponent from './form-components#/h5-form.coupon.component'
import h5FormInvitationComponent from './form-components#/h5-form.invitation.component'
import h5FormTurntableComponent from './form-components#/h5-form.turntable.component'
import h5FormActivityComponent from './form-components#/h5-form.activity.component'
import h5FormGroupComponent from './form-components#/h5-form.group.component'
import h5FormDiscountComponent from './form-components#/h5-form.discount.component'
import h5FormSeckillComponent from './form-components#/h5-form.seckill.component'
import { MessageService } from '@/services/message.service'

export default {
  name: 'H5SettingIndexComponent',
  components: {
    H5ModuleComponent,
    h5PhoneComponent,
    h5ShopListComponent,
    swiper,
    swiperSlide,
    h5FormShopinfoComponent,
    h5FormFnComponent,
    h5FormCoachComponent,
    h5FormCardComponent,
    h5FormCourseComponent,
    h5FormPackageComponent,
    h5FormCouponComponent,
    h5FormInvitationComponent,
    h5FormTurntableComponent,
    h5FormActivityComponent,
    h5FormGroupComponent,
    h5FormDiscountComponent,
    h5FormSeckillComponent,
    draggable
  },
  bem: {
    h5: 'h5-setting-index-component'
  },
  modals: {
    BrandSettingMinaCheckoutShopinfoLayout
  },
  serviceInject() {
    return {
      messageService: MessageService,
      h5SettingIndexService: H5SettingIndexService
    }
  },
  rxState() {
    return {
      shopList: this.h5SettingIndexService.shopList$,
      currentShopInfo: this.h5SettingIndexService.currentShopInfo$,
      fnModules: this.h5SettingIndexService.fnModules$,
      modulesData: this.h5SettingIndexService.modulesData$,
      marketingModules: this.h5SettingIndexService.marketingModules$,
      loading: this.h5SettingIndexService.loading$
    }
  },
  computed: {
    moduleType: function() {
      return (
        this.modulesData[this.sliderIndex] && this.modulesData[this.sliderIndex]
      )
    }
  },
  data() {
    return {
      draggableOptions: {},
      shopId: '',
      shopActiveIndex: 0,
      sliderIndex: 0,
      phoneIndex: 0,
      componentList: {
        1: 'h5FormShopinfoComponent',
        2: 'h5FormFnComponent',
        3: 'h5FormCoachComponent',
        4: 'h5FormCardComponent',
        5: 'h5FormCourseComponent',
        6: 'h5FormPackageComponent',
        12: 'h5FormCouponComponent',
        13: 'h5FormInvitationComponent',
        14: 'h5FormTurntableComponent',
        15: 'h5FormActivityComponent',
        16: 'h5FormGroupComponent',
        17: 'h5FormDiscountComponent',
        18: 'h5FormSeckillComponent'
      },
      isEditFlag: false,
      canDrag: true
    }
  },
  created() {
    this.init()
  },
  mounted() {},
  watch: {
    sliderIndex(newVal) {
      if (this.$refs.leftModules) {
        this.$refs.leftModules.scrollTop = newVal * 72
      }
    }
  },
  methods: {
    init() {
      this.h5SettingIndexService.getShopList().subscribe(res => {
        if (!!res.list.length) {
          this.getModuleDataAndShopInfo(res.list[0].shop_id)
        }
      })
    },

    // 添加模块
    selectModule(item) {
      let showModuleList = this.modulesData.filter(item => {
        return +!item.module_is_delete
      })
      if (showModuleList.length === 15) {
        return this.messageService.warn({
          content:
            '小程序最多可添加15个功能模块，当前已达数量上限，请在删除模块后再行添加'
        })
      }
      let moduleItem = cloneDeep(item)
      this.modulesData.push(moduleItem)
      this.editEmit()
      setTimeout(() => {
        this.setIndex(this.modulesData.length - 1)
      })
    },
    // 门店信息模块切换样式
    shopDetailChange() {
      this.$modalRouter.push({
        name: 'brand-setting-mina-checkout-shopinfo-layout',
        props: {
          layout: this.modulesData[0].content.show_style
        },
        on: {
          success: e => {
            this.editEmit()
            this.modulesData[0].content.show_style = e
          }
        }
      })
    },
    // 操作了模块
    moduleItemChange(module, index) {
      this.modulesData.splice(index, 1, cloneDeep(module))
      this.editEmit()
    },
    // 删除模块
    deleteModuleItem(module, index) {
      this.editEmit()
      if (+!this.modulesData[index].module_id) {
        // 新模块module_id为0
        this.modulesData.splice(index, 1)
      } else {
        this.modulesData.splice(index, 1, cloneDeep(module))
      }
      console.log(this.modulesData)
      let remainingModules = this.modulesData.slice(index + 1)
      let moduleNoDelete = []
      if (remainingModules.length) {
        remainingModules.forEach(item => {
          if (+!item.module_is_delete) {
            moduleNoDelete.push(item)
          }
        })
      }
      if (moduleNoDelete.length > 0) {
        // 向下查找到没有删除的
        let i = index + 1
        let num = 1
        while (this.modulesData[i].module_is_delete) {
          i++
          num++
        }
        this.sliderIndex = i
        this.phoneIndex = i - num
      } else {
        // 向上查找到没有删除的
        let i = index - 1
        while (this.modulesData[i].module_is_delete) {
          i--
        }
        this.setIndex(i)
      }
    },
    // 拖拽模块
    dragModule(e) {
      this.setIndex(e.moved.newIndex)
      this.editEmit()
    },
    // 点击模块
    tapModuleItem(module, index) {
      this.setIndex(index)
    },
    // 切换了门店
    switchShop(shopId) {
      if (shopId != this.currentShopInfo.id) {
        if (this.isEditFlag) {
          this.$confirm({
            title: '确定要离开？',
            content: '此时离开将丢失已编辑的内容，是否确认离开？',
            onOk: () => {
              this.getModuleDataAndShopInfo(shopId)
              this.editEmit(false)
            }
          })
        } else {
          this.getModuleDataAndShopInfo(shopId)
        }
      }
    },
    // 手机中点击
    tapSlide({ sliderIndex }) {
      this.setIndex(sliderIndex)
    },
    // 获取模块数据和门店详情
    getModuleDataAndShopInfo(shopId) {
      this.shopId = shopId
      this.shopActiveIndex = this.shopList.findIndex(item => {
        return item.shop_id === shopId
      })
      this.h5SettingIndexService
        .getShopModules({ shop_id: shopId, tab_type: '1' })
        .subscribe(res => {
          this.setIndex(0)
        })
      this.h5SettingIndexService.getShopInfo(shopId).subscribe()
      this.h5SettingIndexService.getModules(shopId).subscribe()
    },
    setIndex(index) {
      this.sliderIndex = this.phoneIndex = index
    },
    saveData() {
      let modulesData = cloneDeep(this.modulesData)
      for (let i = 0; i < modulesData.length; i++) {
        if (!modulesData[i].module_is_delete) {
          if (modulesData[i].module_type === 2) {
            let noHasImg = modulesData[i].content.list.find(list => {
              return !Object.keys(list.image).length
            })
            if (noHasImg) {
              this.messageService.warn({
                content: `请上传${modulesData[i].module_name}图片`
              })
              return false
            }
          }
          if (modulesData[i].module_type === 3) {
            if (
              modulesData[i].content.list.length &&
              modulesData[i].content.list.length > modulesData[i].max_num
            ) {
              this.messageService.warn({
                content: `${modulesData[i].module_name}最多添加${modulesData[i].max_num}项`
              })
              return false
            }
          }
        }
      }
      let saveData = modulesData.map(item => {
        item = omit(item, ['is_can_rename', 'is_can_display', 'is_can_delete'])
        if (item.module_type === 3 && !!item.content.list.length) {
          // 教练模块
          let coachList = item.content.list.map(coach => {
            return coach.id
          })
          item.content.list = coachList
        }
        return item
      })
      console.log(saveData)
      this.$confirm({
        title: '',
        content: '确认将当前设置内容发布到小程序？',
        onOk: () => {
          this.h5SettingIndexService
            .saveIndexConfig({
              shop_id: this.shopId,
              tab_type: 1,
              module_list: saveData
            })
            .subscribe(res => {
              this.messageService.success({
                content: '保存成功'
              })
              this.editEmit(false)
              this.getModuleDataAndShopInfo(this.shopId)
              this.setIndex(0)
            })
        }
      })
    },
    editEmit(flag = true) {
      this.isEditFlag = flag
      this.$emit('change', this.isEditFlag)
    },
    mouseEvent(e) {
      this.canDrag = e
    }
  }
}
</script>
