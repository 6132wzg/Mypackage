<template>
  <st-modal
    title="团体课预约设置"
    class="modal-team-order-setting"
    v-model="show"
    @ok="save"
    @cancel="cancel"
    :confirmLoading="loading.update"
  >
    <div>
      <st-form :form="form" labelWidth="56px">
        <!-- 预约范围 -->
        <st-form-item label="预约范围">
          <div>
            <span>用户可预约</span>
            <a-select
              class="mg-l8"
              style="width: 100px"
              v-model="info.reserve_start"
            >
              <a-select-option
                v-for="(item, index) in reserve_start"
                :key="+index"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
            <span class="mg-l8">到</span>
            <a-select
              class="mg-l8"
              style="width: 70px"
              v-model="info.reserve_range"
            >
              <a-select-option
                v-for="(item, index) in reserve_range"
                :key="+index"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
            <span class="mg-l8">以内的团体系课程，员工代预约不受此限制</span>
          </div>
        </st-form-item>
        <!-- 取消预约 -->
        <st-form-item label="取消预约">
          <div>
            <span>允许用户在团体课程开始前</span>
            <a-select
              class="mg-l8"
              style="width: 100px"
              v-model="info.cancel_reserve"
            >
              <a-select-option
                v-for="(item, index) in cancel_reserve"
                :key="+index"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
            <span class="mg-l8">取消预约，员工代取消不受此限制</span>
          </div>
          <div class="st-des">
            （建议取消预约时间 >=
            提前预约时间，否则会造成取消课程预约后，其它用户无法再进行预约）
          </div>
        </st-form-item>
        <!-- 预约提醒 -->
        <!-- <st-form-item label="预约提醒">
          <div>
            <span>在课程开始前</span>
            <a-select class="mg-l8" style="width: 100px"
              v-model="info.reserve_remind"
              :options="reserve_remind"
            >
            </a-select>
            <span class="mg-l8" >提醒用户上课</span>
          </div>
        </st-form-item> -->
        <!-- 预约上限 -->
        <st-form-item label="预约上限" v-if="info.reserve_upper_limit">
          <div>
            <span>允许用户每节课预约</span>
            <a-select
              class="mg-l8"
              style="width: 100px"
              v-model="info.reserve_upper_limit.limit_num"
            >
              <a-select-option
                v-for="(item, index) in limit_num"
                :key="+index"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
            <a-checkbox
              class="mg-l24"
              :checked="!!info.reserve_upper_limit.is_limit_course_num"
              @change="
                onCheckboxChange('reserve_upper_limit.is_limit_course_num')
              "
            >
              限制用户预约
            </a-checkbox>
            <st-input-number
              style="width: 66px"
              v-model="info.reserve_upper_limit.limit_course_num"
            />
            <span class="mg-l8">节未开课的团体课程</span>
          </div>
        </st-form-item>
        <!-- 候补预约 -->
        <st-form-item label="候补预约">
          <a-checkbox
            :checked="!!info.alternate_reserve"
            @change="onCheckboxChange('alternate_reserve')"
          >
            开启候补预约
          </a-checkbox>
          <div class="st-des">
            开课前1小时自动取消候补预约
          </div>
        </st-form-item>
        <!-- 签到方式 -->
        <st-form-item label="签到方式">
          <a-checkbox
            :checked="!!info.is_sign"
            @change="onCheckboxChange('is_sign')"
          >
            支持用户自主签到
          </a-checkbox>
        </st-form-item>
        <!-- 签到时间 -->
        <st-form-item label="签到时间">
          <div>
            <span>开课</span>
            <a-select
              class="mg-l8"
              style="width: 100px"
              v-model="info.sign_time"
            >
              <a-select-option
                v-for="(item, index) in sign_time"
                :key="+index"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
            <span class="mg-l8">允许签到</span>
          </div>
        </st-form-item>
        <!-- 自动签到 -->
        <st-form-item label="自动签到">
          <div>
            <a-checkbox
              :checked="!!info.is_auto_sign"
              @change="onCheckboxChange('is_auto_sign')"
            >
              支持系统自动签到，在
            </a-checkbox>
            <a-select
              class="mg-l8"
              style="width: 84px"
              v-model="info.auto_sign_limit"
            >
              <a-select-option
                v-for="(item, index) in auto_sign_limit"
                :key="+index"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
            <span class="mg-l8">后系统自动将课程进行签到</span>
          </div>
          <div class="st-des">
            （凌晨03:00进行检查未签到课程，统一进行更新）
          </div>
        </st-form-item>
        <!-- 爽约惩罚 -->
        <st-form-item label="爽约惩罚" v-if="info.miss_punishment">
          <div>
            <a-checkbox
              :checked="!!info.is_miss_punishment"
              @change="onCheckboxChange('is_miss_punishment')"
            >
              开启爽约惩罚
            </a-checkbox>
          </div>
          <div class="mg-t8">
            <st-input-number
              style="width: 66px"
              v-model="info.miss_punishment.miss_punish_day"
              :min="1"
              :max="100"
            />
            <span class="mg-l8">天内，已结束的团体课程未签到的课程数超过</span>
            <st-input-number
              class="mg-l8"
              style="width: 66px"
              v-model="info.miss_punishment.miss_punish_number"
              :min="1"
              :max="100"
            />
            <span class="mg-l8">次后，</span>
          </div>
          <div class="mg-t16">
            <st-input-number
              style="width: 66px"
              v-model="info.miss_punishment.miss_punish_limit"
              :min="1"
              :max="100"
            />
            <span class="mg-l8">
              天内不可再预约团体课程，员工代预约不受此限制
            </span>
          </div>
        </st-form-item>
        <!-- 开课条件 -->
        <st-form-item label="开课条件" v-if="info.team_open_condition">
          <div>
            <a-checkbox
              :checked="!!info.team_is_open_condition"
              @change="onCheckboxChange('team_is_open_condition')"
            >
              开课前
            </a-checkbox>
            <a-select
              :disabled="select_flag.open_condition_flag"
              class="mg-l8"
              style="width: 130px"
              v-model="info.team_open_condition.limit_time"
            >
              <a-select-option
                v-for="(item, index) in open_condition_limit_time"
                :key="+index"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
            <span class="mg-l8">预约人数不足</span>
            <a-select
              :disabled="select_flag.open_condition_flag"
              class="mg-l8"
              style="width: 84px"
              v-model="info.team_open_condition.limit_num"
            >
              <a-select-option
                v-for="(item, index) in open_condition_limit_num"
                :key="+index"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
            <span class="mg-l8">系统将自动取消课程及预约</span>
          </div>
        </st-form-item>
        <!-- 预约人数 -->
        <st-form-item label="预约人数">
          <div>
            <a-checkbox
              :checked="!!info.is_show_reserve_num"
              @change="onCheckboxChange('is_show_reserve_num')"
            >
              显示在小程序
            </a-checkbox>
          </div>
        </st-form-item>
      </st-form>
    </div>
  </st-modal>
</template>
<script>
import { MessageService } from '@/services/message.service'
import { ReserveService } from './reserve.service'
const OPEN_CONDITION_FLAG = 1
export default {
  serviceInject() {
    return {
      messageService: MessageService,
      reserveService: ReserveService
    }
  },
  rxState() {
    return {
      loading: this.reserveService.loading$,
      open_condition_limit_num: this.reserveService.open_condition_limit_num$,
      open_condition_limit_time: this.reserveService.open_condition_limit_time$,
      auto_sign_limit: this.reserveService.auto_sign_limit$,
      sign_time: this.reserveService.sign_time$,
      limit_num: this.reserveService.limit_num$,
      cancel_reserve: this.reserveService.cancel_reserve$,
      reserve_range: this.reserveService.reserve_range$,
      reserve_start: this.reserveService.reserve_start$,
      reserve_remind: this.reserveService.reserve_remind$
    }
  },
  data() {
    return {
      show: false,
      form: this.$form.createForm(this),
      info: {},
      select_flag: {
        open_condition_flag: false
      }
    }
  },
  created() {
    this.reserveService.getInfo().subscribe(res => {
      this.info = res.info
      this.info.team_is_open_condition === OPEN_CONDITION_FLAG
        ? (this.select_flag.open_condition_flag = false)
        : (this.select_flag.open_condition_flag = true)
    })
  },
  methods: {
    onCheckboxChange(index) {
      if (index.includes('.')) {
        const indexs = index.split('.')
        this.info[indexs[0]][indexs[1]] = +!this.info[indexs[0]][indexs[1]]
      } else {
        this.info[index] = +!this.info[index]
      }
      if (index === 'team_is_open_condition') {
        this.info.team_is_open_condition === OPEN_CONDITION_FLAG
          ? (this.select_flag.open_condition_flag = false)
          : (this.select_flag.open_condition_flag = true)
      }
    },
    cancel() {
      this.show = false
    },
    save() {
      console.log(this.info)
      this.reserveService.update({ ...this.info }).subscribe(() => {
        this.messageService.success({
          content: '提交成功'
        })
        this.show = false
        this.$emit('change')
      })
    }
  }
}
</script>
