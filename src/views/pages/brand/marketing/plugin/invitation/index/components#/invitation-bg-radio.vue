<template>
  <div :class="cardRadio()">
    <a-radio-group v-model="radioIndex">
      <a-radio
        v-for="(i, index) in cardBgList"
        :class="i.className"
        :key="index"
        :value="i.index"
      ></a-radio>
      <a-radio :value="0">自定义背景</a-radio>
    </a-radio-group>
    <div :class="cardRadio('image')">
      <img
        v-if="radioIndex !== 0 && cardBgList[bgIndex]"
        v-viewer="{ url: 'data-src', toolbar: false }"
        :src="cardBgList[bgIndex].image_url | imgFilter({ w: 192, h: 108 })"
        :data-src="cardBgList[bgIndex].image_url | imgFilter({ w: 1000 })"
        width="192"
        height="108"
        alt="邀请有礼背景"
      />
      <div v-else :class="cardRadio('upload')">
        <st-image-upload
          @change="imageUploadChange"
          width="192px"
          height="108px"
          :cropperModal="cropperModal"
          :maskOptions="maskOptions"
          :list="fileList"
          :sizeLimit="2"
          placeholder="上传照片"
        ></st-image-upload>
        <div :class="cardRadio('describe')">
          <p>
            <span>1.</span>
            <span>
              图片格式必须为：png,bmp,jpeg,jpg,gif,建议使用png格
              式图片，以保存最佳效果
            </span>
          </p>
          <p>
            <span>2.</span>
            <span>建议尺寸为750像素X1334像素， 不可大于2M</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import StImageUpload from '@/views/components/image-upload#/image-upload.vue'
import { cloneDeep } from 'lodash-es'
import { UserService } from '@/services/user.service'
let className = [
  'first custom',
  'second custom',
  'third custom',
  'fourth custom'
]
export default {
  name: 'StInvitationBgRadio',
  bem: {
    cardRadio: 'invitation-bg-radio'
  },
  components: {
    StImageUpload
  },
  serviceInject() {
    return {
      userService: UserService
    }
  },
  rxState() {
    return {
      pluginEnums: this.userService.getOptions$('plugin.invite_poster')
    }
  },
  created() {
    this.init()
  },
  computed: {
    bgIndex() {
      return this.radioIndex === 0 ? 4 : this.radioIndex - 1
    },
    cardBgList() {
      let arr = []
      this.invite_poster.forEach((item, index) => {
        item.className = className[index]
        item.index = ++index
        arr.push(item)
      })
      return arr
    }
  },
  data() {
    return {
      // 截图参数对象
      cropperModal: {
        cropper: {
          aspectRatio: 3 / 5
        }
      },
      maskOptions: {
        flag: true,
        width: 750,
        height: 1334,
        maskUrl:
          'https://styd-saas-test.oss-cn-shanghai.aliyuncs.com/image/default/bg-invitation-4.png'
      },
      invite_poster: this.pluginEnums,
      // 备份
      list: [],
      // radioIndex
      radioIndex: 1,
      // 选择的cardBg
      cardBg: {
        image_id: 0,
        image_key: this.pluginEnums[0].image_key,
        image_url: this.pluginEnums[0].image_url,
        index: 1
      },
      // 自定义cardBg
      customCardBg: {
        image_id: 0,
        image_key: '',
        image_url: '',
        index: 0
      },
      // 回显的自定义bg
      fileList: []
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.setdata(newVal)
      },
      deep: true
    },
    radioIndex(newVal) {
      if (newVal === 0) {
        this.cardBg = cloneDeep(this.customCardBg)
      } else {
        let i = newVal
        --i
        this.cardBg = cloneDeep(this.invite_poster[i])
        this.cardBg.index = newVal
      }
      this.$emit('input', this.cardBg)
      this.$emit('change', this.cardBg)
    }
  },
  props: {
    value: {
      type: Object,
      default() {
        return {
          image_id: 0,
          image_key: '',
          image_url: '',
          index: 1
        }
      }
    }
  },
  mounted() {
    this.setRadioColor()
  },
  methods: {
    init() {
      this.list = cloneDeep(this.invite_poster)
      this.setdata(this.value)
    },
    setRadioColor() {
      let innerHTML = ''
      this.cardBgList.forEach(i => {
        innerHTML += `
          .invitation-bg-radio .${i.className.split('custom')[0]}
          .ant-radio-inner::after {
            background-color: ${i.color};
          }
        `
      })
      let style = document.createElement('style')
      style.innerHTML = innerHTML
      document.head.appendChild(style)
    },
    setdata(data) {
      this.radioIndex = data.index
      if (data.index === 0) {
        this.customCardBg = cloneDeep(data)
        if (data.image_url) {
          this.fileList = [
            {
              image_id: data.image_id,
              image_url: data.image_url
            }
          ]
        }
      } else {
        this.invite_poster = cloneDeep(this.list)
        let i = data.index
        --i
        this.invite_poster[i].image_id = data.image_id
      }
    },
    imageUploadChange(fileList) {
      if (fileList.length) {
        this.customCardBg = {
          image_id: fileList[0].image_id,
          image_key: fileList[0].image_key,
          image_url: fileList[0].image_url,
          image_host: fileList[0].image_host,
          index: 0
        }
      } else {
        this.fileList = []
        this.customCardBg = {
          image_id: 0,
          image_key: '',
          image_url: '',
          image_host: '',
          index: 0
        }
      }
      this.cardBg = cloneDeep(this.customCardBg)
      this.$emit('input', this.cardBg)
      this.$emit('change', this.cardBg)
    }
  }
}
</script>
