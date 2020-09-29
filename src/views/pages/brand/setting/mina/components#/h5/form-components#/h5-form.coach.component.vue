<template>
  <div :class="module()">
    <div :class="module('title')">
      <div :class="module('title-text')">{{ moduleName }}</div>
    </div>
    <div :class="module('content-desc')">
      最多添加{{ maxNum }}个{{ $c('coach') }}
    </div>
    <st-form labelWidth="56px" class="mg-t24">
      <st-form-item label="显示方式">
        <a-radio-group
          :options="directionOptions"
          v-model="show_direction"
          @change="onChange"
        ></a-radio-group>
      </st-form-item>
      <st-form-item label="显示内容">
        <a-checkbox-group
          :options="showContentOptions"
          v-model="show_content"
          @change="onChange"
        ></a-checkbox-group>
      </st-form-item>
      <st-form-item label="显示规则">
        <a-radio-group
          :options="recommendRuleOptions"
          v-model="data_source"
          @change="onRecommendRuleChange"
        ></a-radio-group>
      </st-form-item>
    </st-form>
    <div v-if="isShowCustom" :class="module('content')">
      <div :class="module('content-label')">选择{{ $c('coach') }}</div>
      <div :class="module('content-desc')">
        拖动卡片可对员工进行排序
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
          class="h5-form-component__add h5-form-coach-component__box"
          @click="onModalOpen"
          v-show="value.list.length < maxNum"
        >
          <st-icon type="add" size="14px" color="rgba(62, 77, 92, 1)" />
          <div :class="module('add-label')">添加{{ $c('coach') }}</div>
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
            class="h5-form-coach-component__box"
            style="cursor: move;"
          >
            <div :class="module('del')" @click="onDel(index)">
              <st-icon type="delete" color="#FF5E41" size="16px" />
            </div>
            <img
              :class="coach('avatar')"
              style="object-fit: cover;"
              :src="imgFilter(item.avatar, { w: 100, h: 100 })"
              width="100"
              height="100"
            />
            <div :class="coach('name')" class="text-overflow">
              {{ item.nickname }}
            </div>
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
import CoachTableSelect from '@/views/biz-modals/staff/coach-table-select'
import { H5FormCoachComponentService } from './h5-form.coach.component.service'
import { imgFilter } from '@/filters/resource.filters'

export default {
  name: 'h5FormCoachComponent',
  mixins: [mixin],
  modals: {
    CoachTableSelect
  },
  bem: {
    module: 'h5-form-component',
    coach: 'h5-form-coach-component'
  },
  serviceInject() {
    return {
      coachService: H5FormCoachComponentService
    }
  },
  rxState() {
    const {
      directionOptions$,
      showContentOptions$,
      recommendRuleOptions$
    } = this.coachService
    return {
      directionOptions: directionOptions$,
      showContentOptions: showContentOptions$,
      recommendRuleOptions: recommendRuleOptions$
    }
  },
  data() {
    return {
      modalConfig: {
        title: `选择${this.$c('coach')}`,
        max: this.maxNum
      },
      show_direction: 1,
      show_content: [],
      data_source: null
    }
  },
  methods: {
    imgFilter,
    adaptor(selectedRows) {
      return selectedRows.map(item => {
        return {
          id: item.id,
          nickname: item.nickname,
          avatar: item.avatar,
          mobile: item.mobile,
          course_nums: item.course_nums,
          coach_level: item.coach_level
        }
      })
    },
    onRecommendRuleChange() {
      this.getPreview()
      this.onChange()
    },
    getPreview() {
      if (this.isShowCustom) {
        return
      }
      const query = {
        shop_id: this.shopId,
        module_type: this.moduleType,
        data_source: this.data_source
      }
      this.coachService.getPreview(query).subscribe(res => {
        this.value.list = res.list
      })
    },
    onModalOpen() {
      const { title, max } = this.modalConfig
      this.$modalRouter.push({
        name: 'coach-table-select',
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
