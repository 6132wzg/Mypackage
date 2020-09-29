<template>
  <a-tooltip placement="topRight">
    <template slot="title">
      <span>点击刷新</span>
    </template>
    <div class="st-refresh-btn" @click="refresh">
      <span class="st-refresh-btn__date">更新：{{ showDate }}</span>
      <span
        class="st-refresh-btn__icon"
        :class="{ 'st-refresh-btn__icon--loading': loading }"
      >
        <st-icon type="refresh"></st-icon>
      </span>
    </div>
  </a-tooltip>
</template>

<script>
import { MessageService } from '@/services/message.service'
import { catchError } from 'rxjs/operators'
import moment from 'moment'
const TIME_FORMAT = 'MM-DD HH:mm'
export default {
  name: 'StRefreshBtn',
  props: {
    action: {
      type: Function
    },
    updateTime: {
      type: [String, Number],
      default: null
    },
    rangeTime: {
      type: Number,
      default: 0
    }
  },
  watch: {
    updateTime(newVal, oldVal) {
      if (newVal != oldVal) {
        this.showDate = moment(newVal || Date.now()).format(TIME_FORMAT)
        this.messageService.success({
          content: '更新略有延迟，请稍后刷新页面查看'
        })
      }
    }
  },
  data() {
    return {
      showDate: moment(this.updateTime || Date.now()).format(TIME_FORMAT),
      loading: false,
      times: 0,
      intervalTimer: ''
    }
  },
  serviceInject() {
    return {
      messageService: MessageService
    }
  },
  methods: {
    refresh() {
      if (this.times > 0) {
        this.$message.error({ content: `间隔太短，请稍后尝试` })
        return
      }
      clearInterval(this.intervalTimer)
      this.times = this.rangeTime
      this.loading = true
      const timer = setTimeout(() => {
        this.action()
          .pipe(
            catchError(err => {
              setTimeout(() => {
                this.loading = false
              })
              return null
            })
          )
          .subscribe(() => {
            setTimeout(() => {
              this.loading = false
            })
            this.showDate = moment(this.updateTime || Date.now()).format(
              TIME_FORMAT
            )
            clearTimeout(timer)
            this.intervalTimer = setInterval(() => {
              this.times--
            }, 1000)
          })
      }, 300)
    }
  }
}
</script>
