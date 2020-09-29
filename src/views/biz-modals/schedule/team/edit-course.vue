<template>
  <st-modal :footer="null" title="编辑课程排期" v-model="show">
    <div>
      <span>已约</span>
      <span>{{ reserved_num }}人</span>
    </div>
    <st-form :form="form" labelAuto>
      <st-form-item label="时间" required>
        <a-date-picker
          :showTime="{ format: 'HH:mm' }"
          placeholder="请选择时间"
          format="YYYY-MM-DD HH:mm"
          :disabled="disabled"
          v-decorator="decorators.start_time"
        >
          <a-icon slot="suffixIcon" type="clock-circle" />
        </a-date-picker>
      </st-form-item>
      <st-form-item label="课程" required>
        <a-select
          placeholder="请选择课程"
          :disabled="disabled"
          v-decorator="decorators.course_id"
        >
          <a-select-option
            v-for="course in courseOptions"
            :key="course.id"
            :value="course.id"
          >
            {{ course.course_name }}
          </a-select-option>
        </a-select>
      </st-form-item>
      <st-form-item :label="$c('coach')" required>
        <a-select
          :placeholder="`请选择${$c('coach')}`"
          v-decorator="decorators.coach_id"
        >
          <a-select-option
            v-for="coach in coachOptions"
            :key="coach.id"
            :value="coach.id"
          >
            {{ coach.staff_name }}
          </a-select-option>
        </a-select>
      </st-form-item>
      <st-form-item label="场地">
        <a-cascader
          placeholder="请选择场地"
          :disabled="!!reserved_num"
          :options="courtOptions"
          :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
          v-decorator="decorators.court_id"
        />
      </st-form-item>
      <st-form-item label="人数" required>
        <st-input-number
          placeholder="请输入人数"
          v-decorator="decorators.limit_num"
        >
          <span slot="addonAfter" class="addon-width">人</span>
        </st-input-number>
      </st-form-item>
      <st-form-item>
        <template slot="label">
          单节预约
          <st-help-tooltip id="TBCPC005" />
        </template>
        <st-checkbox
          :disabled="disabled"
          v-model="info.is_support_reserve_once"
          @change="onSingleReserveChange"
        >
          支持单节付费预约
        </st-checkbox>
        <st-input-number
          v-if="info.is_support_reserve_once"
          float
          v-decorator="decorators.course_fee"
          style="width: 160px"
          :disabled="disabled"
        >
          <span slot="addonAfter" class="addon-width">元/节</span>
        </st-input-number>
      </st-form-item>
      <st-form-item label="预约高级设置">
        <a-radio-group
          v-decorator="decorators.reserve_limit_type"
          @change="onLimitTypeChange"
        >
          <st-form-item style="margin-left: -24px">
            <a-radio :value="RESERVE_LIMIT_TYPE.NOT_LIMIT">不设置</a-radio>
          </st-form-item>
          <st-form-item style="margin-left: -24px">
            <a-radio :value="RESERVE_LIMIT_TYPE.DATE">
              定时开放预约
              <a-date-picker
                style="width: 180px"
                placeholder="请选择时间"
                :showTime="{ format: 'HH:mm' }"
                format="YYYY-MM-DD HH:mm"
                :disabled="
                  form.getFieldValue('reserve_limit_type') !==
                    RESERVE_LIMIT_TYPE.DATE
                "
                v-decorator="decorators.reserve_limit_date"
              >
                <a-icon slot="suffixIcon" type="clock-circle" />
              </a-date-picker>
            </a-radio>
          </st-form-item>
          <st-form-item style="margin-left: -24px">
            <a-radio :value="RESERVE_LIMIT_TYPE.TIME">
              课程需提前
              <st-input-number
                style="width: 100px"
                placeholder="请输入"
                :min="1"
                :max="168"
                :disabled="
                  form.getFieldValue('reserve_limit_type') !==
                    RESERVE_LIMIT_TYPE.TIME
                "
                v-decorator="decorators.reserve_limit_time"
              />
              小时预约
            </a-radio>
          </st-form-item>
        </a-radio-group>
      </st-form-item>
      <st-form-item label="说明">
        <st-textarea
          placeholder="请输入说明"
          v-decorator="decorators.description"
          :autosize="{ maxRows: 4 }"
          maxlength="200"
        ></st-textarea>
        <div>
          是否将说明显示在小程序
          <st-switch
            class="mg-l12"
            v-decorator="decorators.is_show_description"
          />
        </div>
      </st-form-item>
      <a-row>
        <a-col :span="24" :style="{ textAlign: 'right' }">
          <st-button class="mg-r16" @click="onClick">取消</st-button>
          <st-button type="primary" :loading="loading.update" @click="onSubmit">
            确认
          </st-button>
        </a-col>
      </a-row>
    </st-form>
  </st-modal>
</template>

<script>
import { cloneDeep } from 'lodash-es'
import { TeamService } from '@/views/pages/shop/product/course/schedule/team/team.service'
import { TeamScheduleScheduleService } from '@/views/pages/shop/product/course/schedule/team/service#/schedule.service'
import { TeamScheduleCommonService } from '@/views/pages/shop/product/course/schedule/team/service#/common.service'
import { RESERVE_LIMIT_TYPE } from '@/constants/course/team'
import { ruleOptions } from './add-course.config'
export default {
  name: 'EditCourseSchedule',
  serviceInject() {
    return {
      teamScheduleScheduleService: TeamScheduleScheduleService,
      teamScheduleCommonService: TeamScheduleCommonService,
      teamService: TeamService
    }
  },
  rxState() {
    const tss = this.teamScheduleCommonService
    return {
      loading: this.teamScheduleScheduleService.loading$,
      coachOptions: tss.coachOptions$,
      courseOptions: tss.courseOptions$,
      courtOptions: tss.courtOptions$
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      reserved_num: 0,
      show: false,
      info: {},
      RESERVE_LIMIT_TYPE
    }
  },
  computed: {
    disabled() {
      return !!this.reserved_num
    }
  },
  props: {
    id: {
      type: Number,
      default: -1
    }
  },
  mounted() {
    this.teamScheduleScheduleService.getUpdateInfo(this.id).subscribe(res => {
      let {
        id,
        course_id,
        coach_id,
        course_fee,
        court_id,
        court_site_id,
        start_time,
        reserved_num,
        is_show_description,
        limit_num,
        reserve_limit_type,
        reserve_limit_time,
        description
      } = res.info
      start_time = moment(start_time)
      court_id = [court_id, court_site_id]
      this.id = id
      this.info = res.info
      this.$nextTick(() => {
        this.form.setFieldsValue({
          course_id,
          coach_id,
          course_fee,
          is_show_description,
          court_id,
          start_time,
          limit_num,
          reserve_limit_type,
          description
        })
        // 预约高级设置初始化
        if (reserve_limit_time) {
          switch (reserve_limit_type) {
            case RESERVE_LIMIT_TYPE.DATE:
              this.form.setFieldsValue({
                reserve_limit_date: moment(reserve_limit_time)
              })
              break
            case RESERVE_LIMIT_TYPE.TIME:
              this.form.setFieldsValue({ reserve_limit_time })
              break
            default:
          }
        }
      })
      this.reserved_num = reserved_num
    })
  },
  methods: {
    onClick() {
      this.show = false
    },
    onSubmit() {
      this.form.validate().then(values => {
        values.start_time = values.start_time.format('YYYY-MM-DD HH:mm')
        values.court_site_id = values.court_id[1]
        values.court_id = values.court_id[0]
        values.course_fee = +values.course_fee
        values.limit_num = +values.limit_num
        values.is_support_reserve_once = this.info.is_support_reserve_once
        switch (values.reserve_limit_type) {
          case RESERVE_LIMIT_TYPE.DATE:
            values.reserve_limit_time = values.reserve_limit_date.format(
              'YYYY-MM-DD HH:mm'
            )
            break
          case RESERVE_LIMIT_TYPE.TIME:
            values.reserve_limit_time = +values.reserve_limit_time
            break
          default:
            values.reserve_limit_type = RESERVE_LIMIT_TYPE.NOT_LIMIT
            break
        }
        this.teamScheduleScheduleService
          .update({ id: this.id, ...values })
          .subscribe(() => {
            this.$emit('ok')
            this.show = false
          })
      })
    },
    onLimitTypeChange() {
      this.form.setFieldsValue({
        reserve_limit_time: '',
        reserve_limit_date: null
      })
    },
    onSingleReserveChange(val) {
      this.is_support_reserve_once = val
    }
  }
}
</script>
