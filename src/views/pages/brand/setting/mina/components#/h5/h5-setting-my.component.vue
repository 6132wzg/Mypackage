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
    <div :class="h5('wrap')">
      <div :class="h5('left')">
        <div :class="h5('title')">
          <div :class="h5('title--text')" class="color-title mg-b0">
            我的页面模块
          </div>
          <div :class="h5('title--text__tips')" class="color-text-light mg-t16">
            点击可对模块进行隐藏、编辑操作，支持拖动排序
          </div>
        </div>
        <div :class="h5('modules')" v-if="modulesDataString.length">
          <div
            :class="
              h5({
                slider: true,
                select: sliderIndex === 0
              })
            "
            @click="tapModuleItem(modulesDataString[0], -1)"
          >
            <div :class="h5('slider-content')">
              {{ modulesDataString[0].module_name }}
            </div>
          </div>
          <st-draggable
            v-model="modulesDataFilter"
            class="mg-t8"
            :animation="200"
            @change="draggChange"
            handle=".h5-setting-my-component--canDrag"
          >
            <div
              :class="
                h5({
                  'slider-drag': true,
                  'select-drag':
                    sliderIndex === index + 1 && item.is_rename === '1',
                  canDrag: canDrag
                })
              "
              v-for="(item, index) in modulesDataFilter"
              :key="item.id"
              @click="tapModuleItem(item, index)"
            >
              <a-tooltip :class="h5('tooltip-draggable')" placement="top">
                <template slot="title">
                  <span>拖拽调整顺序</span>
                </template>
                <div>
                  <st-icon
                    size="16px"
                    class="tooltip-draggable"
                    type="tuozhuai"
                  />
                </div>
              </a-tooltip>
              <template v-if="item.is_rename === '1'">
                <div
                  :class="[
                    'h5-setting-my-component__slider-content',
                    !item.module_is_display
                      ? 'h5-setting-my-component__slider-is-hide'
                      : ''
                  ]"
                >
                  {{ item.module_name }}
                </div>
                <div :class="h5('slider-icon')">
                  <div
                    :class="h5('slider-icon__edit')"
                    @click.stop="editHandle(index)"
                  >
                    <st-icon
                      size="12px"
                      color="#9BACB9"
                      type="edit"
                      v-if="item.module_tag !== 'member_asset'"
                    />
                  </div>
                  <div :class="h5('slider-icon__space')"></div>
                  <a-tooltip
                    placement="top"
                    v-if="
                      item.module_tag === 'total_course' &&
                        item.module_is_display
                    "
                  >
                    <template slot="title">
                      <span>隐藏</span>
                    </template>
                    <div :class="h5('slider-icon__eye')">
                      <div @click.stop="isHide(index)">
                        <st-icon size="16px" color="#FF5E41" type="eye-show" />
                      </div>
                    </div>
                  </a-tooltip>
                  <a-tooltip
                    placement="top"
                    v-if="
                      item.module_tag === 'total_course' &&
                        !item.module_is_display
                    "
                  >
                    <template slot="title">
                      <span>显示</span>
                    </template>
                    <div :class="h5('slider-icon__eye-hide')">
                      <div @click.stop="isHide(index)">
                        <st-icon size="16px" color="#9bacb9" type="eye-hide" />
                      </div>
                    </div>
                  </a-tooltip>
                </div>
              </template>
              <template v-if="item.is_rename === '2'">
                <div :class="h5('rename-left__wrap')">
                  <st-input
                    :class="h5('rename-left--input')"
                    v-model="item.module_name"
                    @click.stop="editInputHandle"
                    :maxLength="20"
                    @mousemove="canDrag = false"
                    @mouseleave="canDrag = true"
                  ></st-input>
                  <div
                    @click.stop="renameSave(item.module_name, index)"
                    :class="h5('rename-left--save')"
                  >
                    保存
                  </div>
                  <div @click.stop="renameClose(item.module_name, index)">
                    <st-icon
                      color="#cdd4df"
                      :class="h5('rename-left--close')"
                      type="close"
                    />
                  </div>
                </div>
              </template>
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
              :moduleDatas="modulesDataString"
              :selectIndex="sliderIndex"
              :isActive="3"
              :tabSelect="2"
              :sortListParent="modulesDataFilter"
              @tapSlide="tapSlide"
            />
          </div>
          <div :class="h5('form')">
            <div :class="h5('form-container')" v-if="modulesData.length">
              <h5-form-assetsdata-component
                :assetsData="member_asset"
                v-show="sliderIndex === 0"
                @draggChange="assetsdataDraggChange"
                @change="editEmit"
              />
              <div
                v-for="(item, index) in modulesDataFilter"
                :key="item.module_tag"
              >
                <template v-if="item.module_tag === 'total_course'">
                  <h5-form-coursedata-component
                    :courseData="total_course"
                    v-show="sliderIndex === ++index"
                    @change="editEmit"
                  />
                </template>
                <template v-if="item.module_tag === 'more_service'">
                  <h5-form-service-component
                    :serviceData="more_service"
                    v-show="sliderIndex === ++index"
                    @change="editEmit"
                  />
                </template>
              </div>
            </div>
            <div :class="h5('form-arrows')"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash-es'
import h5PhoneComponent from './h5-phone.component'
import { H5SettingMyService } from './h5-setting-my.service'
import { MessageService } from '@/services/message.service'
// 模块组件
import h5FormAssetsdataComponent from './form-components#/h5-form.assetsdata.component'
import h5FormCoursedataComponent from './form-components#/h5-form.coursedata.component'
import h5FormServiceComponent from './form-components#/h5-form.service.component'
import { immerable } from 'immer'
export default {
  name: 'H5SettingMyComponent',
  components: {
    h5PhoneComponent,
    h5FormAssetsdataComponent,
    h5FormServiceComponent,
    h5FormCoursedataComponent
  },
  bem: {
    h5: 'h5-setting-my-component'
  },
  data() {
    return {
      draggableOptions: {},
      sliderIndex: 0,
      member_asset: [],
      total_course: [],
      more_service: [],
      modulesDataString: [],
      modulesDataFilter: [],
      isEditFlag: false,
      canDrag: true
    }
  },
  serviceInject() {
    return {
      messageService: MessageService,
      h5SettingMyService: H5SettingMyService
    }
  },
  rxState() {
    return {
      modulesData: this.h5SettingMyService.modulesData$,
      loading: this.h5SettingMyService.loading$
    }
  },
  created() {
    this.init()
  },
  watch: {
    modulesData: {
      handler(val) {
        console.log('modulesData---', val)
        this.modulesDataString = JSON.parse(JSON.stringify(val))
        this.modulesDataFilter = []
        const list = []
        this.modulesDataString.forEach((ele, i) => {
          this[`${ele.module_tag}`] = ele
          ele.is_rename = '1'
          if (i !== 0) {
            list.push(ele)
          }
        })
        this.modulesDataFilter = JSON.parse(JSON.stringify(list))
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    init() {
      this.h5SettingMyService
        .getShopModules({
          tab_type: '3'
        })
        .subscribe(res => {
          this.sliderIndex = 0
        })
    },
    tapSlide(index) {
      this.sliderIndex = index
      console.log(123, index)
    },
    isHide(index) {
      this.modulesDataFilter[index].module_is_display = +!this
        .modulesDataFilter[index].module_is_display
      this.sliderIndex = index + 1
      this.loopChange()
    },
    tapModuleItem(module, index) {
      this.modulesDataFilter.forEach((val, i) => {
        val.is_rename = '1'
        if (val.is_rename === '2' && i !== index) {
          val.module_name = this.tempModuleName
        }
      })
      console.log(111111111, module, index)
      this.sliderIndex = index + 1
    },
    editInputHandle() {},
    editHandle(index) {
      this.modulesDataFilter.forEach((val, i) => {
        if (i !== index) {
          val.is_rename = '1'
        }
      })
      this.sliderIndex = index + 1
      this.modulesDataFilter[index].is_rename = '2'
      this.tempModuleName = this.modulesDataFilter[index].module_name
    },
    renameSave(name, index) {
      if (!this.modulesDataFilter[index].module_name) {
        this.modulesDataFilter[index].module_name = this.tempModuleName
      }
      this.$delete(this.modulesDataFilter[index], 'is_rename')
      this.$set(this.modulesDataFilter[index], 'is_rename', '1')
      this.loopChange()
      console.log('save--', this.modulesDataFilter, this.modulesDataString)
    },
    renameClose(name, index) {
      this.modulesDataFilter[index].module_name = this.tempModuleName
      this.$delete(this.modulesDataFilter[index], 'is_rename')
      this.$set(this.modulesDataFilter[index], 'is_rename', '1')
      this.loopChange()
    },
    assetsdataDraggChange(list) {
      this.member_asset.content.list = []
      this.member_asset.content.list = list
      this.editEmit()
    },
    submitForm() {
      this.$confirm({
        title: '',
        content: '确认将当前设置内容发布到小程序？',
        onOk: () => {
          const module_list = this.modulesDataString
          module_list.forEach(val => {
            if (val.hasOwnProperty('is_rename')) {
              this.$delete(val, 'is_rename')
            }
          })
          const info = {
            module_list,
            tab_type: '3'
          }
          console.log('info---', info)
          this.h5SettingMyService.postShopModules({ info }).subscribe(res => {
            this.messageService.success({
              content: '保存成功'
            })
            this.editEmit(false)
          })
          console.log('modulesDataString--', this.modulesDataString)
          console.log('modulesDataFilter--', this.modulesDataFilter)
        }
      })
    },
    draggChange(e) {
      this.modulesDataFilter.forEach((val, i) => {
        if (val.is_rename === '2') {
          val.module_name = this.tempModuleName
        }
        val.is_rename = '1'
      })
      this.loopChange()
      this.sliderIndex = ++e.moved.newIndex
      console.log('e----', e, this.modulesDataString, this.modulesDataFilter)
    },
    loopChange() {
      const list = JSON.parse(JSON.stringify(this.modulesDataFilter))
      const stringList = JSON.parse(JSON.stringify(this.modulesDataString))
      list.forEach((ele, i) => {
        stringList.forEach((val, i) => {
          if (ele.module_tag === val.module_tag) {
            ele.content = val.content
          }
        })
      })
      this.modulesDataString.splice(1, 2, ...list)
      this.modulesDataString.forEach((ele, i) => {
        this[`${ele.module_tag}`] = ele
      })
      console.log(
        'loopChange----',
        this.modulesDataString,
        this.modulesDataFilter
      )
      this.editEmit()
    },
    editEmit(flag = true) {
      this.isEditFlag = flag
      this.$emit('change', this.isEditFlag)
    }
  }
}
</script>
