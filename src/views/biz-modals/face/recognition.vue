<template>
  <st-modal
    :title="title"
    :ok-text="okText"
    :okButtonProps="{ props: { disabled: !userImgSrc } }"
    :bodyStyle="{ padding: 0 }"
    :confirmLoading="loading.getMemberCheckResult"
    v-model="show"
    width="484px"
    @ok="uploadUserImageAndQualityTest"
    @cancel="onCancel"
  >
    <a-alert
      slot="prepend"
      message="为保证人脸录入质量，请确保光线充足，以免影响识别精度。"
      type="warning"
      banner
    />
    <div :class="recognition()">
      <div :class="recognition('header')">
        <div :class="recognition('space')">
          <a-spin :spinning="isLoading" :class="recognition('loading')">
            <div :class="recognition('img')">
              <!-- <img :src="userImgSrc" v-show="userImgSrc" /> -->
              <div
                class="user-img-src"
                v-show="userImgSrc"
                :style="{
                  backgroundImage: 'url(' + userImgSrc + ')'
                }"
              ></div>
              <video
                ref="video"
                width="270"
                height="270"
                autoplay
                v-show="!userImgSrc"
              ></video>
              <canvas
                :class="recognition('canvas')"
                ref="canvas"
                width="270"
                height="270"
              ></canvas>
              <img
                src="~@/assets/img/userBitmap.png"
                alt=""
                :class="recognition('userLinePic')"
                v-show="openCameraError && !userImgSrc"
              />
              <img
                src="~@/assets/img/userLinePic.png"
                alt=""
                :class="recognition('userLinePic')"
                v-show="!openCameraError && !userImgSrc"
              />
            </div>
          </a-spin>
          <div :class="recognition('operation')">
            <st-button
              type="primary"
              @click="handlerTakePhoto"
              :disabled="openCameraError"
              class="mg-b8"
            >
              {{ userImgSrc ? '重拍' : '拍照' }}
            </st-button>
            <a-upload
              name="file"
              :showUploadList="false"
              :customRequest="uploadUserImageFormPhoto"
            >
              <st-button>
                {{ userImgSrc ? '重新上传' : '上传照片' }}
              </st-button>
            </a-upload>

            <!-- <div :class="recognition('tips')">
              <div>若录入遇到问题</div>
              <a href="" :class="recognition('question')">请点击此处</a>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </st-modal>
</template>

<script>
import { OssService } from '@/services/oss.service'
import { AppConfig } from '@/constants/config'
import { MessageService } from '@/services/message.service'
import { RecognitionService } from './recognition.service'
import BrowserType from './recognition-browser'
import { get } from 'lodash-es'
export default {
  bem: {
    recognition: 'st-face-recognition'
  },
  serviceInject() {
    return {
      oss: OssService,
      appConfig: AppConfig,
      messageService: MessageService,
      recognitionService: RecognitionService
    }
  },
  rxState() {
    return {
      loading: this.recognitionService.loading$
    }
  },
  props: {
    fileList: {
      type: Array,
      default: () => []
    },
    props: {
      type: Object,
      default: () => ({
        image_id: 'image_id',
        image_key: 'image_key',
        image_url: 'image_url'
      })
    }
  },
  data() {
    return {
      title: '人脸信息录入',
      okText: '确认上传',
      show: false,
      list: this.fileList,
      face: null,
      canvasElm: null,
      confirmLoading: false,
      openCameraError: false, // 开启摄像头失败
      isLoading: false,
      picWidth: 270,
      picHeight: 270,
      canvasCardContext: '',
      canvasCard: ''
    }
  },
  watch: {
    fileList(newList) {
      this.list = this.fileList
      if (this.list.length) {
        this.face = {
          url: this.list[0][this.imageUrl],
          fileKey: this.list[0][this.imageKey]
        }
      }
    },
    'loading.getMemberCheckResult'(v) {
      this.$emit('loadingChange', v)
    },
    progress(v) {
      this.$emit('progressChange', v)
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
    userImgSrc() {
      return get(this.face, 'url', '')
    }
  },
  created() {
    // 现在已不需要在兼容firefox
    // const browserV = BrowserType()
    // if (browserV === 'FF') {
    //   this.picHeight = 202
    // }
    this.createOutCanvas()
  },
  mounted() {
    this.$nextTick(() => {
      if (
        navigator.mediaDevices.getUserMedia ||
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
      ) {
        // 调用用户媒体设备, 访问摄像头
        this.openCamera()
        this.canvasElm = this.$refs.canvas
      } else {
        this.openCameraError = true
        this.face = null
      }
    })
  },
  methods: {
    // 取消人脸识别图片上传
    onCancel() {
      this.show = false
    },
    // 人脸图片上传
    uploadUserImageFormPhoto(data) {
      this.isLoading = true
      this.oss
        .put({
          business: 'face',
          isPrivate: true,
          file: data.file
        })
        .subscribe({
          next: val => {
            console.log('val', val)
            this.face = val
          },
          error: val => {
            this.messageService.error({ content: `Error ${val.message}` })
            this.isLoading = false
          },
          complete: () => {
            this.isLoading = false
          }
        })
    },
    uploadUserImageFormCamera(data) {
      let canvas = this.canvasElm
      canvas.toBlob(blob => {
        this.isLoading = true
        this.oss
          .put({
            file: blob,
            isPrivate: true,
            business: 'face',
            uploadProgress: e => {
              this.progress = parseInt((e.loaded / e.total) * 100)
            }
          })
          .subscribe({
            next: val => {
              this.isLoading = false
              this.face = val
            },
            error: val => {
              this.isLoading = false
              this.messageService.error({ content: `Error ${val.message}` })
            },
            complete: () => {
              // 图片上传成功
              this.isLoading = false
            }
          })
      })
    },
    // 图片质量检测
    uploadUserImageAndQualityTest() {
      let image = this.face
      this.recognitionService
        .getMemberCheckResult({
          image_key: image.fileKey
        })
        .subscribe(res => {
          let isScan = res.is_scan
          if (isScan) {
            let imageId = this.list.length && this.list[0][this.imageId]
            let current = this.list.length && this.list[0]
            if (current) {
              current[this.imageKey] = image.fileKey
            } else {
              this.list.push({
                [this.imageId]: 0,
                [this.imageKey]: image.fileKey,
                [this.imageUrl]: image.url
              })
            }
            this.$emit('change', this.list)
            this.show = false
          } else {
            this.messageService.error({
              content: `上传图片质量不佳,请重新拍照`
            })
            this.face = null
          }
        })
    },
    // 创建人脸照片绘制所需的canvas
    createOutCanvas() {
      this.canvasCard = document.createElement('canvas')
      this.canvasCard.style.opacity = 0
      this.canvasCard.width = this.picWidth
      this.canvasCard.height = this.picHeight
      this.canvasCard.style.width = this.picWidth + 'px'
      this.canvasCard.style.height = this.picHeight + 'px'
      this.canvasCardContext = this.canvasCard.getContext('2d')
      this.canvasCardContext.fillStyle = '#ffffff'
      this.canvasCardContext.fillRect(0, 0, this.picWidth, this.picHeight)
    },
    // 拍照
    handlerTakePhoto() {
      // 如果已有用户头像,则对数组操作,去除当前数据
      if (this.userImgSrc) {
        this.face = null
        return
      }
      // 如果已拍照,显示重拍,点击重新展示相机
      // 如果未拍照,显示为拍照,点击拍照
      let context = this.canvasElm.getContext('2d')
      let video = this.$refs.video
      context.drawImage(video, 0, 0, this.picWidth, this.picHeight)
      //const imgSrc = this.canvasElm.toDataURL('image/png')
      this.canvasCardContext.drawImage(
        this.canvasElm,
        0,
        0,
        this.picWidth,
        this.picHeight,
        0,
        0,
        this.picWidth,
        this.picHeight
      )
      //this.userImgSrc = this.canvasElm.toDataURL('image/png')
      this.uploadUserImageFormCamera()
    },
    // 开启摄像头
    openCamera() {
      if (!navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
          // 首先获取现存的getUserMedia(如果存在)
          let getUserMedia =
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.getUserMedia
          // 有些浏览器不支持，会返回错误信息
          // 保持接口一致
          if (!getUserMedia) {
            this.openCameraError = true
            return Promise.reject(
              new Error('getUserMedia is not implemented in this browser')
            )
          }
          this.openCameraError = false
          // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
      let constraints = {
        video: {
          width: this.picWidth,
          height: this.picHeight
        }
      }
      this.isLoading = true
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(this.CameraOpensuccess)
        .catch(this.CameraOpenerror)
    },
    // 关闭摄像头
    closeCamera() {
      console.log('关闭摄像头')
      if (!this.$refs['video'].srcObject) return
      let stream = this.$refs['video'].srcObject
      let tracks = stream.getTracks()
      tracks.forEach(track => {
        track.stop()
      })
      this.$refs['video'].srcObject = null
    },
    // 摄像头开启成功
    CameraOpensuccess(stream) {
      let video = this.$refs.video
      if ('srcObject' in video) {
        video.srcObject = stream
      } else {
        // 避免在新的浏览器中使用它，因为它正在被弃用。
        video.src = window.URL.createObjectURL(stream)
      }
      let that = this
      video.oncanplay = function(e) {
        console.log('oncanplay')
        that.isLoading = false
      }
      video.onloadedmetadata = function(e) {
        video.play()
        // video.style.transform = 'scaleX(-1)'
      }
    },
    // 摄像呕吐开启失败
    CameraOpenerror(error) {
      console.log(`error message ${error}`)
      this.openCameraError = true
      this.isLoading = false
    },
    // 图片uri转化
    dataURItoBlob(dataURI) {
      // 图片转成Buffer
      let byteString = atob(dataURI.split(',')[1])
      let mimeString = dataURI
        .split(',')[0]
        .split(':')[1]
        .split(';')[0]
      let ab = new ArrayBuffer(byteString.length)
      let ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ab], { type: mimeString })
    }
  },
  beforeDestroy() {
    this.closeCamera()
  }
}
</script>
