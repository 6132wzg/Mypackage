<template>
  <div :class="module()">
    <div :class="module('title')">{{ moduleName }}</div>
    <div :class="module('desc')">
      <div :class="module('desc-title')">添加图片</div>
      <div :class="module('desc-text')">
        拖动模块进行排序，最多添加{{
          maxNum
        }}张，建议尺寸750x360像素，尺寸比例不匹配时，图片将被压缩拉伸以铺满画面
      </div>
    </div>
    <a-alert
      class="mg-t16"
      v-if="value.list.length > maxNum - 1"
      message="当前数量已达上限，可在删除后重新添加"
      banner
    ></a-alert>
    <div :class="module('list')">
      <st-form>
        <div :class="module('box')" v-if="value.list.length < maxNum">
          <st-image-upload
            :class="module('upload')"
            width="180px"
            height="100px"
            @change="imageUploadChange"
            :sizeLimit="5"
            :list="[]"
            placeholder="添加轮播图"
            :cropperModal="{
              title: '图片裁切',
              cropper: { aspectRatio: 16 / 9 }
            }"
          />
          <div :class="module('cascader')">
            <custom-link
              :class="module('form-link-input')"
              :modules="pathList"
              style="width: 100%;"
              @change="addLink($event)"
            ></custom-link>
          </div>
        </div>
        <st-draggable
          v-model="value.list"
          :animation="200"
          :class="module('draggable-wrap')"
          @change="change"
        >
          <div
            v-for="(li, index) in value.list"
            :key="index"
            :class="module('box')"
            style="cursor: move"
          >
            <div :class="module('edit-img')">
              <st-image-upload
                placeholder="修改轮播图"
                width="180px"
                height="100px"
                :list="[li.image]"
                :filterOptions="{ w: 750, h: 422 }"
                @change="updateImg($event, index)"
                :cropperModal="{
                  title: '轮播图片裁切',
                  cropper: { aspectRatio: 16 / 9 }
                }"
              ></st-image-upload>
              <div :class="module('del')" @click="deleteImg(index)">
                <st-icon type="delete" color="#FF5E41" size="16px" />
              </div>
            </div>
            <div :class="module('cascader')">
              <custom-link
                :class="module('form-link-input')"
                :modules="pathList"
                @change="handleLinkChange($event, index)"
                :link="Object.keys(li.link).length ? li.link : {}"
                style="width: 100%;"
              ></custom-link>
            </div>
            <a-tooltip :class="module('draggable-icon')" placement="top">
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
          </div>
        </st-draggable>
      </st-form>
    </div>
  </div>
</template>
<script>
import StImageUpload from '@/views/components/image-upload#/image-upload.vue'
import { cloneDeep, omit } from 'lodash-es'
import CustomLink from '@/views/biz-components/custom-link/custom-link.vue'
import { H5SettingIndexService } from '../h5-setting-index.service'
import { MessageService } from '@/services/message.service'

export default {
  name: 'h5FormShopinfoComponent',
  bem: {
    module: 'h5-form-shopinfo-component'
  },
  components: {
    StImageUpload,
    CustomLink
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          list: []
        }
      }
    },
    moduleName: {
      type: String
    },
    maxNum: {
      type: Number,
      default: 6
    }
  },
  data() {
    return {
      draggableOptions: {
        filter: '.ignore-elements'
      },
      pathList: [],
      addItem: {}
    }
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
    imageUploadChange(fileList) {
      this.addItem = {
        image: fileList[0],
        link: this.addItem.link || {}
      }
      this.value.list.push(this.addItem)
      this.change()
      this.addItem = {}
    },
    updateImg(e, index) {
      if (e.length) {
        this.value.list[index].image = e[0]
        this.change()
      }
    },
    deleteImg(index) {
      if (this.value.list.length < 2) {
        return this.messageService.warn({
          content: '至少添加一张轮播图'
        })
      }
      this.value.list.splice(index, 1)
      this.change()
    },
    handleLinkChange(link, index) {
      this.value.list[index].link = link
      this.change()
    },
    addLink(link) {
      this.addItem['link'] = link
    },
    change() {
      this.$emit('change')
    }
  }
}
</script>
