<template>
  <a-row :class="course('info')">
    <a-col :span="13" class="mg-b36">
      <st-info>
        <st-info-item label="卡名">
          {{ info.card_name }}
        </st-info-item>
        <st-info-item class="mg-b0" label="当前额度">
          {{ info.remain_amount }}
        </st-info-item>
      </st-info>
    </a-col>
    <a-col :span="11" class="mg-b36">
      <st-info>
        <st-info-item label="会员名称">
          {{ info.card_name }}
        </st-info-item>
        <st-info-item class="mg-b0" label="手机号">
          {{ info.phone }}
        </st-info-item>
      </st-info>
    </a-col>
    <a-col :span="13" class="mg-b36">
      <st-info>
        <st-info-item label="初始额度">
          {{ info.init_amount }}
        </st-info-item>
        <st-info-item class="mg-b0" label="开卡日期">
          {{ info.start_time }}
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
        <st-info-item label="到期日期">{{ info.end_time }}</st-info-item>
      </st-info>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'BizCardInfo',
  bem: {
    course: 'slod-card'
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
