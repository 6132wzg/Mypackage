<template>
  <st-modal
    class="modal-reserved"
    title="预约详情"
    @ok="save"
    width="755px"
    :footer="null"
    v-model="show"
  >
    <a-row :gutter="24" class="modal-reserved-info">
      <a-col :lg="8">
        <st-info>
          <st-info-item :label="`上课${$c('coach')}`">
            {{ reserveInfo.coach_name }}
          </st-info-item>

          <st-info-item label="上课时间">
            {{ reserveInfo.start_time }}
          </st-info-item>
          <st-info-item label="课时费">
            {{ reserveInfo.course_fee }}
          </st-info-item>
        </st-info>
      </a-col>
      <a-col :lg="8">
        <st-info>
          <st-info-item label="课程名称">
            {{ reserveInfo.course_name }}
          </st-info-item>
          <st-info-item label="最大人数">
            {{ reserveInfo.limit_num }}
          </st-info-item>
        </st-info>
      </a-col>
      <a-col :lg="8">
        <st-info>
          <st-info-item label="上课日期">
            {{ reserveInfo.start_date }}
          </st-info-item>
          <st-info-item label="预约人数" v-if="reserveInfo.reserve">
            {{ reserveInfo.reserve.length }}
          </st-info-item>
        </st-info>
      </a-col>
    </a-row>
    <st-container>
      <st-form-table hoverable>
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.dataIndex">{{ col.title }}</th>
          </tr>
        </thead>
        <tbody v-if="!loading.add">
          <tr>
            <td class="st-form-table__add">
              <a-select
                slot="member"
                showSearch
                placeholder="搜索会员名"
                style="width: 149px"
                :defaultActiveFirstOption="false"
                :dropdownMatchSelectWidth="false"
                :showArrow="false"
                :filterOption="false"
                @search="onSearch"
                @change="onChange"
                notFoundContent="无搜索结果"
              >
                <a-select-option
                  v-for="member in memberOptions"
                  :key="member.member_id"
                >
                  <div class="st-form-table__add-option">
                    <span
                      class="item-name"
                      v-html="keywordFilter(member)"
                    ></span>
                  </div>
                </a-select-option>
              </a-select>
            </td>
            <td>
              <a-select
                slot="consume_type"
                placeholder="选择消费方式"
                style="width: 160px"
                :dropdownMatchSelectWidth="false"
                @change="onChangeConsumeType"
              >
                <a-select-opt-group
                  v-for="consumeType in consumeOptions"
                  :key="consumeType.id"
                >
                  <span slot="label">
                    <a-icon type="snippets" />
                    {{ consumeType.name }}
                  </span>
                  <a-select-option
                    v-for="consume in consumeType.children"
                    :value="JSON.stringify(consume)"
                    :key="consume.id"
                  >
                    {{ consume.name }}
                  </a-select-option>
                </a-select-opt-group>
              </a-select>
            </td>
            <td width="120px">
              {{ deductNum }}
            </td>
            <td>未签到</td>
            <td>
              <a v-if="auth.add" @click="addReserve">
                新增预约
              </a>
            </td>
          </tr>
          <tr v-for="(item, index) in reserveList" :key="index">
            <td>{{ item.member }}</td>
            <td>{{ item.consume_name }}</td>
            <td>{{ item.deduct_num }}</td>
            <td>{{ item.is_checkin_name }}</td>
            <td>
              <div>
                <st-popconfirm
                  v-if="
                    item.auth['shop:reserve:personal_team_course_reserve|del']
                  "
                  title="确认取消预约？"
                  class="mg-r8"
                  @confirm="cancelReserve(item.id)"
                >
                  <a>取消预约</a>
                </st-popconfirm>
                <st-popconfirm
                  v-if="
                    item.auth[
                      'shop:reserve:personal_team_course_reserve|checkin'
                    ]
                  "
                  title="确认签到消费？"
                  @confirm="check(item.id)"
                >
                  <a>签到消费</a>
                </st-popconfirm>
              </div>
            </td>
          </tr>
        </tbody>
      </st-form-table>
    </st-container>

    <div class="mg-t24 ta-r">
      <a-popconfirm
        v-if="
          infoAuth &&
            infoAuth['shop:schedule:personal_team_course_schedule|del']
        "
        @confirm="cancelSchedule"
        okText="确认"
        cancelText="取消"
      >
        <div slot="title">
          是否取消课程？
          <div class="color-danger">将发送消息通知已报名用户并发起自动退款</div>
        </div>
        <st-button>取消课程</st-button>
      </a-popconfirm>
      <st-button
        v-if="
          infoAuth &&
            infoAuth['shop:schedule:personal_team_course_schedule|edit']
        "
        class="mg-l8"
        type="primary"
        @click="updateSchedule"
      >
        修改课程
      </st-button>
    </div>
  </st-modal>
</template>

<script>
import { switchMap } from 'rxjs/operators'
import { MessageService } from '@/services/message.service'
import { PersonalTeamScheduleCommonService as CommonService } from '@/views/pages/shop/product/course/schedule/personal-team/service#/common.service'
import { PersonalTeamScheduleReserveService as ReserveService } from '@/views/pages/shop/product/course/schedule/personal-team/service#/reserve.service'
import { PersonalTeamScheduleScheduleService as ScheduleService } from '@/views/pages/shop/product/course/schedule/personal-team/service#/schedule.service'
import SchedulePersonalTeamEdit from '@/views/biz-modals/schedule/personal-team/edit'
import { columns } from './reserve-info.config'
export default {
  name: 'ReserveInfo',
  modals: {
    SchedulePersonalTeamEdit
  },
  serviceInject() {
    return {
      commonService: CommonService,
      reserveService: ReserveService,
      scheduleService: ScheduleService,
      messageService: MessageService
    }
  },
  rxState() {
    const commonService = this.commonService
    return {
      loading: this.reserveService.loading$,
      memberOptions: commonService.memberOptions$,
      consumeOptions: commonService.consumeOptions$,
      reserveList: this.reserveService.reserveList$,
      reserveInfo: this.reserveService.reserveInfo$,
      auth: this.reserveService.auth$,
      infoAuth: this.reserveService.infoAuth$
    }
  },
  props: {
    id: Number
  },
  data() {
    return {
      memberId: '',
      consumeType: '',
      consumeId: '',
      consumeTypeId: '',
      consumeName: '',
      deductNum: 0,
      effectiveState: 1,
      siteNumIds: [],
      dataSource: [],
      keyword: '',
      memberName: '',
      show: false,
      info: {}
    }
  },
  computed: {
    columns,
    courseId() {
      return this.reserveInfo.course_id
    },
    scheduleId() {
      return this.reserveInfo.id
    }
  },
  created() {
    this.getReserveInfo()
  },
  methods: {
    keywordFilter(item) {
      let str
      if (item.is_minors === 1) {
        str = `${item.member_name}(未成年) ${item.parent_mobile}(${item.parent_user_role})`.replace(
          new RegExp(this.keyword),
          `<span class="color-primary">${this.keyword}</span>`
        )
      } else {
        str = `${item.member_name} ${item.mobile}`.replace(
          new RegExp(this.keyword),
          `<span class="color-primary">${this.keyword}</span>`
        )
      }
      return str
    },
    onSearch(value) {
      this.keyword = value
      this.commonService
        .getMemberList({
          member_name: value
        })
        .subscribe()
    },
    getMemberName(id) {
      let memberName = ''
      this.memberOptions.forEach(item => {
        if (item.member_id === id) {
          memberName = item.member_name
        }
      })
      return memberName
    },
    onChange(value) {
      this.memberId = value
      this.memberName = this.getMemberName(value)
      this.commonService
        .getConsumeList({
          course_id: this.courseId,
          member_id: value
        })
        .subscribe()
    },
    onChangeConsumeType(val) {
      const obj = JSON.parse(val)
      this.consumeType = obj.consume_type
      this.consumeName = obj.name
      this.deductNum = obj.deduct_num
      //  因为会员卡，私教课，储值卡，课程包只有课程包有这个字段 没这个字段也是生效 undefined也为1
      this.effectiveState = obj.effective_state === 0 ? 0 : 1
      this.consumeId = obj.id
    },
    add() {
      const form = {
        schedule_id: this.id,
        member_id: this.memberId,
        consume_type: this.consumeType,
        consume_id: this.consumeId
      }
      this.reserveService.add(form).subscribe(this.onAddReserveSuccess)
    },
    addReserve() {
      // 生效的课程不二次判断
      if (this.effectiveState) {
        this.add()
        return
      }
      this.$confirm({
        title: '',
        content: `新增预约后, ${this.memberName}的课程包${
          this.consumeName.split('(')[0]
        }会立即生效，确认新增?`,
        onOk: () => {
          this.add()
          this.effectiveState = 1
        }
      })
    },
    cancelReserve(id) {
      this.reserveService.cancel(id).subscribe(this.onCancelReserveSuccess)
    },
    check(id) {
      const params = {
        id,
        checkin_method: 4
      }
      this.reserveService.check(params).subscribe(this.onCheckSuccess)
    },
    edit(key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target.editable = true
        this.data = newData
      }
      target.editable = true
      this.data = newData
    },
    save(key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        delete target.editable
        this.data = newData
        this.cacheData = newData.map(item => ({ ...item }))
      }
    },
    cancelSchedule() {
      this.scheduleService.del(this.id).subscribe(this.onDelScheduleScuccess)
    },
    updateSchedule() {
      this.show = false
      this.$modalRouter.push({
        name: 'schedule-personal-team-edit',
        props: {
          info: this.reserveInfo
        },
        on: {
          ok: () => {
            this.$router.push({ query: this.$searchQuery })
          }
        }
      })
    },
    getReserveInfo() {
      this.reserveService.getInfo(this.id).subscribe()
    },
    onAddReserveSuccess() {
      this.memberId = undefined
      this.consumeType = undefined
      this.getReserveInfo()
    },
    onCancelReserveSuccess() {
      this.getReserveInfo()
    },
    onCheckSuccess() {
      this.getReserveInfo()
    },
    onDelScheduleScuccess() {
      this.$router.push({ query: this.$searchQuery })
      this.show = false
    }
  }
}
</script>
