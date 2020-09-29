<template>
  <div :class="module()">
    <div v-show="courseData.module_is_display">
      <div :class="module('title')">{{ courseData.module_name }}</div>
      <div :class="module('desc')">
        <div :class="module('desc__text')">文案设置</div>
        <div :class="module('desc__content')">
          <div :class="module('desc__content__wrap')">
            本周
            <st-input
              v-model="list.exercise_title"
              :class="module('desc__input')"
              :placeholder="list.default_title"
              :maxLength="5"
              width="130px"
              @click="changeData"
            ></st-input>
            0分钟
          </div>
        </div>
      </div>
      <div :class="module('upload-wrap')">
        <div :class="module('desc__text')">背景图</div>
        <div :class="module('upload-bg')">
          <div :class="module('upload__img')">
            <st-image-upload
              :list="[list.image]"
              width="382px"
              height="102px"
              placeholder="修改图片"
              :cropperModal="{
                title: '背景图片裁切',
                cropper: { aspectRatio: 382 / 102 }
              }"
              @change="
                image => {
                  onImageChange(image)
                }
              "
              @delete="
                image => {
                  onImageDelete(image)
                }
              "
            ></st-image-upload>
          </div>
          <div :class="module('upload__img-tips')">建议上传比例 15:4</div>
        </div>
      </div>
    </div>
    <div v-show="!courseData.module_is_display">
      <div :class="module('form-container__no-display')">
        <div :class="module('form-container__no-display-box')">
          <st-no-data :text="'该模块已隐藏'" style="margin: 0;" />
          <p>
            请点击左侧模块按钮可解除隐藏状态
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import StImageUpload from '@/views/components/image-upload#/image-upload.vue'
export default {
  name: 'h5FormCoursedataComponent',
  bem: {
    module: 'h5-form-coursedata-component'
  },
  components: { StImageUpload },
  props: {
    courseData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  watch: {
    courseData: {
      handler(newVal) {
        this.list = newVal.content
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      list: []
    }
  },
  methods: {
    onImageChange(image) {
      if (image.length === 0) return
      this.list.image.image_url = image[0].image_url
      this.changeData()
    },
    onImageDelete(image) {
      this.changeData()
    },
    changeData() {
      this.$emit('change')
    }
  }
}
</script>
