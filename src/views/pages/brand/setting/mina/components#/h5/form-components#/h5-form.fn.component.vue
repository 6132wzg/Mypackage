<template>
  <div :class="module()">
    <div :class="module('title')">
      <div :class="module('title-text')">{{ moduleName }}</div>
    </div>
    <div :class="module('radio')">
      <div :class="module('radio-title')">每行数量</div>
      <a-radio-group v-model="value.row_num">
        <a-radio v-for="i in 4" :key="i" :value="i + 1">{{ i + 1 }}</a-radio>
      </a-radio-group>
      <div :class="module('radio-desc')">
        最多添加{{
          maxNum
        }}个功能，建议尺寸360x360像素，尺寸比例不匹配时，图片将被裁剪以铺满画面
      </div>
    </div>
    <div :class="module('form')">
      <st-button
        block
        type="dashed"
        icon="add"
        @click="addFnMenu"
        :class="fn('add')"
        v-if="value.list.length < maxNum"
      >
        添加一个
      </st-button>
      <a-alert
        v-else
        message="当前数量已达上限，可在删除后重新添加"
        banner
      ></a-alert>
      <st-draggable
        v-model="value.list"
        :animation="200"
        @change="changeFn"
        handle=".h5-form-fn-component__form-item--canDrag"
      >
        <div
          :class="module('form-item', { canDrag: canDrag })"
          v-for="(item, index) in value.list"
          :key="index"
        >
          <div :class="module('form-img')">
            <st-image-upload
              :list="Object.keys(item.image).length ? [item.image] : []"
              :filterOptions="{ w: 96, h: 96 }"
              @change="updateImg($event, index)"
              width="88px"
              height="88px"
              :cropperModal="{
                title: '轮播图片裁切',
                cropper: { aspectRatio: 1 / 1 }
              }"
            ></st-image-upload>
          </div>
          <div :class="module('form-input')">
            <div :class="module('form-name')" class="mg-b8">
              <div :class="module('form-name-label')">名称：</div>
              <st-input
                :class="module('form-name-input')"
                v-model="item.title"
                :maxLength="20"
                @change="changeFn"
                @mousemove="canDrag = false"
                @mouseleave="canDrag = true"
              />
            </div>
            <div :class="module('form-link')">
              <div :class="module('form-link-label')">链接：</div>
              <custom-link
                :class="module('form-link-input')"
                :modules="pathList"
                :link="item.link"
                @change="handleLinkChange($event, index)"
                style="width: 100%;"
              ></custom-link>
            </div>
          </div>
          <div :class="module('form-delete')" @click="deleteFn(index)">
            <st-icon type="delete" color="#FF5E41" size="16px" />
          </div>
          <a-tooltip :class="module('draggable-icon')" placement="top">
            <template slot="title">
              <span>拖拽调整顺序</span>
            </template>
            <div>
              <st-icon size="16px" class="tooltip-draggable" type="tuozhuai" />
            </div>
          </a-tooltip>
        </div>
      </st-draggable>
    </div>
  </div>
</template>
<script>
import StImageUpload from '@/views/components/image-upload#/image-upload.vue'
import CustomLink from '@/views/biz-components/custom-link/custom-link.vue'
import { cloneDeep } from 'lodash-es'
import { H5SettingIndexService } from '../h5-setting-index.service'
import { MessageService } from '@/services/message.service'

export default {
  name: 'h5FormFnComponent',
  bem: {
    module: 'h5-form-component',
    fn: 'h5-form-fn-component'
  },
  props: {
    value: {
      type: Object
    },
    moduleName: {
      type: String,
      default: '功能入口'
    },
    maxNum: {
      type: Number,
      default: 15
    }
  },
  data() {
    return {
      pathList: [],
      canDrag: true
    }
  },
  components: {
    StImageUpload,
    CustomLink
  },
  serviceInject() {
    return {
      h5SettingIndexService: H5SettingIndexService,
      messageService: MessageService
    }
  },
  mounted() {
    this.h5SettingIndexService.getPathList().subscribe(res => {
      this.pathList = res.list
    })
  },
  methods: {
    addFnMenu() {
      this.value.list.unshift({
        image: {},
        title: '',
        link: {}
      })
      this.changeFn()
    },
    updateImg(e, index) {
      if (e.length) {
        this.value.list[index].image = e[0]
        this.changeFn()
      }
    },
    deleteFn(index) {
      if (this.value.list.length < 3) {
        return this.messageService.warn({
          content: '至少添加2项功能入口'
        })
      }
      this.value.list.splice(index, 1)
      this.changeFn()
    },
    handleLinkChange(link, index) {
      this.value.list[index].link = link
      this.changeFn()
    },
    changeFn() {
      this.$emit('change')
    }
  }
}
</script>
