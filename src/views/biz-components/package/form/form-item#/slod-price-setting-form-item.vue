<template>
  <div>
    <a-row :gutter="2" v-if="isAll || (isRange && !unLimited)">
      <a-col :lg="24" style="display: flex;">
        <st-form-item
          v-if="spec !== 2"
          :label="spec !== 4 ? '价格设置' : '实际售价'"
          labelWidth="148px"
          required
        >
          <!-- 这个用于固定课程 -->
          <div class="biz-package-form__price-setting">
            <template v-if="spec === 1 || spec === 3">
              <span class="mg-r20">团体课总售价</span>
              <st-input-number
                v-decorator="decorators.team_total_price"
                style="width: 121px"
                :min="0"
                :max="9999999.9"
                float
                @change="onChangeTeamPrice"
              >
                <template slot="addonAfter">元</template>
              </st-input-number>
            </template>

            <template v-if="spec === 4">
              <span class="mg-r20">
                团课&私教课总售价
              </span>
              <st-input-number
                float
                :min="0"
                :max="9999999.9"
                @change="onChangeTotalPrice"
                v-decorator="decorators.price"
                style="width: 121px"
              >
                <template slot="addonAfter">元</template>
              </st-input-number>
            </template>
          </div>
        </st-form-item>
        <!-- 单独为私教的时候只有私教课一个价格设置表单 -->
        <st-form-item
          v-if="spec === 2 || spec === 3"
          :label="spec === 2 ? '价格设置' : ' '"
          :labelWidth="spec === 2 ? '148px' : '0'"
          :required="spec === 2"
        >
          <template>
            <span class="mg-r20">
              私教课总售价
            </span>
            <st-input-number
              float
              :min="0"
              :max="9999999.9"
              @change="onChangePersonalPrice"
              v-decorator="decorators.personal_total_price"
              style="width: 121px"
            >
              <template slot="addonAfter">元</template>
            </st-input-number>
          </template>
        </st-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="2">
      <a-col :lg="8" :xs="11">
        <st-form-item label="参考价" v-if="isFix" labelWidth="148px" required>
          <!-- 这个用于固定课程 -->
          {{ referPrice }}元
        </st-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="2" v-if="spec !== 4">
      <a-col :lg="8" :xs="11">
        <st-form-item label="实际售价" labelWidth="148px" required>
          <!-- 这个用于任意课程 限定范围-->
          <st-input-number
            v-if="isFix || (unLimited && isRange)"
            v-decorator="decorators.price"
            :min="0"
            :max="9999999.9"
            float
            style="width: 120px"
          >
            <template slot="addonAfter">元</template>
          </st-input-number>
          <span v-if="isAll || (!unLimited && isRange)">
            {{ realityPrice }}元
          </span>
        </st-form-item>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { PACKAGE_ATTR } from './const.ts'
export default {
  name: 'SlodPriceSettingFormItem',
  inject: ['form'],
  data() {
    return {
      teamPrice: 0,
      personalPrice: 0,
      isSettingPrice: false,
      totalPrice: 0,
      PACKAGE_ATTR
    }
  },
  methods: {
    onChangeTeamPrice(value) {
      this.isSettingPrice = true
      this.teamPrice = +value
    },
    onChangePersonalPrice(value) {
      this.isSettingPrice = true
      this.personalPrice = +value
    },
    onChangeTotalPrice(value) {
      this.isSettingPrice = true
      this.totalPrice = +value
    }
  },
  computed: {
    initInfo() {
      return this.form.initInfo
    },
    realityPrice() {
      if (this.form.isEdit && !this.isSettingPrice) {
        return this.form.initInfo.price
      }
      return (
        this.totalPrice || (+this.teamPrice + this.personalPrice).toFixed(1)
      )
    },
    personalCourse() {
      return this.form.personalCourse
    },
    teamCourse() {
      return this.form.teamCourse
    },
    referPrice() {
      let count = 0
      if (this.isFix) {
        let course = cloneDeep([...this.personalCourse, ...this.teamCourse])
        course.forEach(item => {
          count += (item.course_times || 0) * (item.course_unit_price || 0)
        })
      }
      return count
    },
    decorators() {
      return this.form.decorators
    },
    // 可选课程中类 spec 1 仅团课 2 仅私教课 3 团课 和 私教 4 私教团课混合
    spec() {
      return this.form.courseSetting.spec
    },
    isRange() {
      return this.packageAttr === PACKAGE_ATTR.RANGE
    },
    isAll() {
      return this.packageAttr === PACKAGE_ATTR.ALL
    },
    isFix() {
      return this.packageAttr === PACKAGE_ATTR.FIX
    },
    unLimited() {
      return this.form.unLimited
    },
    packageAttr() {
      return this.form.packageAttr
    },
    formVueData() {
      return this.form.form
    }
  },
  mounted() {
    if ([1, 3, 4].includes(spec)) {
      this.teamPrice = +this.initInfo.team_total_price || 0
    }
    if ([(2, 3, 4)].includes(spec)) {
      this.personalPrice = +this.initInfo.personal_total_price || 0
    }
  }
}
</script>
