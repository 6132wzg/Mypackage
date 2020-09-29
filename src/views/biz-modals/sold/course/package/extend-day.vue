<template>
  <st-modal
    title="延长有效期"
    v-model="show"
    wrapClassName="modal-sold-course-extend"
  >
    <div :class="extend('content')">
      <biz-sold-course-info :info="packageInfo$"></biz-sold-course-info>
      <st-form :form="form" labelWidth="88px">
        <div :class="extend('extend')">
          <st-form-item class="mg-b16" required>
            <template slot="label">
              延长有效期
            </template>
            <st-input-number
              :max="999"
              :min="1"
              placeholder="请输入延长天数"
              @change="onChangeDate"
              v-decorator="decorators.extend_days"
            >
              <span slot="addonAfter">
                天
              </span>
            </st-input-number>
          </st-form-item>
          <st-form-item label="到期时间" required>
            {{ expirationDate }}
          </st-form-item>
          <st-form-item label="备注" class="mg-b0">
            <st-textarea
              v-decorator="decorators.description"
              :autosize="{ minRows: 4, maxRows: 6 }"
              :maxlength="500"
            />
          </st-form-item>
        </div>
      </st-form>
    </div>
    <template slot="footer">
      <st-button @click="onSubmit" type="primary">
        确认提交
      </st-button>
    </template>
  </st-modal>
</template>

<script>
import moment from 'moment'
import { ExtendDayService } from './extend-day.service.ts'
import BizSoldCourseInfo from '@/views/biz-components/sold/cource-info.vue'
import { ruleOptions } from './extend-day.config'
import { get } from 'lodash'
export default {
  name: 'ModalSoldCourseExtend',
  bem: {
    extend: 'modal-sold-course-extend'
  },
  serviceInject() {
    return {
      extendDayService: ExtendDayService
    }
  },
  rxState() {
    const { packageInfo$, loading$ } = this.extendDayService
    return { packageInfo$, loading$ }
  },
  props: ['id'],
  components: {
    BizSoldCourseInfo
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      addDate: 0,
      show: false
    }
  },
  computed: {
    expirationDate() {
      const time = get(this.packageInfo$, 'course_end_time')
      return moment(time)
        .add(this.addDate, 'days')
        .format('YYYY-MM-DD HH:ss')
    }
  },
  created() {
    this.extendDayService.getPackageInfo(this.id).subscribe()
  },
  methods: {
    moment,
    onChangeDate(value) {
      this.addDate = value
    },
    onSubmit() {
      this.form.validate().then(values => {
        values.extend_days = +values.extend_days
        this.extendDayService
          .setExtend({
            id: this.id,
            ...values
          })
          .subscribe(res => {
            this.$emit('success')
            this.show = false
          })
      })
    }
  }
}
</script>
