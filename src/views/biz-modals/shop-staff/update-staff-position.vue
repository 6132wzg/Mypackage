<template>
  <st-modal title="更改员工职位" @ok="onSubmit" size="small" v-model="show">
    <staff-info :staff="staff"></staff-info>
    <st-form labelWidth="70px" :form="form">
      <st-form-item label="工作性质">
        <a-select
          v-decorator="decorators.nature_work"
          placeholder="请选择工作性质"
        >
          <a-select-option
            :value="item.value"
            v-for="item in natureWork"
            :key="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </st-form-item>
      <st-form-item label="员工职能" required>
        <a-select
          v-decorator="decorators.identity"
          mode="multiple"
          placeholder="请选择员工职能"
          @change="onChangeIdentity"
          @deselect="onDeselectIndentity"
        >
          <a-select-option
            :value="item.value"
            v-for="item in identityList"
            :key="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
        <staff-modal-tips
          :list="tips"
          :canNotDelete="!operate"
          v-if="!canDeleteIdentity && tips.length"
        ></staff-modal-tips>
      </st-form-item>
      <st-form-item
        :label="`${$c('coach')}等级`"
        :required="!canDeleteIdentity || coach_level_required"
        v-show="!canDeleteIdentity || coach_level_required"
      >
        <a-select
          v-decorator="decorators.coach_level_id"
          :placeholder="`请选择${$c('coach')}等级`"
        >
          <a-select-option
            :value="item.id"
            v-for="item in coachLevelList"
            :key="item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </st-form-item>
      <st-form-item label="薪资模板">
        <a-select
          v-decorator="decorators.basic_salary"
          placeholder="请选择底薪模版"
        >
          <a-select-option
            :value="item.id"
            v-for="item in salaryBasic"
            :key="item.id"
            :disabled="!item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </st-form-item>
      <st-form-item label=" ">
        <a-select
          v-decorator="decorators.sale_percentage"
          placeholder="请选择薪资模板"
        >
          <a-select-option
            :value="item.id"
            v-for="item in salarySale"
            :key="item.id"
            :disabled="!item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </st-form-item>
      <st-form-item label=" ">
        <a-select
          v-decorator="decorators.course_percentage"
          placeholder="请选择课程模板"
          v-show="isSalaryCourse"
        >
          <a-select-option
            :value="item.id"
            v-for="item in salaryCourse"
            :key="item.id"
            :disabled="!item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </st-form-item>
    </st-form>
  </st-modal>
</template>
<script>
import { UpdateStaffPositionService } from './update-staff-position.service'
import { MessageService } from '../../../services/message.service'
import StaffInfo from './staff-info'
import StaffModalTips from '@/views/biz-components/staff/staff-modal-tips'
import { ruleOptions } from './update-staff-position.config'
import { cloneDeep } from 'lodash-es'

export default {
  serviceInject() {
    return {
      updateStaffPositionService: UpdateStaffPositionService,
      msg: MessageService
    }
  },
  rxState() {
    return {
      identityList: this.updateStaffPositionService.identityList$,
      natureWork: this.updateStaffPositionService.natureWork$,
      positionInfo: this.updateStaffPositionService.positionInfo$,
      coachLevelList: this.updateStaffPositionService.coachLevelList$,
      salaryBasic: this.updateStaffPositionService.salaryBasic$,
      salarySale: this.updateStaffPositionService.salarySale$,
      salaryCourse: this.updateStaffPositionService.salaryCourse$
    }
  },
  name: 'UpdateStaffPosition',
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false,
      isSalaryCourse: false,
      tips: [],
      operate: false,
      canDeleteIdentity: true,
      coach_level_required: false
    }
  },
  props: {
    staff: {
      type: Object,
      default: () => {}
    }
  },
  filters: {
    identityFilter(key) {
      const identityTag = [
        'role-staff',
        'role-saler',
        'coach-personal',
        'coach-team',
        'swimming-coach'
      ]
      return identityTag[key - 1]
    }
  },
  watch: {
    identity(newval) {
      this.isSalaryCourse = newval.includes(3) || newval.includes(4)
    }
  },
  components: {
    StaffInfo,
    StaffModalTips
  },
  computed: {
    identity() {
      return this.staff && this.staff.identity
    }
  },
  mounted() {
    this.updateStaffPositionService.init(this.staff.id).subscribe(res => {
      this.initFormData()
    })
  },
  methods: {
    initFormData() {
      let {
        basic_salary,
        coach_level_id,
        course_percentage,
        identity,
        nature_work,
        sale_percentage
      } = this.positionInfo
      if (!nature_work) {
        nature_work = undefined
      }
      this.onChangeIdentity(identity)
      let obj = {
        coach_level_id,
        sale_percentage,
        course_percentage,
        basic_salary,
        identity,
        nature_work
      }
      this.form.setFieldsValue(obj)
    },
    onChangeIdentity(value) {
      this.isSalaryCourse = value.includes(3) || value.includes(4)
      this.coach_level_required = value.includes(4)
    },
    onDeselectIndentity(value) {
      this.updateStaffPositionService
        .validatStaffPosition(this.staff.id, value)
        .subscribe(res => {
          let operate = res.operate
          if (!operate) {
            let obj = this.identity.filter(item => item.id === value)
            let identity = [
              ...obj.map(item => item.id),
              ...this.form.getFieldValue('identity')
            ]
            this.form.setFieldsValue({
              identity
            })
            this.tips = res.list
            this.operate = res.operate
            this.canDeleteIdentity = false
          }
        })
    },
    onSubmit(e) {
      e.preventDefault()
      this.form.validate().then(values => {
        let form = cloneDeep(values)
        // 如果选择职位从私人教练到其他职位时，将教练等级值置为 undefined
        if (!this.coach_level_required && this.canDeleteIdentity) {
          form.coach_level_id = undefined
        }
        this.updateStaffPositionService
          .putStaffBindPosition({
            id: this.staff.id,
            ...values
          })
          .subscribe(() => {
            this.show = false
          })
      })
    }
  }
}
</script>
