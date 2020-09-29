<template>
  <st-modal
    title="区域通行设置"
    v-model="show"
    @ok="putAreaSetting"
    size="small"
    :loading="loading.getAreaInfo"
  >
    <st-alert>{{ alertMsg }}</st-alert>
    <st-form :form="form" labelWidth="120px" class="mg-t24">
      <st-form-item v-show="false" label="id">
        <input type="hidden" v-decorator="decorators.area_id" />
      </st-form-item>
      <st-form-item label="所属区域名称">{{ info.area_name }}</st-form-item>
      <st-form-item v-if="info.area_type" label="所属区域类型">
        {{ info.area_type.name }}
      </st-form-item>
      <st-form-item
        v-if="formItemSwitches.entrancePeopleType"
        label="进入人员范围"
        required
      >
        <a-radio-group
          @change="getCurPeopleType"
          v-decorator="decorators.people_type"
          :disabled="!isEdit"
        >
          <a-radio
            v-for="(item, index) in rule"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
      </st-form-item>

      <st-form-item label="指定员工" v-if="peopleType === PEOPLE_TYPE.ONLY">
        <a-select
          mode="multiple"
          showSearch
          :filterOption="false"
          :defaultActiveFirstOption="false"
          @search="getWhiteList"
          v-decorator="decorators.white_list"
          placeholder="搜索指定员工"
          :disabled="!isEdit"
        >
          <a-select-option
            v-for="(item, index) in whiteList"
            :key="index"
            :value="item.staff_id"
          >
            {{ item.staff_name }}
          </a-select-option>
        </a-select>
      </st-form-item>

      <st-form-item v-if="formItemSwitches.exitanceRestriction">
        <template slot="label">
          离场限制
          <st-help-tooltip id="TSTXGZ001" />
        </template>
        <st-checkbox
          v-decorator="decorators.leave_limit"
          :disabled="!isEdit"
          class="mg-r8"
        ></st-checkbox>
        未归还的临时储物柜，不允许离场
      </st-form-item>
      <st-form-item required v-if="formItemSwitches.courseEntranceRestriction">
        <template slot="label">
          约课入场限制
          <st-help-tooltip id="TSTXGZ004" />
        </template>
        约课用户在课程开始前
        <st-input-number
          :min="0"
          :max="180"
          v-decorator="decorators.course_time"
          :disabled="!isEdit"
          style="width:50px;"
        ></st-input-number>
        分钟可入场
      </st-form-item>
      <!-- 预约限制与场地预约限制后端接口字段相同，这里产品强制要求区分 -->
      <st-form-item required v-if="formItemSwitches.gateOrderRestriction">
        <template slot="label">
          预约限制
          <st-help-tooltip id="TSTXGZ002" />
        </template>
        预约用户在预约开始前
        <st-input-number
          :min="0"
          :max="180"
          v-decorator="decorators.course_time"
          :disabled="!isEdit"
          style="width:50px;"
        ></st-input-number>
        分钟可入场
      </st-form-item>
      <!-- 预约限制与场地预约限制后端接口字段相同，这里产品强制要求区分 -->
      <st-form-item required v-if="formItemSwitches.venueOrderRestriction">
        <template slot="label">
          场地预约限制
          <st-help-tooltip id="TSTXGZ007" />
        </template>
        场地预约用户在预约开始前
        <st-input-number
          :min="0"
          :max="180"
          v-decorator="decorators.course_time"
          :disabled="!isEdit"
          style="width:50px;"
        ></st-input-number>
        分钟可入场
      </st-form-item>
      <st-form-item label="入场签课" v-if="formItemSwitches.entranceCheckIn">
        <st-checkbox
          v-decorator="decorators.checkin"
          :disabled="!isEdit"
        ></st-checkbox>
        当预约课程与场地排期课程一致，在用户入场同时，
        在可签到时间内自动为用户完成此课程签到
      </st-form-item>
      <st-form-item v-if="formItemSwitches.timesCardRule">
        <template slot="label">
          次卡扣费规则
          <st-help-tooltip id="TSTXGZ005" />
        </template>
        <div>
          <a-radio-group
            :disabled="!isEdit"
            v-decorator="decorators.charge_type"
          >
            <a-radio
              v-for="(item, index) in timesCardRules"
              :key="index"
              :value="item.value"
            >
              <!-- 每xx小时内进入此区域只扣1次 这地方比较特殊，没有复用性，不定义常量了 -->
              <!-- 2 对应 radio 的第 2 条 -->
              <template v-if="item.value === 2">
                每
                <a-select
                  :options="timeCardRange"
                  v-decorator="decorators.charge_value"
                  :disabled="!isEdit"
                  style="width: 66px"
                ></a-select>
              </template>
              {{ item.label }}
            </a-radio>
          </a-radio-group>
        </div>
      </st-form-item>
      <st-form-item v-if="formItemSwitches.entranceRestriction">
        <template slot="label">
          进入此区域限制
          <st-help-tooltip id="TSTXGZ006" />
        </template>
        <st-checkbox
          v-decorator="decorators.is_course"
          :disabled="!isEdit"
          class="mg-r8"
        ></st-checkbox>
        仅允许在此区域约课的用户入场
      </st-form-item>
    </st-form>
  </st-modal>
</template>
<script>
import {
  ruleOptions,
  formItemSwitches,
  alertMsg,
  timesCardRules
} from './area.config'
import { AreaService } from './area.service'
import {
  LEAVE_LIMIT,
  CHECKIN,
  PEOPLE_TYPE,
  ENTRY
} from '@/constants/setting/hardware'

export default {
  name: 'Area',
  serviceProviders() {
    return [AreaService]
  },
  serviceInject() {
    return {
      areaService: AreaService
    }
  },
  rxState() {
    const { areaService } = this
    return {
      rule: areaService.rule$,
      timeCardRange: areaService.timeCardRange$,
      info: areaService.info$,
      loading: areaService.loading$,
      whiteList: areaService.whiteList$
    }
  },
  bem: {
    bPage: 'modal-shop-blacklist'
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      show: false,
      form,
      decorators,
      LEAVE_LIMIT,
      ENTRY,
      CHECKIN,
      PEOPLE_TYPE,
      peopleType: 0,
      white_list: [],
      type: ENTRY.GATE // area类型
    }
  },
  computed: {
    /**
     * 根据场地类型控制特定 form-item 的显示隐藏
     */
    formItemSwitches,
    alertMsg,
    timesCardRules
  },
  mounted() {
    this.getWhiteList('')
    this.getInfo()
  },
  methods: {
    getWhiteList(val) {
      this.areaService.getWhiteList(val).subscribe()
    },
    getInfo() {
      this.areaService.getAreaInfo(this.id).subscribe(res => {
        const {
          area_id,
          course_time,
          people_type,
          leave_limit,
          checkin,
          white_list,
          charge_type,
          charge_value,
          is_course
        } = res.info
        this.peopleType = people_type
        this.$nextTick(() => {
          this.form.setFieldsValue({
            area_id,
            course_time,
            people_type,
            /**
             * 请不要再这么定义了！
             */
            leave_limit: leave_limit === LEAVE_LIMIT.TRUE,
            checkin,
            white_list,
            charge_type,
            charge_value,
            is_course
          })
        })
      })
    },
    getCurPeopleType(e) {
      this.peopleType = e.target.value
    },
    putAreaSetting(e) {
      if (!this.isEdit) {
        this.show = false
      }
      e.preventDefault()
      this.form.validate().then(values => {
        values.area_type = this.type
        values.leave_limit = values.leave_limit
          ? LEAVE_LIMIT.TRUE
          : LEAVE_LIMIT.FALSE
        this.areaService.putAreaSetting(values).subscribe(() => {
          this.$emit('success')
          this.show = false
        })
      })
    }
  }
}
</script>
