<template>
  <a-row :class="course('info')">
    <a-col :span="13" class="mg-b36">
      <st-info>
        <st-info-item label="课程包名称">
          {{ info.course_name }}
        </st-info-item>
        <st-info-item class="mg-b0" label="剩余课时">
          {{ info.remain_course_num }}
        </st-info-item>
      </st-info>
    </a-col>
    <a-col :span="11" class="mg-b36">
      <st-info>
        <st-info-item label="会员姓名">
          {{ info.member_name }}
        </st-info-item>
        <st-info-item class="mg-b0" label="手机号">
          {{ info.phone || info.mobile }}
        </st-info-item>
      </st-info>
    </a-col>
    <a-col :span="13" class="mg-b36">
      <st-info>
        <st-info-item label="购买课时">
          {{ info.buy_course_num }}
        </st-info-item>
        <st-info-item class="mg-b0" label="到期时间">
          {{ info.course_end_time }}
        </st-info-item>
      </st-info>
    </a-col>
    <a-col :span="11" class="mg-b36">
      <st-info>
        <st-info-item label="订单号">
          {{ info.order_id }}
        </st-info-item>
        <st-info-item class="mg-b0" label="订单状态">
          {{ info.order_status }}
        </st-info-item>
      </st-info>
    </a-col>

    <a-col :span="13" class="mg-b24">
      <st-info>
        <st-info-item label="实付金额">
          {{ info.paid_price || info.pay_price }}
        </st-info-item>
      </st-info>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'BizCourseInfo',
  bem: {
    course: 'slod-course'
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style></style>
