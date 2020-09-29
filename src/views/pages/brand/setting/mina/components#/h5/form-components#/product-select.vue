<template>
  <div :class="module('content')">
    <div :class="module('content-label')">{{ title }}</div>
    <div :class="module('content-desc')">
      {{ desc }}
    </div>
    <a-alert
      class="mg-t16"
      v-if="value.list.length > maxNum - 1"
      message="当前数量已达上限，可在删除后重新添加"
      banner
    ></a-alert>
    <st-form class="mg-t16">
      <div
        :class="module('box')"
        class="h5-form-component__add"
        @click="openModal"
        v-if="value.list.length < maxNum"
      >
        <st-icon type="add" size="14px" color="rgba(62, 77, 92, 1)" />
        <div :class="module('add-label')">{{ placeholder }}</div>
      </div>
      <st-draggable
        v-model="value.list"
        :animation="200"
        :class="module('draggable-wrap')"
        @change="onChange"
      >
        <div
          v-for="(item, index) in value.list"
          :key="index"
          :class="module('box')"
          style="cursor: move;"
        >
          <div :class="module('del')" @click="delectItem(index)">
            <st-icon type="delete" color="#FF5E41" size="16px" />
          </div>
          <img
            :class="module('bg')"
            style="object-fit: cover;"
            :src="imgFilter(item.image_url, { w: 180, h: 100 })"
            width="180"
            height="100"
          />
          <div :class="module('name')" class="text-overflow">
            {{ getViewName(item) }}
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
    </st-form>
  </div>
</template>
<script>
import { imgFilter } from '@/filters/resource.filters'

export default {
  name: 'ProductSelect',
  bem: {
    module: 'h5-form-component'
  },
  props: {
    fieldName: {
      type: String, //字段名称,
      required: true
    },
    title: {
      type: String,
      default: '选择活动'
    },
    desc: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '选择活动'
    },
    maxNum: {
      type: Number
    },
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    imgFilter,
    getViewName(item) {
      return item[this.fieldName]
    },
    openModal() {
      this.$emit('open')
    },
    delectItem(index) {
      this.$emit('delete', index)
    },
    onChange() {
      this.$emit('drag')
    }
  }
}
</script>
