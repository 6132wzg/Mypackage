<template>
  <st-modal
    title="修改有效时间"
    size="small"
    v-model="show"
    wrapClassName="modal-sold-course-settime"
  >
    <div :class="settime('content')">
      <a-row :class="settime('info')" class="mg-b0">
        <a-col :span="24">
          <st-info>
            <st-info-item label="购课人">
              {{ courseData.member_name }}
            </st-info-item>
            <st-info-item label="手机号">
              {{ courseData.mobile }}
            </st-info-item>
            <st-info-item label="到期时间">
              {{ courseData.end_time }}
            </st-info-item>
            <st-info-item label="有效开始时间">
              {{ courseData.buy_time }}
            </st-info-item>
          </st-info>
        </a-col>
      </a-row>
      <st-hr class="mg-0" />
      <st-form :form="form" labelWidth="68px">
        <div :class="settime('settime')">
          <st-form-item
            label="到期日期"
            class="mg-t24"
            required
            labelGutter="12px"
          >
            <a-date-picker
              :disabledDate="disabledEndDate"
              v-decorator="decorators.end_time"
              style="width: 100%;"
              format="YYYY-MM-DD HH:mm"
              :showTime="{ format: 'YYYY-MM-DD HH:mm' }"
              placeholder="到期日期"
              :allowClear="false"
              :showToday="false"
            />
          </st-form-item>
          <st-form-item label="备注" class="mg-b0" labelGutter="12px">
            <a-textarea
              v-decorator="decorators.description"
              :autosize="{ minRows: 4, maxRows: 6 }"
            />
          </st-form-item>
        </div>
      </st-form>
    </div>
    <template slot="footer">
      <st-button type="primary" @click="onSubmit" :loading="loading.reduceTime">
        确认提交
      </st-button>
    </template>
  </st-modal>
</template>
<script>
import { SettimeService } from './set-time-personal.service'
import moment from 'moment'
import { ruleOptions } from './set-time-personal.config'
export default {
  name: 'ModalSoldCourseSettime',
  bem: {
    settime: 'modal-sold-course-settime'
  },
  serviceProviders() {
    return [SettimeService]
  },
  serviceInject() {
    return {
      setTimeService: SettimeService
    }
  },
  rxState() {
    return {
      loading: this.setTimeService.loading$
    }
  },
  props: {
    courseData: {
      type: Object
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
  filters: {
    timeFormatFilter(data) {
      return data ? moment(data).format('YYYY-MM-DD HH:mm') : '-'
    }
  },
  methods: {
    moment,
    disabledEndDate(endValue) {
      return (
        endValue.valueOf() < Date.now() ||
        endValue.valueOf() > moment(this.courseData.end_time).valueOf()
      )
    },
    onSubmit() {
      this.form.validate().then(values => {
        this.setTimeService
          .reduceTime({
            sold_id: this.courseData.id,
            end_time: values.end_time.format('YYYY-MM-DD HH:mm'),
            description: values.description
          })
          .subscribe(res => {
            this.show = false
            this.$emit('success')
          })
      })
    }
  }
}
</script>
