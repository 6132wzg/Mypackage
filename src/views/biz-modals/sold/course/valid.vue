<template>
  <st-modal
    title="确认生效"
    v-model="show"
    wrapClassName="modal-sold-course-valid"
  >
    <div :class="refund('content')">
      <a-row :class="refund('info')">
        <a-col :span="13" class="mg-b36">
          <st-info>
            <st-info-item label="课程名称">
              {{ info.course_name }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="11" class="mg-b36">
          <st-info>
            <st-info-item class="mg-b0" label="有效期">
              {{ packageInfo$.valid_date }}
            </st-info-item>
          </st-info>
        </a-col>
      </a-row>
    </div>
    <template slot="footer">
      <st-button @click="onCancel" class="mg-r16">
        取消
      </st-button>
      <st-button
        @click="onSubmit"
        :loading="loading.setValidCourse"
        type="primary"
      >
        确认提交
      </st-button>
    </template>
  </st-modal>
</template>

<script>
import { ValidService } from './valid.service'
export default {
  name: 'ModalSoldCourseValid',
  bem: {
    refund: 'modal-sold-course-refund'
  },
  serviceInject() {
    return {
      validService: ValidService
    }
  },
  rxState() {
    return {
      loading: this.validService.loading$,
      packageInfo$: this.validService.packageInfo$
    }
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      show: true
    }
  },
  methods: {
    onCancel() {
      this.show = false
    },
    onSubmit() {
      this.validService.setValidCourse({ id: this.info.id }).subscribe(res => {
        this.$emit('success')
        this.show = false
      })
    }
  },
  created() {
    this.validService.getValidInfo(this.info.id).subscribe()
  }
}
</script>
