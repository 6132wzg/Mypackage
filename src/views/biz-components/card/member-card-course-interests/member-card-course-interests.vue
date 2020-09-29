<template>
  <st-form-item
    :labelGutter="labelGutter"
    :labelWidth="labelWidth"
    :required="required"
  >
    <template slot="label">
      <slot v-if="$slots.label" name="label"></slot>
      <template>{{ label }}</template>
    </template>
    <a-radio-group
      v-model="currentType"
      :options="types"
      :disabled="disabled"
      @change="onTypeChange"
    ></a-radio-group>
    <a-select
      v-show="isShowCourseList"
      mode="multiple"
      :disabled="disabled"
      style="width: 420px;"
      v-decorator="decorators.currentCourseIds"
      placeholder="请输入课程名称搜索"
      :filterOption="false"
      @search="onSearch"
      :notFoundContent="loading.getCourseList ? undefined : null"
      @change="onCourseIdsChange"
      class="mg-t16"
    >
      <a-spin
        v-if="loading.getCourseList"
        slot="notFoundContent"
        size="small"
      />
      <a-select-option v-for="course in courseList" :key="course.id">
        {{ course.name }}
      </a-select-option>
    </a-select>
  </st-form-item>
</template>
<script>
import { CourseIntersetsService } from './member-card-course-interests.service'
import { ruleOptions } from './member-card-course-interests.config'
export default {
  serviceInject() {
    return {
      courseInterestsService: CourseIntersetsService
    }
  },
  rxState() {
    const { loading$, types$, courseList$ } = this.courseInterestsService
    return {
      loading: loading$,
      types: types$,
      courseList: courseList$
    }
  },
  decorators() {
    return this.form.addDecorators(this.ruleOptions)
  },
  props: {
    /**
     * 约课权益类型 1无 2全部团体课 3指定团体课
     */
    type: {
      type: Number,
      default: 1
    },
    courseIds: {
      type: Array,
      default() {
        return []
      }
    },
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    label: {
      type: String,
      default: '约课权益'
    },
    labelWidth: {
      type: String,
      default: '88px'
    },
    labelGutter: {
      type: String,
      default: '24px'
    },
    required: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentType: 1,
      /**
       * 多门店
       */
      TYPE_CUSTOM: 3
    }
  },
  computed: {
    ruleOptions,
    decorators() {
      return this.form.addDecorators(this.ruleOptions)
    },
    isShowCourseList() {
      /**
       * 多店
       */
      return this.currentType === this.TYPE_CUSTOM
    },
    /**
     * 是否校验门店
     */
    isRequired() {
      return this.required && this.currentType === this.TYPE_CUSTOM
    }
  },
  watch: {
    type(val) {
      this.currentType = val
    },
    courseIds: {
      handler(val) {
        this.getCourseListByCourseIds(val)
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { type, courseIds } = this
      this.currentType = type
      this.$nextTick(() => {
        this.getCourseListByCourseIds(courseIds)
      })
    },
    getCourseListByCourseIds(courseIds) {
      this.form.setFieldsValue({
        currentCourseIds: courseIds
      })
      if (courseIds.length) {
        this.getCourseList({
          course_ids: courseIds
        })
      }
    },
    onCourseIdsChange(currentCourseIds) {
      this.form.setFieldsValue({
        currentCourseIds
      })
      this.onChange()
    },
    onTypeChange(e) {
      this.currentType = e.target.value
      this.$nextTick(() => {
        this.form.validateFields(['currentCourseIds'], { force: true })
      })
      this.onChange()
    },
    onChange() {
      const { currentType } = this
      const currentCourseIds = this.form.getFieldValue('currentCourseIds')
      this.$emit('change', currentType, currentCourseIds)
    },
    onSearch(keyword) {
      this.getCourseList({
        course_name: keyword
      })
    },
    getCourseList(query) {
      this.courseInterestsService.courseListAction$.dispatch(query)
    }
  }
}
</script>
