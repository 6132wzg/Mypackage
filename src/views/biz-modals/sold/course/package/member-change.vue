<template>
  <st-modal
    title="成员变更"
    v-model="show"
    width="880px"
    wrapClassName="modal-sold-course-extend"
  >
    <div :class="extend('content')">
      <a-row>
        <a-col :span="12">
          <st-info>
            <st-info-item label="支持使用人数上限">
              {{ packageInfo$.support_num }}
            </st-info-item>
          </st-info>
        </a-col>
      </a-row>

      <st-form labelWidth="88px">
        <div :class="extend('extend')">
          <st-form-item class="mg-b16" required>
            <template slot="label">
              购买人
            </template>
            <a-input
              v-model="packageInfo$.member_name"
              :disabled="true"
            ></a-input>
          </st-form-item>
          <st-form-item label="成员" class="mg-b0">
            <add-card-member
              v-model="list"
              addText="新增成员"
              :max="packageInfo$.support_num - 1"
              :type="1"
              productType="package"
            ></add-card-member>
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
import { MemberChangeService } from './member-change.service.ts'
import AddCardMember from '@/views/biz-components/member/add-card-member/add-card-member'
import { get } from 'lodash'
export default {
  name: 'ModalSoldCourseMemberCHange',
  bem: {
    extend: 'modal-sold-course-extend'
  },
  serviceInject() {
    return {
      service: MemberChangeService
    }
  },
  rxState() {
    const { packageInfo$, loading$ } = this.service
    return { packageInfo$, loading$ }
  },
  components: {
    AddCardMember
  },
  props: ['id'],
  data() {
    return {
      date: void 0,
      list: [],
      show: false
    }
  },
  created() {
    this.service.getMemberInfo(this.id).subscribe(res => {
      this.list = this.packageInfo$.course_members
    })
  },
  methods: {
    moment,
    onChangeDate(value) {
      this.date = value
    },
    onSubmit() {
      const course_members = this.list.map(item => {
        item.id = item.id || 0
        if (item.is_minors === 1) {
          item.mobile = ''
        }
        delete item.isEdit
        return item
      })
      this.service
        .setMember({
          id: this.id,
          course_members
        })
        .subscribe(res => {
          this.$emit('success')
          this.show = false
        })
    }
  }
}
</script>
