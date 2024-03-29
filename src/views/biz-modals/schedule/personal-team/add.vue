<template>
  <st-modal
    title="新增课程排期"
    v-model="show"
    size="small"
    wrapClassName="modal-shop-personal-team-add"
  >
    <st-form :form="form" labelWidth="54px" labelAuto>
      <st-form-item label="时间" required>
        <a-date-picker
          class="full-width"
          :showTime="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          v-decorator="decorators.start_time"
        >
          <a-icon slot="suffixIcon" type="clock-circle" />
        </a-date-picker>
      </st-form-item>
      <st-form-item label="课程" required>
        <a-select
          v-decorator="decorators.course_id"
          @change="onChangeGetCourseId"
        >
          <a-select-option
            v-for="course in courseOptions"
            :key="course.id"
            :value="course.id"
          >
            {{ course.name }}
          </a-select-option>
        </a-select>
      </st-form-item>
      <st-form-item :label="$c('coach')" required>
        <a-select v-decorator="decorators.coach_id">
          <a-select-option
            v-for="coach in courseCoachOptions"
            :key="coach.id"
            :value="coach.id"
          >
            {{ coach.name }}
          </a-select-option>
        </a-select>
      </st-form-item>
      <st-form-item label="人数" required>
        <a-input-search v-decorator="decorators.limit_num" type="number">
          <a-button slot="enterButton">人</a-button>
        </a-input-search>
      </st-form-item>
      <st-form-item label="单节预约价格" required class="mg-b0">
        <a-input-search v-decorator="decorators.course_fee" type="number">
          <a-button slot="enterButton">元/节</a-button>
        </a-input-search>
      </st-form-item>
    </st-form>
    <template slot="footer">
      <st-button @click="addInBatch">批量设置</st-button>
      <st-button class="mg-l8" type="primary" @click="onSubmit">
        提交
      </st-button>
    </template>
  </st-modal>
</template>

<script>
import { MessageService } from '@/services/message.service'
import { PersonalTeamScheduleScheduleService as ScheduleService } from '@/views/pages/shop/product/course/schedule/personal-team/service#/schedule.service'
import { PersonalTeamScheduleCommonService as CommonService } from '@/views/pages/shop/product/course/schedule/personal-team/service#/common.service'
import SchedulePersonalTeamAddInBatch from '@/views/biz-modals/schedule/personal-team/add-in-batch'
import { ruleOptions } from './add.config'

export default {
  name: 'AddCourseSchedule',
  modals: {
    SchedulePersonalTeamAddInBatch
  },
  serviceInject() {
    return {
      messageService: MessageService,
      scheduleService: ScheduleService,
      commonService: CommonService
    }
  },
  rxState() {
    const commonService = this.commonService
    return {
      courseOptions: commonService.courseOptions$,
      courseCoachOptions: commonService.courseCoachOptions$
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false
    }
  },
  props: {
    time: {
      type: Object,
      default: () => {
        return moment()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initStartTime()
    })
  },
  methods: {
    onChangeGetCourseId(id) {
      this.commonService.getCourseCoachList(id).subscribe()
    },
    initStartTime() {
      this.form.setFieldsValue({
        start_time: this.time
      })
    },
    onSubmit() {
      this.form.validate().then(values => {
        const data = this.dataFilter(values)
        data.course_fee = +data.course_fee
        data.limit_num = +data.limit_num
        this.scheduleService.add(data).subscribe(this.onSubmitSuccess)
      })
    },
    addInBatch() {
      this.$emit('onClickBatch')
      this.show = false
      // this.$modalRouter.push({
      //   name: 'schedule-personal-team-add-in-batch'
      // })
    },
    dataFilter(data) {
      data.start_time = data.start_time.format('YYYY-MM-DD HH:mm')
      return data
    },
    onSubmitSuccess() {
      this.show = false
      this.$emit('ok')
    }
  }
}
</script>
