<template>
  <st-modal
    :title="`修改${$c('coach')}`"
    size="small"
    v-model="show"
    :loading="loading.getInfo"
  >
    <st-form :form="form" labelWidth="72px">
      <div :class="coach('content')">
        <st-info :class="coach('info')">
          <st-info-item label="课程名称">{{ info.course_name }}</st-info-item>
          <st-info-item :label="`上课${$c('coach')}`">
            <st-overflow-text
              :value="record.coach_name.join('、')"
              maxWidth="350px"
            ></st-overflow-text>
          </st-info-item>
          <st-info-item label="有效期">
            {{ info.buy_time }} 至 {{ info.end_time }}
          </st-info-item>
        </st-info>
        <st-hr></st-hr>
        <st-form-item :label="`修改${$c('coach')}`" required>
          <a-radio-group
            :options="coachTypeOptions"
            v-decorator="decorators.coach_type"
            @change="onCoachTypeChange"
          ></a-radio-group>
        </st-form-item>
        <st-form-item labelFix v-if="isSupportSelectCoach">
          <a-select
            v-decorator="decorators.coach_ids"
            :placeholder="`选择修改${$c('coach')}`"
            mode="multiple"
          >
            <a-select-option
              v-for="(item, index) in coachList"
              :key="index"
              :value="item.id"
            >
              {{ item.staff_name }}
            </a-select-option>
          </a-select>
        </st-form-item>
        <st-form-item label="备注">
          <st-textarea
            :maxlength="30"
            v-decorator="decorators.description"
            :autosize="{ minRows: 4, maxRows: 6 }"
          />
        </st-form-item>
      </div>
    </st-form>
    <template slot="footer">
      <st-button @click="onSubmit" :loading="loading.edit" type="primary">
        确认提交
      </st-button>
    </template>
  </st-modal>
</template>

<script>
import moment from 'moment'
import { cloneDeep } from 'lodash-es'
import { CoachService } from './coach.service'
import { ruleOptions } from './coach.config'
export default {
  name: 'ModalSoldPersonalCoach',
  bem: {
    coach: 'modal-sold-personal-coach'
  },
  serviceInject() {
    return {
      coachService: CoachService
    }
  },
  rxState() {
    const { coachService } = this
    return {
      loading: coachService.loading$,
      info: coachService.info$,
      coachList: coachService.coachList$,
      coachTypeOptions: coachService.coachTypeOptions$
    }
  },
  props: {
    record: {
      type: Object,
      required: true
    }
  },
  created() {
    this.getInfo()
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
  computed: {
    isSupportSelectCoach() {
      /**
       * coach_type 1 指定教练
       */
      return this.info.coach_type === 1
    }
  },
  methods: {
    getInfo() {
      this.coachService.getInfo(this.record.id).subscribe(res => {
        this.getCoachList(res.coach_level_id, res.course_id)
      })
    },
    getCoachList(coachLevelId, courseId) {
      this.coachService.getCoachList(coachLevelId, courseId).subscribe(() => {
        this.initFieldsValue()
      })
    },
    initFieldsValue() {
      const { coach_type, coach_ids } = this.info
      this.form.setFieldsValue({
        coach_type,
        coach_ids
      })
    },
    onSubmit() {
      this.form.validate((error, values) => {
        if (!error) {
          this.coachService
            .edit(
              {
                coach_type: values.coach_type,
                coach_ids: values.coach_ids,
                description: values.description
              },
              this.record.id
            )
            .subscribe(res => {
              this.$emit('success')
              this.show = false
            })
        }
      })
    },
    moment,
    onCoachTypeChange(e) {
      this.info.coach_type = e.target.value
    }
  }
}
</script>
