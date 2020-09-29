<template>
  <div :class="module()">
    <div :class="module('title')">底部导航</div>
    <div :class="module('desc')">
      点击自定义上传图标
    </div>
    <div :class="module('list')">
      <div :class="module('box-wrap')">
        <div v-for="(li, index) in list" :key="index">
          <div :class="module('box')">
            <div :class="module('box-title')">
              <span>{{ li.default_title }}</span>
              <st-checkbox
                :class="module('checked')"
                :value="li.checked"
                @change="onClick(index)"
                v-if="li.default_title === '云店'"
              ></st-checkbox>
            </div>
            <div :class="module('content')">
              显示名称：
              <st-input
                v-model="li.title"
                :class="module('input')"
                :placeholder="li.default_title"
                :maxLength="5"
                width="64%"
                @click="changeData"
              ></st-input>
            </div>
            <div :class="module('upload-box')">
              <div :class="module('upload-content')">
                <st-image-upload
                  @change="imageUploadChange($event, index)"
                  width="98px"
                  height="98px"
                  :list="[li.icon]"
                  :sizeLimit="2"
                  :props="options"
                  placeholder="上传照片"
                  :cropperModal="{
                    title: '未选中',
                    cropper: { aspectRatio: 1 / 1 }
                  }"
                ></st-image-upload>
                <p :class="module('upload__text')">未选中</p>
              </div>
              <div>
                <st-image-upload
                  @change="selectedImageUploadChange($event, index)"
                  width="98px"
                  height="98px"
                  :list="[li.selected_icon]"
                  :props="options_selected"
                  :sizeLimit="2"
                  placeholder="上传照片"
                  :cropperModal="{
                    title: '已选中',
                    cropper: { aspectRatio: 1 / 1 }
                  }"
                ></st-image-upload>
                <p :class="module('upload__text')">已选中</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import StImageUpload from '@/views/components/image-upload#/image-upload.vue'

export default {
  name: 'h5FormTabbarComponent',
  bem: {
    module: 'h5-form-tabbar-component'
  },
  components: {
    StImageUpload
  },
  props: {
    modulesData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  watch: {
    modulesData: {
      handler(newVal) {
        if (newVal.length === 0) return
        this.list = newVal[0].content.list
        this.list = newVal[0].content.list
        this.module_name = newVal[0].module_name
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      list: [],
      options: {
        image_id: 'image_id',
        image_key: 'icon_key',
        image_url: 'image_url'
      },
      options_selected: {
        image_id: 'image_id',
        image_key: 'selected_icon_key',
        image_url: 'image_url'
      },
      module_name: ''
    }
  },
  methods: {
    onClick(index) {
      this.list[index].checked = +!this.list[index].checked
      this.changeData()
    },
    imageUploadChange(e, index) {
      if (e.length === 0) return
      this.list[index].icon.image_url = e[0].image_url
    },
    selectedImageUploadChange(e, index) {
      if (e.length === 0) return
      this.list[index].selected_icon.image_url = e[0].image_url
    },
    changeData() {
      this.$emit('change')
    }
  }
}
</script>
