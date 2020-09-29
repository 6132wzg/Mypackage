<template>
  <st-form-item
    label="可约课程种类"
    labelWidth="148px"
    :validateStatus="help ? 'error' : ''"
    :help="help"
    required
  >
    <a-radio-group
      v-model="courseSetting.spec"
      @change="onChange"
      class="biz-package-form__course-spec"
    >
      <a-radio
        v-for="(item, index) in specOptions"
        :key="index"
        :class="{ 'mg-t16': index !== 0 }"
        :value="item.value"
      >
        <template v-for="label in item.labelOptions">
          <span :key="label.label">
            <span>{{ label.label }}</span>
            <st-input-number
              v-model="label.model"
              class="mg-l20 mg-r20"
              :min="0"
              :max="99999"
              :disabled="!(item.value === courseSetting.spec)"
              v-if="isInputTime"
              :style="style"
            >
              <template slot="addonAfter">{{ unit }}</template>
            </st-input-number>
          </span>
        </template>
      </a-radio>
    </a-radio-group>
  </st-form-item>
</template>

<script>
import { PACKAGE_ATTR } from './const.ts'
import { cloneDeep } from 'lodash'
export default {
  name: 'ReserveCourseSpeciesFormItem',
  // 通过这个vueapi获取父组件的属性
  inject: ['form'],
  data() {
    return {
      unit: '次',
      help: '',
      courseSetting: { spec: -1 },
      PACKAGE_ATTR,
      // 可约课程种类 1 仅支持团课 2 仅支持私教课 3 既支持团课也支持私教课4支持团课和私教课总数
      initSpecOptions: [
        {
          value: 1,
          labelOptions: [
            {
              label: '仅支持预约团体课',
              model: void 0,
              validateText: '请填写支持预约团体课次数'
            }
          ]
        },
        {
          value: 2,
          labelOptions: [
            {
              label: '仅支持预约私教课',
              model: 0,
              validateText: '请填写支持预约私教课次数'
            }
          ]
        },
        {
          value: 3,
          labelOptions: [
            {
              label: '仅支持预约团体课',
              model: 0,
              validateText: '请填写支持预约团体课和私教课次数'
            },
            {
              label: '和私教课',
              model: 0,
              validateText: '请填写支持预约团体课和私教课次数'
            }
          ]
        },
        {
          value: 4,
          labelOptions: [
            {
              label: '支持预约团体课和私教课共',
              model: 0,
              validateText: '请填写支持预约团体课和私教课总共次数'
            }
          ]
        }
      ]
    }
  },
  watch: {
    courseSetting: {
      deep: true,
      handler(newValue) {
        this.$emit('change', newValue)
      }
    },
    specOptions: {
      deep: true,
      handler(newValue, oldValue) {
        let { spec } = this.courseSetting
        const labelOptions = newValue[spec - 1].labelOptions
        this.courseSetting = this.outDataFormat(labelOptions, spec)
        this.helpText(labelOptions)
      }
    }
  },
  computed: {
    initSpecOptionsMap() {
      let map = {}
      for (let item of this.initSpecOptions) {
        map[item.value] = item
      }
      return map
    },
    specOptions() {
      let iso = this.initSpecOptions
      return this.mixinAttr ? iso : iso.filter(item => item.value !== 4)
    },
    initInfo() {
      return this.form.initInfo
    },
    style() {
      return 'width: 121px'
    },
    unLimited() {
      return this.form.unLimited
    },
    mixinAttr() {
      // 当是范围课程包且是限次的课程包才需要填写第四项私教和团课混合
      return (
        this.form.packageAttr === this.PACKAGE_ATTR.RANGE && !this.unLimited
      )
    },
    isInputTime() {
      // 当是范围课程包且是不限限次的课程包不需要填写第四项私教且次数也不需要填写
      return !(
        this.form.packageAttr === this.PACKAGE_ATTR.RANGE && this.unLimited
      )
    }
  },
  methods: {
    outDataFormat(labelOptions, spec) {
      const cs = {
        spec,
        is_team: 0,
        is_personal: 0,
        team_times: 0,
        personal_times: 0,
        total_times: 0
      }
      if (spec === 1) {
        cs.is_team = 1
        cs.team_times = labelOptions[0].model
      } else if (spec === 2) {
        cs.is_personal = 1
        cs.personal_times = labelOptions[0].model
      } else if (spec === 3) {
        cs.is_personal = 1
        cs.is_team = 1
        cs.team_times = labelOptions[0].model
        cs.personal_times = labelOptions[1].model
      } else if (spec === 4) {
        cs.is_personal = 1
        cs.is_team = 1
        cs.is_total = 1
        cs.total_times = labelOptions[0].model
      }
      return cs
    },
    inDataFormat() {
      let defaultSpec = 1
      if (!this.initInfo.course_setting) {
        this.$set(this.courseSetting, 'spec', defaultSpec)
        return
      }
      const {
        is_team,
        is_personal,
        total_times,
        personal_times,
        team_times
      } = this.initInfo.course_setting
      if (total_times > 0) {
        defaultSpec = 4
        this.initSpecOptions[3].labelOptions[0].model = total_times
      } else if (is_team && is_personal) {
        defaultSpec = 3
        this.initSpecOptions[2].labelOptions[0].model = team_times
        this.initSpecOptions[2].labelOptions[1].model = personal_times
      } else if (is_personal && !is_team) {
        this.initSpecOptions[1].labelOptions[0].model = personal_times
        defaultSpec = 2
      } else if (is_team && !is_personal) {
        this.initSpecOptions[0].labelOptions[0].model = team_times || ''
        defaultSpec = 1
      }
      this.$set(this.courseSetting, 'spec', defaultSpec)
    },
    helpText(labelOptions) {
      this.help = ''
      if (this.unLimited) return
      for (let key in labelOptions) {
        const { model, validateText } = labelOptions[key]
        if (!model) {
          this.help = validateText
          return
        }
      }
    },
    resetInputNumberValue(spec) {
      let iso = this.initSpecOptions.map(item => {
        let labelOptions = item.labelOptions.map(ele => {
          // 被选中的选项定为次数为1
          ele.model = spec === item.value ? void 0 : 0
          return ele
        })
        item.labelOptions = labelOptions
        return item
      })
      this.initSpecOptions = iso
    },
    onChange(e) {
      const val = e.target.value
      this.$set(this.courseSetting, 'spec', val)
      this.resetInputNumberValue(val)
      this.helpText(this.initSpecOptionsMap[val].labelOptions)
    },
    init() {
      this.inDataFormat()
    }
  },
  mounted() {
    this.init()
  }
}
</script>
