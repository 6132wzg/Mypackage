<template>
  <div v-if="auth.get">
    <!-- 团课定价设置 -->
    <a-row>
      <a-col :span="16"><st-t2>团体课程预约设置</st-t2></a-col>
      <a-col :span="8" class="ta-r">
        <st-info-action
          icon="edit"
          text="编辑"
          v-if="auth.edit"
          v-modal-link="{
            name: 'brand-setting-team-reserve',
            on: {
              change: onChange
            }
          }"
        />
      </a-col>
    </a-row>
    <!-- 预约范围 -->
    <st-t4 class="mg-t24">预约范围</st-t4>
    <div class="st-des">
      用户可预约{{
        info.reserve_start | enumFilter('setting.reserve_start')
      }}
      到{{
        info.reserve_range | enumFilter('setting.reserve_range')
      }}以内的团课，员工代预约不受此限制
    </div>
    <st-hr></st-hr>
    <!-- 取消预约 -->
    <st-t4>取消预约</st-t4>
    <div class="st-des">
      允许用户在团课开始前{{
        info.cancel_reserve | enumFilter('setting.cancel_reserve')
      }}取消预约，员工代取消不受此限制
    </div>
    <st-hr></st-hr>
    <!-- 预约提醒 -->
    <st-t4>预约提醒</st-t4>
    <div class="st-des">
      在课程开始前{{
        info.reserve_remind | enumFilter('setting.reserve_remind')
      }}提醒用户上课
    </div>
    <st-hr></st-hr>
    <!-- 预约上限 -->
    <st-t4>预约上限</st-t4>
    <div class="st-des">
      允许用户每节课预约{{ info.reserve_upper_limit.limit_num }}人，
      {{
        info.reserve_upper_limit.is_limit_course_num
          ? `限制用户预约${info.reserve_upper_limit.limit_course_num}节未开课的团体课程`
          : '不限制用户预约课程数'
      }}
    </div>
    <st-hr></st-hr>
    <!-- 预约人数 -->
    <st-t4>预约人数</st-t4>
    <div class="st-des">显示每节课的预约人数</div>
    <st-hr></st-hr>
    <!-- 候补预约 -->
    <st-t4>候补预约</st-t4>
    <div class="st-des">
      {{
        info.alternate_reserve | enumFilter('setting.alternate_reserve')
      }}候补预约，开课前1小时自动取消候补预约
    </div>
    <st-hr></st-hr>
    <!-- 签到方式 -->
    <st-t4>签到方式</st-t4>
    <div class="st-des">{{ info.is_sign ? '支持' : '不支持' }}用户自主签到</div>
    <st-hr></st-hr>
    <!-- 签到时间 -->
    <st-t4>签到时间</st-t4>
    <div class="st-des">
      开课后{{ info.sign_time | enumFilter('setting.sign_time') }}允许签到
    </div>
    <st-hr></st-hr>
    <!-- 自动签到 -->
    <st-t4>自动签到</st-t4>
    <div class="st-des">
      {{ info.is_auto_sign ? '支持' : '不支持' }}系统自动签到
    </div>
    <st-hr></st-hr>
    <!-- 爽约惩罚 -->
    <st-t4>爽约惩罚</st-t4>
    <div class="st-des">
      {{
        info.is_miss_punishment | enumFilter('setting.is_miss_punishment')
      }}爽约惩罚
      <span v-if="info.is_miss_punishment">
        ，{{ info.miss_punishment.miss_punish_day }}天内，
        已结束的团体课程未签到的课程数超过{{
          info.miss_punishment.miss_punish_number
        }}次后，
        {{ info.miss_punishment.miss_punish_limit }}天内不可再预约团体课程
      </span>
    </div>
    <st-hr></st-hr>
    <!-- 预约人数 -->
    <st-t4>预约人数</st-t4>
    <div class="st-des">
      {{ info.is_show_reserve_num | enumFilter('setting.is_show_reserve_num') }}
    </div>
  </div>
</template>
<script>
import { MessageService } from '@/services/message.service'
import { TeamService } from './team.service'
import BrandSettingTeamReserve from '@/views/biz-modals/brand/setting/team/reserve'
export default {
  serviceInject() {
    return {
      teamService: TeamService
    }
  },
  rxState() {
    const teamService = this.teamService
    return {
      loading: teamService.loading$,
      resData: teamService.resData$,
      auth: teamService.auth$
    }
  },
  modals: {
    BrandSettingTeamReserve
  },
  computed: {
    info() {
      return this.resData.info
    }
  },
  methods: {
    onChange() {
      this.$router.push({})
    }
  }
}
</script>
