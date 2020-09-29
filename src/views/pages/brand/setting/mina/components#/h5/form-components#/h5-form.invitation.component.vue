<template>
  <div :class="module()">
    <div :class="module('title')">
      <div :class="module('title-text')">{{ moduleName }}</div>
    </div>
    <div :class="module('content')">
      <div :class="module('content-label')">选择活动</div>
      <div :class="module('content-desc')">
        最多添加{{ maxNum }}个活动，点击可更换邀请有礼活动封面
      </div>
      <a-alert
        class="mg-t16"
        v-if="value.is_open === 0"
        message="活动暂未开启,请至“营销中心-营销插件-邀请有礼-设置”中开启活动"
        banner
      ></a-alert>
      <template v-else>
        <div
          v-for="(item, index) in value.list"
          :key="index"
          :class="invitation('select')"
        >
          <st-image-upload
            :sizeLimit="5"
            :list="Object.keys(item.image).length ? [item.image] : []"
            :filterOptions="{ w: 750, h: 200 }"
            width="466px"
            height="124px"
            placeholder="上传图片"
            :cropperModal="{
              title: '活动图片裁切',
              cropper: { aspectRatio: 466 / 124 }
            }"
            @change="onImageChange($event, index)"
          ></st-image-upload>
          <div :class="invitation('name')">
            {{ item.activity_name }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import mixin from './mixin'
import StImageUpload from '@/views/components/image-upload#/image-upload.vue'
export default {
  name: 'h5FormInvitationComponent',
  mixins: [mixin],
  bem: {
    module: 'h5-form-component',
    invitation: 'h5-form-invitation-component'
  },
  components: {
    StImageUpload
  }
}
</script>
