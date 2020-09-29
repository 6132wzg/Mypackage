<template>
  <st-modal
    :title="
      id
        ? `编辑${type === 'small' ? '私教小' : ''}团课周课表`
        : `新增${type === 'small' ? '私教小' : ''}团课周课表`
    "
    @ok="save"
    okText="确定"
    v-model="show"
    :loading="
      id
        ? type === 'team'
          ? loading.editTeamDetail
          : loading.editSmallDetail
        : type === 'team'
        ? loading.addTeamDetail
        : loading.addSmallDetail
    "
    width="1200px"
    :class="basic()"
  >
    <div :class="basic('form')">
      <st-form :form="form" labelWidth="96px">
        <st-form-item label="课表名称" required>
          <a-input
            placeholder="请输入课表名称"
            v-decorator="decorators.templateName"
            :class="basic('form-name')"
            maxlength="30"
          />
        </st-form-item>
        <st-form-item label="排期起止时间" required>
          <a-range-picker
            v-decorator="decorators.dateTime"
            :disabledDays="180"
            :showTime="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
          />
        </st-form-item>
        <st-form-item label="排课限制">
          最多排
          <st-input-number
            placeholder="不填则默认排满"
            :class="basic('form-number')"
            v-decorator="decorators.maxNumber"
          >
            <span slot="addonAfter">节</span>
          </st-input-number>
        </st-form-item>
        <st-form-item
          label="每周上课安排"
          :help="tableTips"
          :validateStatus="tableErr ? 'error' : ''"
          required
        >
          <div :class="basic('border-box')">
            <st-form-table hoverable :isEmpty="false">
              <thead>
                <tr>
                  <th>
                    <label class="color-danger">*</label>
                    星期
                  </th>
                  <th>
                    <label class="color-danger">*</label>
                    课程
                  </th>
                  <th>
                    <label class="color-danger">*</label>
                    开始时间
                  </th>
                  <th>
                    <label class="color-danger">*</label>
                    上课{{ $c('coach') }}
                  </th>
                  <th v-if="type === 'team'">场地</th>
                  <th>
                    <label class="color-danger">*</label>
                    人数
                  </th>
                  <th style="width: 120px">
                    单节预约
                    <st-help-tooltip id="TBCPC005" />
                  </th>
                  <th style="width:60px">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="8" class="st-form-table__add">
                    <st-button
                      type="dashed"
                      icon="add"
                      block
                      @click="addCourse"
                    >
                      新增
                    </st-button>
                  </td>
                </tr>
                <template v-for="(item, index) in scheduleInfo">
                  <tr :key="index">
                    <td>
                      <a-select
                        placeholder="请选择星期"
                        style="width: 86px"
                        v-model="item.week_day"
                        @change="verifyData(true)"
                      >
                        <a-select-option
                          v-for="week in weekDay"
                          :key="week.value"
                        >
                          {{ week.label }}
                        </a-select-option>
                      </a-select>
                    </td>
                    <td>
                      <a-select
                        placeholder="请选择课程"
                        style="width: 112px"
                        v-model="item.course_id"
                        @change="verifyData(true)"
                      >
                        <a-select-option
                          v-for="course in courseOptions"
                          :key="course.id"
                        >
                          {{
                            type === 'team' ? course.course_name : course.name
                          }}
                        </a-select-option>
                      </a-select>
                    </td>
                    <td>
                      <a-time-picker
                        style="width: 108px"
                        placeholder="选择时间"
                        format="HH:mm"
                        v-model="item.start_time"
                        @change="verifyData(true)"
                      />
                    </td>
                    <td>
                      <a-select
                        :placeholder="`请选择上课${$c('coach')}`"
                        style="width: 112px"
                        v-model="item.coach_id"
                        @change="verifyData(true)"
                      >
                        <a-select-option
                          v-for="coach in coachOptions"
                          :key="coach.id"
                        >
                          {{ type === 'team' ? coach.staff_name : coach.name }}
                        </a-select-option>
                      </a-select>
                    </td>
                    <td v-if="type === 'team'">
                      <a-cascader
                        style="width: 112px"
                        placeholder="请选择场地"
                        v-model="item.court_id"
                        :options="courtOptions"
                        :fieldNames="{
                          label: 'name',
                          value: 'id',
                          children: 'children'
                        }"
                      />
                    </td>
                    <td>
                      <st-input-number
                        style="width: 90px"
                        v-model="item.people_number"
                        @input="verifyData(true)"
                      >
                        <span slot="addonAfter">人</span>
                      </st-input-number>
                    </td>
                    <td>
                      <st-checkbox
                        v-model="item.is_support_reserve_once"
                        @change="verifyData(true)"
                      >
                        支持
                      </st-checkbox>
                      <st-input-number
                        v-if="item.is_support_reserve_once"
                        :float="true"
                        style="width: 140px; margin-left: -8px"
                        v-model="item.course_fee"
                        @input="verifyData(true)"
                        class="mg-t4"
                      >
                        <span slot="addonAfter">元/节</span>
                      </st-input-number>
                    </td>
                    <td>
                      <template>
                        <a @click="delRow(index)">删除</a>
                      </template>
                    </td>
                  </tr>
                </template>
              </tbody>
            </st-form-table>
          </div>
        </st-form-item>
        <st-form-item label="预约高级设置" v-if="type === 'team'">
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
      </st-form>
    </div>
  </st-modal>
</template>
<script>
import { AddEditCourseService } from './add-edit-course.service'
import { TeamScheduleCommonService } from '@/views/pages/shop/product/course/schedule/team/service#/common.service'
import { PersonalTeamScheduleCommonService } from '@/views/pages/shop/product/course/schedule/personal-team/service#/common.service'
import { UserService } from '@/services/user.service'
import { ruleOptions } from './add-edit-course.config'
import { RESERVE_LIMIT_TYPE } from '@/constants/course/team'

export default {
  serviceInject() {
    return {
      addEditCourseService: AddEditCourseService,
      teamScheduleCommonService: TeamScheduleCommonService,
      personalTeamScheduleCommonService: PersonalTeamScheduleCommonService,
      userService: UserService
    }
  },
  rxState() {
    const teamService = this.teamScheduleCommonService
    const personalService = this.personalTeamScheduleCommonService
    return {
      loading: this.addEditCourseService.loading$,
      weekDay: this.userService.getOptions$('shop.week_day'),
      coachOptionTeam: teamService.coachOptions$,
      courseOptionTeam: teamService.courseOptions$,
      courtOptionTeam: teamService.courtOptions$,
      courseOptionSmall: personalService.courseOptions$,
      coachOptionSmall: personalService.coachOptions$
    }
  },
  filters: {
    formatDate(val) {
      return val ? moment(val) : undefined
    }
  },
  name: 'addEditCourseService',
  bem: {
    basic: 'modal-schedule-batch-add-edit-course'
  },
  props: {
    id: {
      type: [Number, String],
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      coachOptions: [],
      courseOptions: [],
      courtOptions: [],
      scheduleInfo: [],
      show: false,
      tableTips: '', // 表单中表格提交错误提示语
      tableErr: false, // 表格是否有错
      RESERVE_LIMIT_TYPE
    }
  },
  created() {
    // 弹窗开启有id为编辑
    if (this.id) {
      // type:team为团课获取团课列表，small为私教小团课获取私教小团课列表
      let functionName = this.type === 'team' ? 'getTeamInfo' : 'getSmallInfo'
      this.addEditCourseService[functionName](this.id).subscribe(res => {
        // 显示数据回显
        this.form.setFieldsValue({
          templateName: res.info.template_name,
          maxNumber: res.info.max_number
        })
        if (this.type === 'team' && res.info.reserve_limit_type) {
          // 预约高级设置初始化
          switch (res.info.reserve_limit_type) {
            case RESERVE_LIMIT_TYPE.DATE:
              this.form.setFieldsValue({
                reserve_limit_type: res.info.reserve_limit_type,
                reserve_limit_date: moment(res.info.reserve_limit_time)
              })
              break
            case RESERVE_LIMIT_TYPE.TIME:
              this.form.setFieldsValue({
                reserve_limit_type: res.info.reserve_limit_type,
                reserve_limit_time: res.info.reserve_limit_time
              })
              break
          }
        }
        this.scheduleInfo = res.info.schedule_info.map(item => {
          return {
            course_id: item.course_id,
            coach_id: item.coach_id,
            court_id: [item.court_id, item.court_site_id],
            people_number: item.people_number,
            course_fee: item.course_fee,
            week_day: item.week_day,
            is_support_reserve_once: item.is_support_reserve_once,
            start_time: item.start_time
              ? moment(item.start_time, 'HH:mm')
              : undefined
          }
        })
      })
    }
    // 获取团课和私教小团课的课程和教练的选择项
    if (this.type === 'team') {
      this.coachOptions = this.coachOptionTeam // 教练
      this.courseOptions = this.courseOptionTeam // 课程
      this.courtOptions = this.courtOptionTeam // 场地
    } else {
      this.coachOptions = this.coachOptionSmall // 教练
      this.courseOptions = this.courseOptionSmall // 课程
    }
  },
  methods: {
    // 新增课表
    addCourse() {
      this.tableTips = ''
      this.tableErr = false
      this.scheduleInfo.push({
        course_id: null,
        coach_id: null,
        court_id: [],
        people_number: '',
        course_fee: '',
        week_day: null,
        start_time: null,
        is_support_reserve_once: 0
      })
    },
    // 排课安排删除
    delRow(index) {
      this.scheduleInfo.splice(index, 1)
      this.tableTips = ''
      this.tableErr = false
    },
    // 数据提交
    save(e) {
      let isOk = this.verifyData()
      this.form.validate().then(values => {
        // 对提交上课安排数据处理
        if (isOk) {
          return
        }
        let scheduleInfos = this.scheduleInfo.map(item => {
          return {
            week_day: item.week_day,
            course_id: item.course_id,
            start_time: moment(item.start_time).format('HH:mm'),
            coach_id: item.coach_id,
            court_id: item.court_id[0] || 0,
            court_site_id: item.court_id[1] || 0,
            people_number: item.people_number,
            is_support_reserve_once: item.is_support_reserve_once,
            course_fee: item.is_support_reserve_once
              ? item.course_fee
              : undefined
          }
        })
        // 最终提交数据
        let params = {
          template_name: values.templateName,
          max_number: values.maxNumber,
          start_time: moment(values.dateTime[0]).format('YYYY-MM-DD HH:mm'),
          end_time: moment(values.dateTime[1]).format('YYYY-MM-DD HH:mm'),
          schedule_info: scheduleInfos
        }
        // 团课预约高级设置
        if (this.type === 'team') {
          switch (values.reserve_limit_type) {
            case RESERVE_LIMIT_TYPE.DATE:
              params.reserve_limit_time = values.reserve_limit_date.format(
                'YYYY-MM-DD HH:mm'
              )
              params.reserve_limit_type = values.reserve_limit_type
              break
            case RESERVE_LIMIT_TYPE.TIME:
              params.reserve_limit_time = +values.reserve_limit_time
              params.reserve_limit_type = values.reserve_limit_type
              break
            default:
              params.reserve_limit_type = RESERVE_LIMIT_TYPE.NOT_LIMIT
              break
          }
        }
        if (this.id) {
          // 有id为编辑（team为调取团课编辑接口，small为调取私教小团课编辑接口）
          let editName =
            this.type === 'team' ? 'editTeamDetail' : 'editSmallDetail'
          this.addEditCourseService[editName](this.id, params).subscribe(
            res => {
              this.$emit('success', res)
              this.show = false
            }
          )
        } else {
          // 没id为新增（team为调取团课新增接口，small为调取私教小团课新增接口）
          let addName =
            this.type === 'team' ? 'addTeamDetail' : 'addSmallDetail'
          this.addEditCourseService[addName](params).subscribe(res => {
            this.$emit('success', res)
            this.show = false
          })
        }
      })
    },
    // 表格提交数据校验
    verifyData(isInput) {
      if (isInput) {
        this.tableTips = ''
        this.tableErr = false
        return
      }
      if (!this.scheduleInfo.length) {
        this.tableTips = '请新增上课安排'
        this.tableErr = true
        return true
      }
      for (let i = 0; i < this.scheduleInfo.length; i++) {
        let item = this.scheduleInfo[i]
        if (
          !item.week_day ||
          !item.course_id ||
          !item.start_time ||
          !item.coach_id ||
          !item.people_number ||
          (item.is_support_reserve_once && !item.course_fee)
        ) {
          this.tableTips = '请正确填写表格数据'
          this.tableErr = true
          return true
        }
      }
      this.tableTips = ''
      this.tableErr = false
      return false
    },
    onLimitTypeChange() {
      this.form.setFieldsValue({
        reserve_limit_time: '',
        reserve_limit_date: null
      })
    }
  }
}
</script>
