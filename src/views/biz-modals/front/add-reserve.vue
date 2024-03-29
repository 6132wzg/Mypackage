<template>
  <st-modal
    size="small"
    title="新增到访"
    v-model="show"
    @ok="onSubmit"
    :confirmLoading="loading$.addReserve"
  >
    <st-form :form="form">
      <form-member-search
        label="预约用户"
        :form="form"
        :decorators="decorators"
        :fields="{ member_id: 'reserve_id' }"
        type="transaction"
      ></form-member-search>
      <st-form-item label="预约时间" required>
        <!--
        :disabledTime="disabledDateTime"-->
        <a-date-picker
          v-decorator="decorators.reserve_date"
          placeholder="预约日期"
          allowClear
          :disabledDate="disabledDate"
          :showTime="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          style="width: 100%"
        ></a-date-picker>
      </st-form-item>
      <st-form-item label="接待人员">
        <a-select
          v-decorator="decorators.receptionist_id"
          :options="staffList$"
        ></a-select>
      </st-form-item>
    </st-form>
  </st-modal>
</template>

<script>
import moment from 'moment'
import { AddReserveService } from './add-reserve.service'
import { ruleOptions } from './add-reserve.config'
import FormMemberSearch from '@/views/biz-components/member/member-search/member-search'
import { cloneDeep } from 'lodash-es'
import { PatternService } from '@/services/pattern.service'
export default {
  name: 'FrontAddReserve',
  serviceProviders() {
    return [AddReserveService]
  },
  serviceInject() {
    return {
      addReserveService: AddReserveService,
      pattern: PatternService
    }
  },
  rxState() {
    const { loading$, memberList$, staffList$ } = this.addReserveService
    return {
      loading$,
      memberList$,
      staffList$
    }
  },
  components: {
    FormMemberSearch
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      show: true,
      form,
      decorators
    }
  },
  methods: {
    moment,
    range(start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },
    disabledDate(current) {
      return (
        current &&
        (current < moment().add(-1, 'day') ||
          current > moment().add(1, 'month'))
      )
    },
    disabledDateTime(current) {
      const currentHour = current.format('H')
      const currentMin = current.format('m')
      if (
        current.format('YYYY-MM-DD') ===
        moment()
          .add(1, 'month')
          .format('YYYY-MM-DD')
      ) {
        return {
          disabledHours: () => this.range(0, 24).splice(currentHour, 24),
          disabledMinutes: () => this.range(currentMin, 60)
        }
      }
    },
    addSubmit(form) {
      return form.mobile || form.parent_mobile
        ? this.addReserveService.addReserveCreate(form)
        : this.addReserveService.addReserve(form)
    },
    onSubmit() {
      this.form.validate().then(values => {
        let form = cloneDeep(values)
        form.reserve_date = moment(values.reserve_date).format('YYYY-MM-DD')
        form.reserve_time = moment(values.reserve_date).format('HH:mm')
        this.addSubmit({
          ...form,
          mobile: values.mobile ? values.mobile.phone : undefined,
          country_prefix: values.mobile ? values.mobile.code_id : undefined,
          is_minors: values.is_minors,
          parent_name: values.parent_name,
          parent_mobile: values.parent_mobile
            ? values.parent_mobile.phone
            : undefined,
          parent_country_prefix: values.parent_mobile
            ? values.parent_mobile.code_id
            : undefined,
          parent_user_role: values.parent_user_role
        }).subscribe(res => {
          this.show = false
          this.$emit('success')
        })
      })
    }
  },
  created() {
    this.addReserveService.getStaffList().subscribe()
  }
}
</script>
