<template>
  <div>
    <p>
      [list] 只用于回显 获取变化请使用@change事件 [sizeLimit] 自定义图片大小m
      [numLimit] 最多啊上传图片数量 [placeholder] 自定义文字
      支持图片裁剪，裁剪选项，自定义图片filter,自定义操作区，更多参数参看st-image-upload.vue
    </p>
    <p class="mg-t8">默认样式 单图文件大小2m</p>
    <st-image-upload
      :list="list1"
      :sizeLimit="2"
      @change="onImageChange"
    ></st-image-upload>
    <p class="mg-t8">多张上传</p>
    <st-image-upload
      :list="list1"
      :sizeLimit="2"
      :numLimit="9"
      @change="onImageChange"
    ></st-image-upload>
    {{ list1 }}
    <p class="mg-t8">自定义文字</p>
    <st-image-upload
      :list="list2"
      placeholder="请上传图片"
      @change="onImageChange"
    ></st-image-upload>
    {{ list2 }}
    <p class="mg-t8">使用裁剪 可传入cropper模态窗选项和cropperjs选项参数</p>
    <st-image-upload
      :list="list3"
      placeholder="带裁剪的上传"
      @change="onImageChange"
      :cropperModal="{ title: '标题', cropper: { aspectRatio: 1 / 1 } }"
    ></st-image-upload>
    {{ list3 }}
    <p class="mg-t8">自定义上传区样式</p>
    <st-image-upload :list="list4" @change="onImageChange">
      <st-icon type="wechat"></st-icon>
      请上传拉
    </st-image-upload>
    {{ list4 }}
    <p class="mg-t8">在已上传图片容器新增元素</p>
    <st-image-upload :list="list5" @change="onImageChange">
      <span slot="item-extra" slot-scope="{ item, index }">
        这是extra内容 {{ item }} {{ index }}
      </span>
    </st-image-upload>
    {{ list5 }}
    <p class="mg-t8">自定义操作区内容</p>
    <st-image-upload :list="list6" @change="onImageChange">
      <template slot="actions">
        <span class="action">设为店招</span>
        <span class="action">招聘</span>
      </template>
    </st-image-upload>
    {{ list6 }}
    <p class="mg-t8">自定义预览图片加上水印蒙版，参数maskOptions</p>
    <st-image-upload
      :list="list7"
      :maskOptions="maskOptions"
      @change="onImageChange"
    ></st-image-upload>
    {{ list7 }}
  </div>
</template>

<script>
import StImageUpload from '@/views/components/image-upload#/image-upload.vue'
export default {
  components: {
    StImageUpload
  },
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [
        { image_id: '123', image_key: 'image/20190411/nmdNRC_cVqWSjCNg.png' }
      ],
      list6: [
        { image_id: '123', image_key: 'image/20190411/nmdNRC_cVqWSjCNg.png' }
      ],
      list7: [
        {
          image_id: '123',
          image_url:
            'https://styd-saas-test.oss-cn-shanghai.aliyuncs.com/image/10000/2019-08-01/___d2fbb11a5556___.png'
        }
      ],
      maskOptions: {
        width: 888,
        height: 999,
        maskUrl:
          'https://styd-saas-test.oss-cn-shanghai.aliyuncs.com/image/default/bg-invitation-4.png'
      }
    }
  },
  methods: {
    onImageChange(newList) {
      console.log(newList)
    }
  }
}
</script>
