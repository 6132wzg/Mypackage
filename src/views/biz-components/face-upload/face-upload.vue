<template>
  <div class="st-face-upload" v-viewer="{ url: 'data-src', toolbar: false }">
    <div
      class="st-face-upload__item st-preview-item"
      v-for="(item, index) in fileList"
      :key="index"
    >
      <img
        class="st-face-upload__item-img"
        :src="item[imageUrl] || item[imageKey]"
        :data-src="item[imageUrl] || item[imageKey]"
        :style="sizeStyle"
      />
      <slot name="item-extra" :item="item" :index="index"></slot>
    </div>

    <div
      class="st-face-upload__face"
      @click="handlerOpenFaceModal"
      v-show="isShowFaceUpload"
    >
      <div class="container">
        <a-spin :spinning="isLoading" :tip="progress + '%'">
          <a-icon
            type="plus-circle"
            theme="filled"
            :style="{ fontSize: '36px', color: '#9BACB9' }"
          />
          <div class="placeholder">{{ placeholder }}</div>
        </a-spin>
      </div>
    </div>
    <div
      class="st-face-upload__actions"
      v-if="$slots.actionContent || (fileList.length && actionAuth)"
    >
      <slot name="actionContent"></slot>
      <slot name="actions">
        <span
          class="action"
          @click.stop="onDel"
          v-if="fileList.length && actionAuth"
        >
          删除
        </span>
      </slot>
    </div>
  </div>
</template>
<script>
import { OssService } from '@/services/oss.service'
import { AppConfig } from '@/constants/config'
import { MessageService } from '@/services/message.service'
import FaceRecognition from '@/views/biz-modals/face/recognition'
const defaultSize = {
  w: '182px',
  h: '114px'
}
export default {
  name: 'StFaceUpload',
  serviceInject() {
    return {
      oss: OssService,
      appConfig: AppConfig,
      messageService: MessageService
    }
  },
  modals: {
    FaceRecognition
  },
  props: {
    numLimit: {
      type: Number,
      default: 1
    },
    /**
     * 上传按钮的文字
     */
    placeholder: {
      type: String,
      default: '上传照片'
    },
    /**
     * 图片及上传按钮的宽度
     */
    width: {
      type: String,
      default: defaultSize.w
    },
    /**
     * 图片及上传按钮的宽度
     */
    height: {
      type: String,
      default: defaultSize.h
    },
    /**
     * 初始图片列表 example: [{ image_id: 10000, image_key: 'http://styd-saas-test.oss-cn-shanghai.aliyuncs.com/image/pLOFb5kCPN4gPQ8H',image_url:'http://...' }]
     */
    list: {
      type: Array,
      default: () => []
    },
    /**
     * 缩略图filter选项 同imgFilter选项
     */
    filterOptions: {
      type: Object,
      default: () => ({})
    },
    /**
     * 后端字段映射 image_id,image_key,image_url
     */
    props: {
      type: Object,
      default: () => ({
        image_id: 'image_id',
        image_key: 'image_key',
        image_url: 'image_url'
      })
    },
    faceEditAuth: {
      type: Boolean,
      default: true
    },
    actionAuth: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      fileList: this.list,
      isLoading: false,
      progress: 0,
      isShowFaceUpload: true
    }
  },
  computed: {
    imageId() {
      return this.props.image_id
    },
    imageKey() {
      return this.props.image_key
    },
    imageUrl() {
      return this.props.image_url
    },
    sizeStyle() {
      return `width: ${this.width};  height: ${this.height}`
    },
    computedFilterOptions() {
      const w = parseInt(this.width) * 2
      const h = parseInt(this.height) * 2
      return Object.assign({ w, h }, this.filterOptions)
    }
  },
  watch: {
    list: {
      handler(newList) {
        console.log('newList', newList)
        this.isShowFaceUpload = this.list.length < this.numLimit
        this.fileList = this.list
      },
      immediate: true
    }
  },
  methods: {
    handlerOpenFaceModal() {
      if (!this.faceEditAuth) {
        this.messageService.error({ content: '无权限' })
        return false
      }
      this.$modalRouter.push({
        name: 'face-recognition',
        props: {
          fileList: this.fileList
        },
        on: {
          change: this.onChange,
          processChange: this.processChange,
          loadingChange: this.loadingChange
        }
      })
    },
    onDel() {
      const { fileList } = this
      const deletedFile = fileList.splice(0, 1)
      this.fileList = fileList
      this.$emit('delete', deletedFile[0])
      this.$emit('change', this.fileList)
    },
    onChange(list) {
      this.fileList = list
      this.isShowFaceUpload = this.fileList.length < this.numLimit
      this.$emit('change', this.fileList)
    },
    processChange(processNum) {
      this.progress = processNum
    },
    loadingChange(status) {
      this.isLoading = status
    }
  }
}
</script>
