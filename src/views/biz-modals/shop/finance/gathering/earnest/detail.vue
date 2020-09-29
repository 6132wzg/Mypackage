<template>
  <st-modal title="签单详情" v-model="show" :footer="null">
    <a-row>
      <a-col :span="12">
        <st-info>
          <st-info-item label="订单号">{{ info.id }}</st-info-item>
          <st-info-item label="下单人">{{ info.operator_name }}</st-info-item>
        </st-info>
      </a-col>
      <a-col :span="12">
        <st-info>
          <st-info-item label="下单时间">
            {{ info.created_time }}
          </st-info-item>
          <st-info-item label="销售">{{ info.staff_name }}</st-info-item>
        </st-info>
      </a-col>
    </a-row>
    <st-hr />
    <a-row>
      <a-col :span="12">
        <st-info>
          <st-info-item label="用户">{{ info.member_name }}</st-info-item>
          <st-info-item label="赠送">{{ info.gift_amount }}</st-info-item>
          <st-info-item label="优惠金额">
            {{ info.order_discount }}
          </st-info-item>
          <st-info-item label="应付金额">{{ info.pay_price }}</st-info-item>
        </st-info>
      </a-col>
      <a-col :span="12">
        <st-info>
          <st-info-item label="购买">{{ info.product_name }}</st-info-item>
          <st-info-item label="订单总额">{{ info.total_price }}</st-info-item>
          <st-info-item label="减免金额">{{ info.reduce_price }}</st-info-item>
          <st-info-item label="实付金额">
            {{ info.order_actual_receipt }}
          </st-info-item>
        </st-info>
      </a-col>
    </a-row>
    <st-info>
      <st-info-item label="备注">
        {{ info.description }}
      </st-info-item>
    </st-info>
    <p class="ta-c">
      <st-button type="primary" @click="onViewOrder">查看订单</st-button>
    </p>
  </st-modal>
</template>

<script>
import { DetailService } from './detail.service'
export default {
  serviceInject() {
    return {
      detailService: DetailService
    }
  },
  rxState() {
    const { info$, loading$ } = this.detailService
    return {
      info: info$,
      loading: loading$
    }
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      show: false
    }
  },
  created() {
    this.detailService.getInfo(this.id).subscribe()
  },
  methods: {
    onViewOrder() {
      this.show = false
      this.$router.push({
        name: 'shop-finance-order-info-collection-details',
        query: {
          id: this.id
        }
      })
    }
  }
}
</script>
