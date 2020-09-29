<template>
  <st-panel app initial :class="b()">
    <st-form :form="form" class="pd-y12">
      <!-- 基本信息 start -->
      <div :class="b('base-info')">
        <block-title title-name="基本信息" class="mg-b32"></block-title>
        <a-row :gutter="2">
          <a-col :lg="24">
            <st-form-item label="课程名称" labelWidth="148px" required>
              <st-input
                :disabled="isEdit"
                :maxLength="30"
                style="width: 320px"
                v-decorator="decorators.course_name"
                placeholder="请输入课程包名称"
                allowClear
              ></st-input>
            </st-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="2">
          <a-col :lg="24">
            <st-form-item label="课程包类型" labelWidth="148px">
              <a-radio-group
                @change="onChangePackageType"
                :disabled="isEdit"
                v-decorator="decorators.is_limit"
                :options="packageTypeOptions$"
              />
            </st-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="2">
          <a-col :lg="14">
            <st-form-item label="课程包属性" labelWidth="148px">
              <a-radio-group
                :disabled="isEdit"
                v-decorator="decorators.course_range"
                @change="onChangePackageAttr"
              >
                <a-radio
                  v-for="item in packageAttrOptions"
                  :key="item.value"
                  :disabled="item.disabled"
                  :value="item.value"
                >
                  <span>{{ item.label }}</span>
                  <st-help-tooltip class="mg-l4" :id="item.tooltip" />
                </a-radio>
              </a-radio-group>
            </st-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="2">
          <a-col :lg="24">
            <st-form-item
              v-if="isShop$"
              label="支持上课门店"
              labelWidth="148px"
              required
            >
              <a-input
                style="width: 320px"
                disabled
                :value="shop$.name"
              ></a-input>
            </st-form-item>

            <biz-assign-shop
              v-else
              label="支持上课门店"
              labelWidth="148px"
              formItemKey="use_shop_list"
              :form="form"
              :shopIds="useShopIds"
              :type="useRange"
              @change="onChangeUseRange"
              required
            ></biz-assign-shop>
          </a-col>
        </a-row>
        <a-row :gutter="2" v-if="packageAttr !== 3">
          <a-col :lg="12" :xs="16">
            <!-- 可约课程种类固定课程没有此选项 -->
            <reserve-course-species-form-item @change="onChangeReserveSpec" />
          </a-col>
        </a-row>
        <a-row :gutter="2">
          <a-col :lg="22">
            <st-form-item
              label="可约课程"
              :validateStatus="courseValidatorText ? 'error' : ''"
              :help="courseValidatorText"
              labelWidth="148px"
              required
            >
              <span v-if="packageAttr === 1">
                <span>支持上课门店的全部{{ courses[courseSpec] }}</span>
              </span>
              <div v-else-if="packageAttr === 2">
                <reserve-course
                  v-if="isReset && [1, 3, 4].includes(courseSpec)"
                  key="team"
                  :initDataSource="teamCourseList"
                  @change="onChangeTeamCourse"
                  courseType="team"
                ></reserve-course>
                <reserve-course
                  v-if="isReset && [2, 3, 4].includes(courseSpec)"
                  courseType="personal"
                  @change="onChangePersonalCourse"
                  key="personal"
                  :initDataSource="personalCourseList"
                  class="mg-t16"
                ></reserve-course>
              </div>
              <div v-else-if="packageAttr === 3">
                <reserve-course
                  v-if="isReset"
                  key="team"
                  @change="onChangeTeamCourse"
                  :initDataSource="teamCourseList"
                  courseType="team"
                ></reserve-course>
                <reserve-course
                  v-if="isReset"
                  courseType="personal"
                  :initDataSource="personalCourseList"
                  @change="onChangePersonalCourse"
                  key="personal"
                  class="mg-t16"
                ></reserve-course>
              </div>
            </st-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="2">
          <a-col :lg="24">
            <reserve-is-limit-form-item></reserve-is-limit-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="2">
          <a-col :lg="24">
            <st-form-item labelWidth="148px" required>
              <template slot="label">
                支持使用人数
                <st-help-tooltip id="TBMCDC003" />
              </template>
              <st-input-number
                v-decorator="decorators.support_num"
                style="width: 121px"
                :min="1"
                :max="20"
              >
                <template slot="addonAfter">人</template>
              </st-input-number>
              <span class="mg-l20 tip">上限20人</span>
            </st-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="2">
          <a-col :lg="8" :xs="11">
            <st-form-item labelWidth="148px" label="有效期" required>
              <st-input-number
                v-decorator="decorators.valid_time"
                :max="validTime.max"
                :min="validTime.min"
                style="width: 141px"
              >
                <a-select
                  slot="addonAfter"
                  v-decorator="decorators.valid_time_unit"
                  @change="onChangeValidTimeUnit"
                  :options="freezeUnitOptions$"
                ></a-select>
              </st-input-number>
            </st-form-item>
          </a-col>
        </a-row>
      </div>
      <!-- 基本信息 end -->

      <!-- 售卖信息 start -->
      <div :class="b('buy-info')">
        <block-title title-name="售卖信息" class="mg-b32"></block-title>
        <slod-price-setting-form-item
          v-if="resetPrice"
        ></slod-price-setting-form-item>
        <!-- 支持售卖时间 start-->
        <a-row :gutter="2">
          <a-col :lg="24">
            <buy-time-form-item :decorators="decorators" />
          </a-col>
        </a-row>
        <!-- 支持售卖时间 end-->
        <a-row :gutter="2">
          <a-col :lg="24" :xs="11">
            <st-form-item
              v-if="isShop$"
              label="支持售卖门店"
              labelWidth="148px"
              required
            >
              <a-input
                disabled
                style="width: 320px"
                :value="shop$.name"
              ></a-input>
            </st-form-item>
            <biz-assign-shop
              v-else
              label="支持售卖门店"
              labelWidth="148px"
              formItemKey="sale_shop_list"
              :form="form"
              :shopIds="saleShopIds"
              @change="onChangeSaleRange"
              :type="saleRange"
              required
            ></biz-assign-shop>
          </a-col>
        </a-row>
        <a-row :gutter="2">
          <a-col :lg="24">
            <st-form-item label="售卖方式" labelWidth="148px" required>
              <a-checkbox-group v-decorator="decorators.sale_mode">
                <a-checkbox
                  v-for="item in sellTypeOptions$"
                  :key="item.value"
                  class="mg-r40"
                  :value="item.value"
                >
                  <span>{{ item.label }}</span>
                </a-checkbox>
              </a-checkbox-group>
            </st-form-item>
          </a-col>
        </a-row>
        <!-- 转让设置 start -->
        <a-row :gutter="2">
          <a-col :lg="12" :xs="16">
            <transfer-setting-form-item></transfer-setting-form-item>
          </a-col>
        </a-row>
        <!-- 转让设置 end -->
        <!-- 冻结设置 start -->
        <a-row :gutter="2">
          <a-col :lg="24">
            <freeze-setting-form-item></freeze-setting-form-item>
          </a-col>
        </a-row>
        <!-- 冻结设置 end -->
      </div>
      <!-- 售卖信息 end -->

      <!-- 其他信息 start -->
      <div :class="b('other-info')">
        <block-title title-name="其他信息" class="mg-b32"></block-title>
        <a-row :gutter="2">
          <a-col :lg="11" :xs="11">
            <st-form-item
              label="封面"
              labelWidth="148px"
              validateStatus="error"
              :help="cardBgValidatorText"
              required
            >
              <biz-card-bg-radio
                v-model="image"
                @change="onCardBgChange"
                isPackage
              ></biz-card-bg-radio>
            </st-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="2">
          <a-col :lg="22" :xs="24">
            <st-form-item label="课程包介绍" labelWidth="148px">
              <st-editor v-decorator="decorators.intro"></st-editor>
            </st-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="2">
          <a-col :lg="22" :xs="24">
            <st-form-item label="内部备注" labelWidth="148px">
              <st-textarea
                allow-clear
                placeholder="备注内容仅商家可见"
                v-decorator="decorators.remarks"
                :autosize="autosize"
              ></st-textarea>
            </st-form-item>
          </a-col>
        </a-row>
      </div>
      <!-- 其他信息 end -->
      <a-row :gutter="2">
        <a-col :lg="11" :xs="11">
          <st-form-item labelFix labelWidth="148px">
            <st-button type="primary" @click="onSave">保存</st-button>
            <st-button v-if="!isEdit" class="mg-l16" @click="onSaveAndOnShelf">
              保存并上架
            </st-button>
          </st-form-item>
        </a-col>
      </a-row>
    </st-form>
  </st-panel>
</template>

<script>
import { FormService } from './form.service'
import { ruleOptions } from './form.config'
import TransferSettingFormItem from './form-item#/transfer-setting-form-item.vue'
import ReserveCourse from './form-item#/reserve-course.vue'
import ReserveIsLimitFormItem from './form-item#/reserve-is-limit-form-item.vue'
import ReserveCourseSpeciesFormItem from './form-item#/reserve-course-species-form-item.vue'
import FreezeSettingFormItem from './form-item#/freeze-setting-form-item.vue'
import SlodPriceSettingFormItem from './form-item#/slod-price-setting-form-item'
import BuyTimeFormItem from '@/views/biz-components/sold/sold-time-form-item/sold-time-form-item.vue'
import BizAssignShop from '@/views/biz-components/shop/assign-shop/assign-shop.vue'
import BizCardBgRadio from '@/views/biz-components/card-bg-radio/card-bg-radio.vue'
import StEditor from '@/views/components/editor#/editor.vue'
import { PatternService } from '@/services/pattern.service'
import { cloneDeep, intersection, intersectionWith } from 'lodash'
export default {
  name: 'BizPackageForm',
  bem: {
    b: 'biz-package-form'
  },
  serviceInject() {
    return {
      pattern: PatternService,
      service: FormService
    }
  },
  rxState() {
    const {
      packageTypeOptions$,
      packageAttrOptions$,
      freezeUnitOptions$,
      shop$,
      isShop$,
      coachList$,
      cardBgList$,
      sellTypeOptions$
    } = this.service
    return {
      cardBgList$,
      packageTypeOptions$,
      packageAttrOptions$,
      freezeUnitOptions$,
      coachList$,
      shop$,
      isShop$,
      sellTypeOptions$
    }
  },
  provide() {
    return {
      form: this
    }
  },
  props: {
    initInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const form = this.$stForm.create()
    return {
      courses: ['', '团体课', '私教课', '团体课和私教课'],
      form,
      isFreeze: false,
      FORMAT_DATE: 'YYYY-MM-DD',
      isTransfer: false,
      courseSetting: {},
      useRange: 3,
      isReset: true,
      resetPrice: true,
      cardBgValidatorText: '',
      courseValidatorText: '',
      useShopIds: [],
      validTime: {
        min: 0,
        max: 999
      },
      image: {
        image_id: 0,
        image_key: this.cardBgList$[0].image_key,
        image_url: '',
        index: 1
      },
      personalCourse: [],
      teamCourse: [],
      saleRange: 3,
      saleShopIds: [],
      autosize: { minRows: 4, maxRow: 20 },
      unLimited: false,
      courseName: '我是课程包',
      packageAttr: 1
    }
  },
  components: {
    BizCardBgRadio,
    BuyTimeFormItem,
    TransferSettingFormItem,
    ReserveIsLimitFormItem,
    ReserveCourseSpeciesFormItem,
    FreezeSettingFormItem,
    SlodPriceSettingFormItem,
    BizAssignShop,
    StEditor,
    ReserveCourse
  },
  methods: {
    resetCourse() {
      let useShopList = this.form.getFieldValue('use_shop_list')
      if (
        intersection(this.useShopIds, useShopList).length ===
        this.useShopIds.length
      )
        return
      if (!this.personalCourse.length && !this.teamCourse.length) return

      this.isReset = false
      let timer = setTimeout(() => {
        this.teamCourse = []
        this.personalCourse = []
        this.isReset = !this.isReset
      }, 16)
    },
    onChangeValidTimeUnit(value) {
      if (value === 3) {
        this.validTime = {
          min: 1,
          max: 50
        }
      }
    },
    onChangePersonalCourse(course) {
      this.courseValidatorText = ''
      this.personalCourse = course
    },
    onChangeTeamCourse(course) {
      this.courseValidatorText = ''
      this.teamCourse = course
    },
    onChangeUseRange(value, shopIds) {
      this.resetCourse()
      this.useRange = value
      this.useShopIds = shopIds
    },
    onChangeSaleRange(value) {
      this.saleRange = value
    },
    onCardBgChange() {
      this.cardBgValidatorText = ''
    },
    // 卡背景校验
    cardBgValidator() {
      let validata = this.image.image_key !== ''
      this.cardBgValidatorText = validata ? '' : '请上传卡背景'
    },
    // 课程自定义校验
    courseValidator() {
      let validata = true
      let course = [...this.personalCourse, ...this.teamCourse]
      course.forEach(item => {
        validata =
          (item.course_times && item.course_unit_price) || item.reduce_times
      })
      if (this.packageAttr === 2 && this.unLimited) {
        validata = this.unLimited
      }

      this.courseValidatorText = validata ? '' : '请填写上课次数或者额度'
    },
    getShopIds(type) {
      return (
        (this.initInfo[`${type}_shop_list`] &&
          this.initInfo[`${type}_shop_list`].map(item => item.shop_id)) ||
        []
      )
    },
    // 获取可约课程种类数据
    onChangeReserveSpec(courseSetting) {
      this.courseSetting = courseSetting
    },
    // 选择课程包类型，当选择不限次约课只能选择范围课程
    onChangePackageType(event) {
      this.unLimited = event.target.value === 0
      // 当为不限次课程式，只允许是范围内课程 设置级联值和表单值
      this.packageAttr = this.unLimited ? 2 : 1
      this.form.setFieldsValue({ course_range: this.unLimited ? 2 : 1 })
    },
    /**
     *  选择任意课程： 可约课程不可选。显示一行文本
     */

    onChangePackageAttr(event) {
      this.packageAttr = event.target.value
    },
    formDataFormat(saveType) {
      let {
        useRange,
        saleRange,
        image,
        courseSetting,
        personalCourse,
        teamCourse,
        FORMAT_DATE
      } = this
      let form = {
        image,
        use_range: useRange,
        sale_range: saleRange,
        course_setting: courseSetting
      }
      if (personalCourse.length) {
        let p = cloneDeep(personalCourse)
        form.support_course_personal_range = p.map(item => {
          item.coach_level_ids = item.coach_level_ids.map(ele =>
            typeof ele === 'object' ? ele.id : ele
          )
          return item
        })
      }
      if (teamCourse.length) {
        form.support_course_team_range = teamCourse
      }
      this.form.getFieldValue('use_shop_list')
      this.form.getFieldValue('sale_shop_list')
      this.cardBgValidator()
      this.courseValidator()
      this.form.validate().then(values => {
        if (!this.cardBgIsOk || !this.courseIsOk) return
        let v = cloneDeep(values)
        let { team_total_price = 0, personal_total_price = 0 } = v
        v.price = v.price ? v.price : +team_total_price + +personal_total_price
        v.reserve_is_limit = v.reserve_is_limit[0] || 0
        v.is_allow_transfer = v.is_allow_transfer[0] || 0
        v.is_allow_frozen = v.is_allow_frozen[0] || 0
        if (v.sale_time && v.sale_time.length) {
          v.start_time = moment(v.sale_time[0])
            .format(FORMAT_DATE)
            .valueOf()
          v.end_time = moment(v.sale_time[1])
            .format(FORMAT_DATE)
            .valueOf()
          delete v.sale_time
        }
        form = {
          ...v,
          ...form
        }
        this.$emit(saveType, form)
      })
    },
    onSave() {
      this.formDataFormat('save')
    },
    onSaveAndOnShelf() {
      this.formDataFormat('shelf')
    }
  },
  watch: {
    courseSpec() {
      this.resetPrice = false
      let timer = setTimeout(() => {
        this.resetPrice = true
        clearTimeout(timer)
      })
    }
  },
  computed: {
    ruleOptions() {
      return ruleOptions
    },
    decorators() {
      return this.form.decorators(this.ruleOptions)
    },
    // 约课种类
    courseSpec() {
      return this.courseSetting.spec
    },
    teamCourseList() {
      return this.initInfo.support_course_team_range || []
    },
    personalCourseList() {
      let courseList =
        cloneDeep(this.initInfo.support_course_personal_range) || []
      return courseList.map(item => {
        item.coach_level_ids = item.coach_level_ids.map(ele => ele.id)
        return item
      })
    },
    coachList() {
      return this.coachList$
    },
    // 卡背景是否校验通过
    cardBgIsOk() {
      return this.cardBgValidatorText === ''
    },
    courseIsOk() {
      return this.courseValidatorText === ''
    },
    packageAttrOptions() {
      return this.packageAttrOptions$.map(item => {
        this.$set(item, 'disabled', this.unLimited && item.value !== 2)
        return item
      })
    }
  },
  created() {
    this.service.getCoachList().subscribe()
  },
  mounted() {
    if (!this.isEdit) return
    let {
      course_range = 1,
      use_range = 3,
      sale_range = 3,
      is_limit,
      image
    } = this.initInfo
    // 编辑时，判断课程包是否限次
    this.unLimited = is_limit === 0
    // 编辑时判断是 范围 不限次 固定
    this.packageAttr = course_range
    this.saleRange = sale_range
    this.useRange = use_range
    this.useShopIds = this.getShopIds('use')
    this.saleShopIds = this.getShopIds('sale')
    this.image = image
  }
}
</script>
