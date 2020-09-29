<template>
  <div :class="reserve()">
    <st-plugin-form-title>
      预约课程类型
      <span slot="sub-title"></span>
    </st-plugin-form-title>
    <a-row :gutter="12">
      <draggable v-model="list" @change="onAreaSortChange">
        <a-col :span="6" v-for="(li, index) in list" :key="index">
          <div :class="reserve('box')">
            <div :class="reserve('box-title')">
              <span>{{ li.default_title }}</span>
              <st-checkbox
                :class="reserve('checked')"
                :value="li.checked"
                @change="onClick(index)"
              ></st-checkbox>
            </div>
            <div :class="reserve('content')">
              名称：
              <a-input
                v-model="li.module_title"
                :class="reserve('input')"
                maxlength="5"
              ></a-input>
            </div>
          </div>
        </a-col>
      </draggable>
    </a-row>
  </div>
</template>
<script>
import { H5WrapperService } from './h5-wrapper.service'
import { cloneDeep } from 'lodash-es'
export default {
  bem: {
    reserve: 'reserve-component'
  },
  serviceInject() {
    return {
      h5WrapperService: H5WrapperService
    }
  },
  rxState() {
    return {
      reserveInfo: this.h5WrapperService.reserveInfo$
    }
  },
  data() {
    return {
      list: [],
      checkedList: []
    }
  },
  mounted() {
    console.log('reserveInfo---', this.reserveInfo)
    this.list = cloneDeep(this.reserveInfo)
    this.getCheckedList()
  },
  watch: {
    list: {
      deep: true,
      handler(newVal) {
        this.h5WrapperService.SET_H5INFO(newVal, 6)
      }
    },
    checkedList: {
      deep: true,
      handler(newVal) {
        this.h5WrapperService.SET_H5INFO(newVal, 10)
      }
    }
  },
  methods: {
    onClick(index) {
      let checked = +this.list[index]['checked']
      if (!checked) {
        this.list[index]['checked'] = 1
      } else {
        this.list[index]['checked'] = 0
      }
      this.getCheckedList()
    },
    onAreaSortChange() {
      this.getCheckedList()
    },
    getCheckedList() {
      this.checkedList = this.list.filter(item => item.checked)
    }
  }
}
</script>
