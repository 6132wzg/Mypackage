<template>
  <st-modal title="编辑排期" @ok="onOkSave" v-model="show" width="1200px">
    <div class="modal-schedule-edit">
      <div class="modal-schedule-edit__info">
        <div class="coach">
          <span>上课{{ $c('coach') }}:</span>
          <span>{{ staffName }}</span>
        </div>
        <div class="time">
          {{ rangeTime }}
        </div>
      </div>
      <div class="copy-button-box mg-t16">
        <st-button class="copy-button" @click="onClickCopySchedule">
          复制上周
        </st-button>
      </div>

      <div
        class="modal-schedule__time modal-add-schedule__time mg-t16"
        v-if="scheduleInfo.length"
      >
        <st-container>
          <a-row class="time-header">
            <a-col :lg="2">
              <span class="time-header__label mg-l8">时间段</span>
            </a-col>
            <a-col :lg="22">
              <a-col class="time-header__value" :lg="6">00:00</a-col>
              <a-col class="time-header__value" :lg="6">06:00</a-col>
              <a-col class="time-header__value" :lg="6">12:00</a-col>
              <a-col :lg="6" class="time-header__value last">
                <span>18:00</span>
                <span class="mg-r8">24:00</span>
              </a-col>
            </a-col>
          </a-row>
          <div v-if="isInit">
            <a-row
              class="time-item"
              v-for="info in scheduleInfo"
              :key="info.schedule_time"
            >
              <a-col :lg="2">
                <span>{{ info.schedule_time | filterDate }}</span>
              </a-col>
              <a-col :lg="22">
                <schedule-time-picker
                  v-model="info.timing"
                ></schedule-time-picker>
              </a-col>
            </a-row>
          </div>
        </st-container>
      </div>
    </div>
  </st-modal>
</template>

<script>
import { PersonalScheduleScheduleService } from '@/views/pages/shop/product/course/schedule/personal/service#/schedule.service'
import ScheduleTimePicker from '@/views/components/time-picker#/time-picker'
export default {
  name: 'EditShchedule',
  components: {
    ScheduleTimePicker
  },
  serviceInject() {
    return {
      scheduleService: PersonalScheduleScheduleService
    }
  },
  rxState() {
    return {}
  },
  data() {
    return {
      show: false,
      staffName: '',
      isInit: false,
      scheduleInfo: [
        {
          timing: []
        },
        {
          timing: []
        },
        {
          timing: []
        },
        {
          timing: []
        },
        {
          timing: []
        },
        {
          timing: []
        },
        {
          timing: []
        }
      ]
    }
  },
  props: {
    id: {
      type: Number
    },
    start: {
      type: String,
      default: ''
    }
  },
  filters: {
    filterDate(val) {
      return moment(val)
        .format('dddd')
        .valueOf()
    }
  },
  computed: {
    end() {
      return moment(moment(this.start).valueOf() + 24 * 6 * 3600 * 1000)
        .format('YYYY-MM-DD')
        .valueOf()
    },
    rangeTime() {
      return `${this.start} ~ ${this.end}`
    }
  },
  methods: {
    onOkSave() {
      let date = {
        id: this.id,
        schedule_info: this.scheduleInfo
      }
      this.scheduleService.update(date).subscribe(res => {
        this.show = false
        this.$emit('success:ok')
        this.$emit('success')
      })
    },
    onClickCopySchedule() {
      this.scheduleService
        .copy(this.id, { start_date: this.start, end_date: this.end })
        .subscribe(res => {
          this.show = false
          this.$emit('success:copy')
          this.$emit('success')
        })
    },
    initScheduleInfo() {
      const weekOfday = moment(this.start, 'YYYY-MM-DD').format('E')
      this.scheduleInfo = this.scheduleInfo.map((item, index) => {
        const day = moment(this.start)
          .add(index + 1 - weekOfday, 'days')
          .format('YYYY-MM-DD')
        return {
          schedule_time: day,
          ...item
        }
      })
    },
    getInfo() {
      let form = {
        id: this.id,
        start_time: this.start,
        end_time: this.end
      }
      this.isInit = false
      this.scheduleService.getUpdateInfo(form).subscribe(res => {
        this.staffName = res.info.staff_name
        const scheduleInfo = this.scheduleInfo.map(item => {
          res.info.coach_info.forEach(ele => {
            if (ele.schedule_time === item.schedule_time) {
              item = ele
            } else if (!item.id) {
              item.id = 0
            }
          })
          this.isInit = true
          return item
        })
        this.$set(this, 'scheduleInfo', scheduleInfo)
      })
    }
  },
  created() {
    this.initScheduleInfo(this.start)
    this.getInfo()
  }
}
</script>
