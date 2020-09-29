<template>
  <div :class="module()">
    <div :class="module('title')">
      <div :class="module('title-text')">{{ moduleName }}</div>
    </div>
    <div :class="module('direction')">
      <div :class="module('direction-label')">显示方式</div>
      <a-radio-group
        :options="directionOptions"
        v-model="show_direction"
        @change="onChange"
      ></a-radio-group>
    </div>
    <div :class="module('content')">
      <div :class="module('content-label')">选择优惠券</div>
      <div :class="module('content-desc')">
        最多添加{{ maxNum }}个活动，拖动卡片可进行排序
      </div>
      <a-alert
        class="mg-t16"
        v-if="value.list.length > maxNum - 1"
        message="当前数量已达上限，可在删除后重新添加"
        banner
      ></a-alert>
      <st-form class="mg-t16">
        <!-- @open="onCustomAction" -->
        <div
          :class="module('box')"
          class="ignore-elements h5-form-component__add h5-form-coupon-component__box"
          @click="onModalOpen"
          v-if="value.list.length < maxNum"
        >
          <st-icon type="add" size="14px" color="rgba(62, 77, 92, 1)" />
          <div :class="module('add-label')">添加优惠券</div>
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
            class="h5-form-coupon-component__box"
            style="cursor: move;"
          >
            <div :class="module('del')" @click="onDel(index)">
              <st-icon type="delete" color="#FF5E41" size="16px" />
            </div>
            <div :class="module('content-value')">
              {{ item.price }}
            </div>
            <div :class="module('content-desc')">{{ item.activity_name }}</div>
            <a-tooltip :class="module('draggable-icon')" placement="top">
              <template slot="title">
                <span>拖拽调整顺序</span>
              </template>
              <div>
                <st-icon
                  size="16px"
                  class="tooltip-draggable"
                  type="tuozhuai"
                />
              </div>
            </a-tooltip>
          </div>
        </st-draggable>
      </st-form>
    </div>
  </div>
</template>
<script>
import mixin from './mixin'
import CouponTableSelect from '@/views/biz-modals/plugin/coupon/coupon-table-select'
import { H5FormCouponComponentService } from './h5-form.coupon.component.service'
export default {
  name: 'h5FormCouponComponent',
  mixins: [mixin],
  modals: {
    CouponTableSelect
  },
  bem: {
    module: 'h5-form-component',
    coupon: 'h5-form-coupon-component'
  },
  serviceInject() {
    return {
      couponService: H5FormCouponComponentService
    }
  },
  rxState() {
    const { directionOptions$ } = this.couponService
    return {
      directionOptions: directionOptions$
    }
  },
  data() {
    return {
      idKeyName: 'activity_id',
      modalConfig: {
        title: '选择普通优惠券',
        max: this.maxNum
      },
      show_direction: 1
    }
  },
  methods: {
    adaptor(selectedRows) {
      return selectedRows.map(item => {
        return {
          activity_id: item.activity_id,
          activity_name: item.activity_name,
          valid_days: item.valid_days,
          price: item.price
        }
      })
    },
    onModalOpen() {
      const { title, max } = this.modalConfig
      this.$modalRouter.push({
        name: 'coupon-table-select',
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
