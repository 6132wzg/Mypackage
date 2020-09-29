<template>
  <st-modal title="" v-model="show" width="500px" :class="b()">
    <div :class="b('countdown')">{{ timeStr }}</div>
    <div :class="b('desc')">已将订单发送至“{{ posInfo.pos_name }}”</div>
    <div :class="b('status')">等待会员付款…</div>
    <template slot="footer">
      <div :class="b('tip')">
        <div>
          会员已支付，弹窗无响应？点击这里手动
          <span @click="handlePay">确认支付</span>
        </div>
        <div>关闭弹窗不影响POS机订单收款</div>
      </div>
    </template>
  </st-modal>
</template>
<script>
import { WaitPayResultService } from './wait-pay-result.service'
import { WsNotifyService } from '@/views/layouts/default#/ws-notify.service'
import { MessageService } from '@/services/message.service'
export default {
  name: 'waitPayResult',
  bem: {
    b: 'brand-app-pos-wait-pay'
  },
  modals: {},
  components: {},
  serviceInject() {
    return {
      waitPayResultService: WaitPayResultService,
      notifyService: WsNotifyService,
      messageService: MessageService
    }
  },
  rxState() {
    return {
      loading: this.waitPayResultService.loading$,
      message: this.notifyService.message$
    }
  },
  props: {
    payInfo: {
      type: Object,
      default: () => {}
    },
    posInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      show: false,
      timer: null,
      time: 0,
      timeStr: '',
      currentMsgId: ''
    }
  },
  watch: {
    message(newV) {
      this.handlePaySuccess(newV)
    }
  },
  mounted() {
    this.handleSendPosMessage()
    this.handleStartCountDown()
  },
  methods: {
    // 开启倒计时
    handleStartCountDown() {
      this.time = this.posInfo.expire_time || 0
      if (this.time) {
        this.timeStr = moment(this.time).format('mm:ss')
        this.setTimer()
      }
    },
    // 向后端发送pos机信息
    handleSendPosMessage() {
      let msg_id = this.notifyService.creatMsgId()
      this.currentMsgId = msg_id
      this.notifyService.send({
        msg_id,
        msg_type: 5,
        payload: {
          order_id: this.payInfo.order_id,
          serial_no: this.posInfo.pos_serial_no
        }
      })
    },
    // 收款成功
    handlePaySuccess(data) {
      if (data.msg_type !== 5) return false
      // 判断当前荷载中order_id是否一致
      if (data.payload.order_id !== this.payInfo.order_id) return false
      // 判断消息id是否一致
      if (data.payload.msg_id !== this.currentMsgId) return false
      // 此处需要加入定时器,存在弹窗显隐问题,确保弹窗dom生成后,在将弹窗show设置为false
      if (data.payload.status !== 1) return false
      if (data.payload.status === 3) {
        this.messageService.error({ content: '支付失败' })
      } else if (data.payload.status === 1) {
        setTimeout(() => {
          // 支付成功回调
          this.$emit('success', {
            type: 'pay'
          })
          this.show = false
        }, 300)
      }
    },
    // 确认支付
    handlePay() {
      if (this.loading.payTransaction) return false
      let params = Object.assign(this.payInfo, {
        pos_confirm: 1,
        serial_no: this.posInfo.pos_serial_no
      })
      this.waitPayResultService.payTransaction(params).subscribe(res => {
        // 支付成功回调
        this.$emit('success', {
          type: 'pay'
        })
        this.show = false
      })
    },
    setTimer() {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.time <= 1000) {
          clearInterval(this.timer)
          this.show = false
        }
        this.time = this.time - 1000
        this.timeStr = moment(this.time).format('mm:ss')
      }, 1000)
    }
  },
  destroyed() {
    clearInterval(this.timer)
  }
}
</script>
