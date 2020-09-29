<template>
  <div :class="h5()">
    <div :class="h5('shop-title')">
      <div :class="h5('shop-title__shop-select')">
        全部场馆
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
    <div :class="h5('content__wrap')">
      <div :class="h5('left')">
        <div :class="h5('title')">
          <div :class="h5('title--text')" class="color-title mg-b0">
            底部导航模块
          </div>
          <div :class="h5('title--text__tips')" class="color-text-light mg-t16">
            该模块不可编辑
          </div>
        </div>
        <div :class="h5('modules')" v-if="modulesData.length">
          <h5ModuleComponent
            :isActive="true"
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
              :isMy="false"
              isActive="3"
            />
          </div>
          <div :class="h5('form')">
            <div :class="h5('form-container')" v-if="modulesDataString.length">
              <h5-form-tabbar-component
                :modulesData="modulesDataString"
                @change="editEmit"
              />
            </div>
            <div :class="h5('form-arrows')"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import h5PhoneComponent from './h5-phone.component'
import { H5SettingTabbarService } from './h5-setting-tabbar.service'
import { MessageService } from '@/services/message.service'
import h5ModuleComponent from './h5-module.component'
// 模块组件
import h5FormTabbarComponent from './form-components#/h5-form.tabbar.component'
export default {
  name: 'H5SettingTabbarComponent',
  components: {
    h5PhoneComponent,
    h5ModuleComponent,
    h5FormTabbarComponent
  },
  bem: {
    h5: 'h5-setting-tabbar-component'
  },
  data() {
    return {
      sliderIndex: 0,
      modulesDataString: [],
      isEditFlag: false
    }
  },
  serviceInject() {
    return {
      messageService: MessageService,
      h5SettingTabbarService: H5SettingTabbarService
    }
  },
  rxState() {
    return {
      modulesData: this.h5SettingTabbarService.modulesData$,
      loading: this.h5SettingTabbarService.loading$
    }
  },
  created() {
    this.init()
  },
  watch: {
    modulesData: {
      handler(val) {
        this.modulesDataString = JSON.parse(JSON.stringify(val))
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    init() {
      this.h5SettingTabbarService
        .getShopModules({ tab_type: '4' })
        .subscribe(res => {
          this.sliderIndex = 0
        })
    },
    submitForm() {
      this.$confirm({
        title: '',
        content: '确认将当前设置内容发布到小程序？',
        onOk: () => {
          const info = {
            tab_type: '4',
            module_list: this.modulesDataString
          }
          this.h5SettingTabbarService
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
