<template>
  <div v-html="info.html"></div>
</template>
<script>
import moment from 'moment'
import { PrintService } from './print.service'
export default {
  bem: {
    b: 'extra-ticket-preview'
  },
  serviceInject() {
    return {
      printService: PrintService
    }
  },
  rxState() {
    console.log(this.printService)
    return {
      info: this.printService.info$
    }
  },
  mounted() {
    // 系统打印时间不使用后端快照，取本地时间
    if (document.getElementById('extra-ticket__print-time')) {
      const nowTime = moment().format('YYYY/MM/DD HH:mm:ss')
      document.getElementById('extra-ticket__print-time').innerHTML = nowTime
    }
    window.print()
  }
}
</script>
