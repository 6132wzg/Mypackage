<template>
  <st-modal title="旷课情况" :footer="null" v-model="show" width="640px">
    <div :class="b()">
      <div :class="b('left')">
        <div :class="b('item')" class="bg-gray">
          旷课课程
        </div>
        <div
          type="2"
          v-for="(item, index) in list"
          :key="index"
          :class="b('wrap')"
        >
          <div :class="b('title')">{{ item.class_info.course_name }}</div>
          <span :class="b('label')">时间：</span>
          <span :class="b('value')" class="mg-r16">
            {{ item.class_info.time }}
          </span>
          <span :class="b('label')">{{ $c('coach') }}：</span>
          <span :class="b('value')" class="coach">
            {{ item.class_info.coach_name }}
          </span>
        </div>
      </div>
      <div :class="b('right')">
        <div :class="b('item')" class="bg-gray">
          补课信息
        </div>
        <div
          type="2"
          v-for="(item, index) in list"
          :key="index"
          :class="b('wrap')"
        >
          <div :class="b('title')">
            {{ item.make_up_info && item.make_up_info.course_name }}
          </div>
          <div v-if="item.make_up_info">
            <span :class="b('label')">时间：</span>
            <span :class="b('value')" class="mg-r16">
              {{ item.make_up_info.time }}
            </span>
            <span :class="b('label')">{{ $c('coach') }}：</span>
            <span :class="b('value')" class="coach">
              {{ item.make_up_info.coach_name }}
            </span>
            <br />
            <span :class="b('label')">状态：</span>
            <span :class="b('value')">
              {{
                item.make_up_info.sign_status | enumFilter('reserve.is_checkin')
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </st-modal>
</template>
<script>
import { GroupUserClassTruancyService } from './small-course-truancy.service'
export default {
  name: 'SmallCourseTruancy',
  bem: {
    b: 'modal-course-group-class',
    bitem: 'modal-course-group-class-item'
  },
  serviceInject() {
    return {
      groupUserClassTruancyService: GroupUserClassTruancyService
    }
  },
  data() {
    return {
      show: false,
      list: []
    }
  },
  props: {
    type: {
      type: Number
    },
    memberId: {
      type: Number
    }
  },
  methods: {
    getCourseGroupClassUserInfo() {
      let para = {
        id: this.$route.query.courseId,
        member_id: this.memberId,
        class_type: this.type
      }
      return this.groupUserClassTruancyService
        .getCourseGroupClassUserInfo(para)
        .subscribe(res => {
          this.list = res.list
        })
    }
  },
  created() {
    this.getCourseGroupClassUserInfo()
  }
}
</script>
