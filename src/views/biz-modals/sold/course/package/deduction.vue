<template>
  <st-modal
    title="课程包扣次"
    v-model="show"
    wrapClassName="modal-sold-package-deduction"
  >
    <div :class="extend('content')">
      <st-info labelWidth="110px">
        <st-info-item
          v-for="(item, key) in packageInfo$.infoArr"
          :label="item.label"
          :key="key"
        >
          {{ item.value }}
        </st-info-item>
      </st-info>
      <st-form :form="form" labelWidth="140px">
        <!-- <st-form-item class="mg-b16" required label="扣除课程类型">
          <a-checkbox-group :options="courseTypeOptions"></a-checkbox-group>
        </st-form-item> -->
        <div v-if="!packageInfo$.is_total">
          <st-form-item
            v-if="packageInfo$.is_team"
            class="mg-b16"
            :required="!personalCount"
            label="扣除团课"
          >
            <st-input-number
              :min="1"
              :max="packageInfo$.team_course_remain"
              @change="onChangeTeam"
              v-decorator="decorators.team_num"
              style="width: 120px"
            >
              <span slot="addonAfter">次</span>
            </st-input-number>
          </st-form-item>
          <st-form-item
            v-if="packageInfo$.is_personal"
            class="mg-b16"
            :required="!teamCount"
            label="扣除私教课"
          >
            <st-input-number
              :min="1"
              :max="packageInfo$.personal_course_remain"
              v-decorator="decorators.personal_num"
              @change="onChangePersonal"
              palceholder="私教扣次"
              style="width: 120px"
            >
              <span slot="addonAfter">次</span>
            </st-input-number>
          </st-form-item>
        </div>
        <div v-else>
          <st-form-item
            class="mg-b16"
            :required="!totalCount"
            label="扣除团课&私教课"
          >
            <st-input-number
              :min="1"
              :max="packageInfo$.total_times"
              v-decorator="decorators.total_num"
              @change="onChangeTotal"
              palceholder="扣除团课&私教课扣次"
              style="width: 120px"
            >
              <span slot="addonAfter">次</span>
            </st-input-number>
          </st-form-item>
        </div>
        <st-form-item class="mg-b16" required label="扣除时间">
          <a-date-picker
            :disabledDate="disabledDate"
            v-decorator="decorators.deduction_time"
          />
        </st-form-item>
        <st-form-item class="mg-b16" label="备注">
          <st-textarea
            v-decorator="decorators.content"
            :autosize="{ minRows: 4, maxRows: 6 }"
            :maxlength="200"
          ></st-textarea>
        </st-form-item>
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
import { DeductionService } from './deduction.service.ts'
import { ruleOptions } from './deduction.config'
export default {
  name: 'ModalSoldPackageDeduction',
  bem: {
    extend: 'modal-sold-package-deduction'
  },
  serviceInject() {
    return {
      service: DeductionService
    }
  },
  rxState() {
    let { packageInfo$ } = this.service
    return {
      packageInfo$
    }
  },
  props: {
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      courseTypeOptions: [
        { label: '团课', value: 1 },
        { label: '私教课', value: 2 }
      ],
      teamCount: 0,
      personalCount: 0,
      totalCount: 0,
      show: false
    }
  },
  created() {
    this.service.getDeduction(this.id).subscribe(res => {
      console.log(res)
    })
  },
  methods: {
    onChangeTeam(value) {
      this.teamCount = value
    },
    onChangePersonal(value) {
      this.personalCount = value
    },
    onChangeTotal(value) {
      this.totalCount = value
    },
    disabledDate(current) {
      return (
        moment().subtract(1, 'M') > current || moment().add(1, 'M') < current
      )
    },
    onSubmit() {
      this.form.validate().then(values => {
        values.deduction_time = moment(values.deduction_time).format(
          'YYYY-MM-DD'
        )
        values.personal_num = +values.personal_num
        values.team_num = +values.team_num
        this.service.setDeduction({ id: this.id, ...values }).subscribe(res => {
          this.show = false
        })
      })
    }
  }
}
</script>
