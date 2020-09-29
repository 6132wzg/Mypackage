<template>
  <div :class="module()">
    <div :class="module('title')">
      <div :class="module('title-text')">{{ moduleName }}</div>
    </div>
    <div :class="module('content-desc')">最多添加{{ maxNum }}个课程</div>
    <div :class="module('direction')">
      <div :class="module('direction-label')">显示方式</div>
      <a-radio-group
        :options="directionOptions"
        v-model="show_direction"
        @change="onChange"
      ></a-radio-group>
    </div>
    <div :class="module('rule')">
      <div :class="module('rule-label')">显示规则</div>
      <a-radio-group
        :options="recommendRuleOptions"
        v-model="data_source"
        @change="onRecommendRuleChange"
      ></a-radio-group>
    </div>
    <product-select
      v-if="isShowCustom"
      fieldName="course_name"
      title="选择课程"
      desc="拖动课程可进行排序"
      placeholder="选择课程"
      :maxNum="maxNum"
      v-model="value"
      @delete="onDel"
      @drag="onChange"
      @open="onModalOpen"
    ></product-select>
    <!-- @open="onCustomAction" -->
  </div>
</template>
<script>
import mixin from './mixin'
import RecommendCourseTableSelect from '@/views/biz-modals/course/recommend-course-table-select'
import { H5FormCourseComponentService } from './h5-form.course.component.service'
import { imgFilter } from '@/filters/resource.filters'
import ProductSelect from './product-select'
export default {
  name: 'h5FormCourseComponent',
  mixins: [mixin],
  modals: {
    RecommendCourseTableSelect
  },
  bem: {
    module: 'h5-form-component'
  },
  components: {
    ProductSelect
  },
  serviceInject() {
    return {
      courseService: H5FormCourseComponentService
    }
  },
  rxState() {
    const { directionOptions$, recommendRuleOptions$ } = this.courseService
    return {
      directionOptions: directionOptions$,
      recommendRuleOptions: recommendRuleOptions$
    }
  },
  data() {
    return {
      draggableOptions: {
        filter: '.ignore-elements'
      },
      modalConfig: {
        title: '选择课程',
        max: this.maxNum
      },
      show_direction: 1,
      data_source: null
    }
  },
  methods: {
    imgFilter,
    adaptor(selectedRows) {
      return selectedRows.map(item => {
        return {
          id: item.id,
          course_name: item.course_name,
          tag: item.tag,
          course_purpose: item.course_purpose,
          image_url: item.image_url
        }
      })
    },
    onRecommendRuleChange(e) {
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
      this.courseService.getPreview(query).subscribe(res => {
        this.value.list = res.list
      })
    },
    onModalOpen() {
      const { title, max } = this.modalConfig
      this.$modalRouter.push({
        name: 'recommend-course-table-select',
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
