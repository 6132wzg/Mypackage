<template>
  <div :class="module()">
    <div :class="module('title')">
      <div :class="module('title-text')">{{ moduleName }}</div>
    </div>
    <div :class="module('content')">
      <div :class="module('content-label')">选择活动</div>
      <div :class="module('content-desc')">
        最多添加{{ maxNum }}个活动，点击可更换大转盘活动封面
      </div>
      <!-- 未选择 -->
      <!-- @open="onCustomAction" -->
      <div
        :class="module('add')"
        class="h5-form-turntable-component__add"
        v-if="!value.list.length"
        @click="onModalOpen"
      >
        <st-icon type="add" size="14px" color="rgba(62, 77, 92, 1)" />
        <div :class="module('add-label')">选择活动</div>
      </div>
      <!-- 已选择 -->
      <a-alert
        class="mg-t16"
        v-else
        message="当前数量已达上限，可在删除后重新添加"
        banner
      ></a-alert>
      <div
        v-for="(item, index) in value.list"
        :key="index"
        :class="turntable('select')"
      >
        <div :class="module('del')" @click="onDel(index)">
          <st-icon type="delete" color="#FF5E41" size="16px" />
        </div>
        <st-image-upload
          :sizeLimit="5"
          :list="Object.keys(item.image).length ? [item.image] : []"
          :filterOptions="{ w: 750, h: 200 }"
          width="466px"
          height="124px"
          placeholder="选择活动"
          :cropperModal="{
            title: '活动图片裁切',
            cropper: { aspectRatio: 466 / 124 }
          }"
          @change="onImageChange($event, index)"
        ></st-image-upload>
        <div :class="module('name')">{{ item.activity_name }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import mixin from './mixin'
import LuckyWheelTableSelect from '@/views/biz-modals/plugin/wheel/lucky-wheel-table-select'
import StImageUpload from '@/views/components/image-upload#/image-upload.vue'
export default {
  name: 'h5FormTurntableComponent',
  mixins: [mixin],
  modals: {
    LuckyWheelTableSelect
  },
  bem: {
    module: 'h5-form-component',
    turntable: 'h5-form-turntable-component'
  },
  components: {
    StImageUpload
  },
  data() {
    return {
      idKeyName: 'activity_id',
      modalConfig: {
        title: '选择大转盘活动',
        max: this.maxNum
      }
    }
  },
  methods: {
    adaptor(selectedRows) {
      return selectedRows.map(item => {
        return {
          activity_id: item.activity_id,
          activity_name: item.activity_name,
          image: item.image
        }
      })
    },
    onModalOpen() {
      const { title, max } = this.modalConfig
      this.$modalRouter.push({
        name: 'lucky-wheel-table-select',
        props: {
          defaultSelectedRowKeys: this.selectedRowKeys,
          defaultSelectedRows: this.value.list,
          rowMapKey: this.idKeyName,
          title,
          max,
          defalutQuery: {
            shop_id: this.shopId
          }
        },
        on: {
          complete: res => {
            if (typeof this.adaptor === 'function') {
              this.value.list = this.adaptor(res.selectedRows)
              this.onChange()
            }
          }
        }
      })
    }
  }
}
</script>
