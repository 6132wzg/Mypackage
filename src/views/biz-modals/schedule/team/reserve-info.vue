<template>
  <st-modal
    class="modal-reserved"
    title="预约详情"
    @ok="save"
    width="948px"
    v-model="show"
  >
    <a-row :gutter="24">
      <a-col :lg="8">
        <st-info>
          <st-info-item :label="`上课${$c('coach')}`">
            {{ info.coach_name }}
          </st-info-item>
          <st-info-item label="上课时间">{{ info.start_time }}</st-info-item>
        </st-info>
      </a-col>
      <a-col :lg="8">
        <st-info>
          <st-info-item label="课程名称">{{ info.course_name }}</st-info-item>
          <st-info-item label="预约人数">
            {{ info.reserved_num }} / {{ info.limit_num }}
          </st-info-item>
        </st-info>
      </a-col>
      <a-col :lg="8">
        <st-info>
          <st-info-item label="上课场地">
            {{ info.court_name }}
            <span v-if="info.court_site_name">
              • {{ info.court_site_name }}
            </span>
          </st-info-item>
          <st-info-item label="课时费">{{ info.course_fee }}元</st-info-item>
        </st-info>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :lg="24">
        <st-info>
          <st-info-item label="说明">
            {{ info.description }}
            <span v-if="+info.is_show_description" class="color-text-light">
              （显示在小程序）
            </span>
          </st-info-item>
        </st-info>
      </a-col>
    </a-row>
    <st-container class="modal-reserved-info__table">
      <st-form-table hoverable>
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.dataIndex">
              {{ col.title }}
              <st-help-tooltip
                v-if="col.dataIndex == 'site_num_list'"
                id="TSGC002"
              />
            </th>
          </tr>
        </thead>
        <tbody v-if="isAdd">
          <tr v-if="isUpRange">
            <td width="120px" class="mg-l0 st-form-table__add-td">
              <a-select
                slot="member"
                showSearch
                placeholder="搜索会员名"
                style="width:120px"
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
                  :key="member.id"
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
            <td width="140px" class="mg-l0 st-form-table__add-td">
              <a-select
                slot="consume_type"
                placeholder="选择消费方式"
                style="width: 200px"
                v-model="showConsumeType"
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
            <td width="120px" class="mg-l0 st-form-table__add-td">
              {{ deductNum }}
            </td>
            <td width="120px" class="mg-l0 st-form-table__add-td">
              <a-select
                slot="site_num_list"
                mode="multiple"
                placeholder="选择座位"
                style="width: 100px"
                v-model="showSite"
                :maxTagCount="brandLimitNum"
                @change="onChangeSiteNumList"
              >
                <a-select-option
                  v-for="siteNum in unUsedSeatOptions"
                  :key="siteNum.id"
                >
                  {{ siteNum.name }}
                </a-select-option>
              </a-select>
            </td>
            <td width="120px">
              <span slot="current_reservation_num">
                {{ currentReservationNum }}人
              </span>
            </td>
            <td width="120px">未预约</td>
            <td width="120px">未签到</td>
            <td width="120px">
              <a
                href="javascript:;"
                @click="onClickReserve"
                v-if="infoAuth['shop:reserve:team_course_reserve|add']"
              >
                新增预约
              </a>
            </td>
          </tr>
          <tr v-else>
            <td colspan="8" class="ta-c st-form-table__add-td--disabled">
              预约人数已满
            </td>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td width="120px">{{ item.member }}</td>
            <td width="120px">{{ item.consume_name }}</td>
            <td width="120px">{{ item.deduct_num }}</td>
            <td width="120px">{{ item.site_num_list | siteNumListFilter }}</td>
            <td width="120px">{{ item.current_reservation_num }}人</td>
            <td width="120px">{{ item.reserve_status_name }}</td>
            <td width="120px">{{ item.is_checkin_name }}</td>
            <td width="120px">
              <div>
                <st-popconfirm
                  v-if="item.auth['shop:reserve:team_course_reserve|del']"
                  title="确认取消预约？"
                  @confirm="onClickCancel(item.reserve_id)"
                >
                  <a class="operation">取消预约</a>
                </st-popconfirm>
                <st-popconfirm
                  v-if="item.auth['shop:reserve:team_course_reserve|checkin']"
                  title="确认签到消费？"
                  @confirm="onClickCheckIn(item.reserve_id)"
                >
                  <a class="operation">签到消费</a>
                </st-popconfirm>
              </div>
            </td>
          </tr>
        </tbody>
      </st-form-table>
    </st-container>
    <div slot="footer" class="ta-r">
      <st-button
        @click="onClickCancelCourse"
        v-if="infoAuth['shop:schedule:team_course_schedule|del']"
        class="mg-r8"
      >
        取消课程
      </st-button>
      <st-button
        @click="onClickEditCourse"
        v-if="infoAuth['shop:schedule:team_course_schedule|edit']"
        type="primary"
      >
        修改课程
      </st-button>
    </div>
  </st-modal>
</template>

<script>
import { switchMap } from 'rxjs/operators'
import { MessageService } from '@/services/message.service'
import { TeamScheduleCommonService } from '@/views/pages/shop/product/course/schedule/team/service#/common.service'
import { TeamScheduleReserveService } from '@/views/pages/shop/product/course/schedule/team/service#/reserve.service'
import ScheduleTeamCancelCourse from '@/views/biz-modals/schedule/team/cancel-course'
import ScheduleTeamEditCourse from '@/views/biz-modals/schedule/team/edit-course'

export default {
  name: 'ReserveInfo',
  modals: {
    ScheduleTeamCancelCourse,
    ScheduleTeamEditCourse
  },
  serviceInject() {
    return {
      teamScheduleCommonService: TeamScheduleCommonService,
      teamScheduleReserveService: TeamScheduleReserveService,
      messageService: MessageService
    }
  },
  rxState() {
    const common = this.teamScheduleCommonService
    return {
      infoAuth: this.teamScheduleReserveService.infoAuth$,
      memberOptions: common.memberOptions$,
      consumeOptions: common.consumeOptions$,
      unUsedSeatOptions: common.unUsedSeatOptions$
    }
  },
  props: {
    id: Number
  },
  filters: {
    siteNumListFilter(val) {
      return val
        .split(',')
        .map(item => {
          if (item === '0') {
            return '无座位'
          }
          return item
        })
        .join(',')
    }
  },
  data() {
    return {
      isAdd: true,
      showConsumeType: '',
      memberId: '',
      showSite: [],
      consumeType: '',
      keyword: '',
      deductNum: 0,
      effectiveState: 1,
      consumeName: '',
      consumeId: '',
      consumeTypeId: '',
      siteNumIds: [],
      currentReservationNum: 0,
      columns: [
        {
          title: '会员姓名',
          dataIndex: 'member',
          width: 10,
          scopedSlots: { customRender: 'member' }
        },
        {
          title: '消费方式',
          dataIndex: 'consume_type',
          scopedSlots: { customRender: 'consume_type' }
        },
        {
          title: '扣除额度',
          dataIndex: 'deduct_num',
          scopedSlots: { customRender: 'deduct_num' }
        },
        {
          title: '座位号',
          dataIndex: 'site_num_list',
          scopedSlots: { customRender: 'site_num_list' }
        },
        {
          title: '预约人数',
          dataIndex: 'current_reservation_num',
          scopedSlots: { customRender: 'current_reservation_num' }
        },
        {
          title: '预约状态',
          dataIndex: 'reserve_status',
          scopedSlots: { customRender: 'reserve_status' }
        },
        {
          title: '签到状态',
          dataIndex: 'is_checkin'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataSource: [],
      show: false,
      info: {},
      list: []
    }
  },
  computed: {
    courseId() {
      return this.info.course_id
    },
    isUpRange() {
      let num = 0
      this.list.forEach(item => {
        num += item.current_reservation_num
      })
      return num < this.info.limit_num
    },

    scheduleId() {
      return this.info.id
    },
    courtSiteId() {
      return this.info.court_site_id
    },
    brandLimitNum() {
      return this.info.brand_limit_num
    }
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
    onClickCancelCourse() {
      this.$modalRouter.push({
        name: 'schedule-team-cancel-course',
        props: { id: this.info.id }
      })
      this.show = false
    },
    onClickEditCourse() {
      this.$modalRouter.push({
        name: 'schedule-team-edit-course',
        props: { id: this.info.id },
        on: {
          ok: () => {
            this.$router.reload()
          }
        }
      })
      this.show = false
    },
    onSearch(value) {
      this.keyword = value
      this.teamScheduleCommonService
        .getMemberList({ member: value })
        .subscribe()
    },
    onClickCancel(id) {
      this.teamScheduleReserveService.del(id).subscribe(() => {
        this.getReserve()
      })
    },
    onClickCheckIn(id) {
      this.teamScheduleReserveService
        .check({ id, checkin_method: 2 })
        .subscribe(() => {
          this.getReserve()
        })
    },
    getMemberName(id) {
      let memberName = ''
      this.memberOptions.forEach(item => {
        if (item.id === id) {
          memberName = item.member_name
        }
      })
      return memberName
    },
    onChange(value) {
      this.memberId = value
      this.showConsumeType = ''
      this.memberName = this.getMemberName(value)
      this.teamScheduleCommonService
        .getConsumeList({
          schedule_id: this.scheduleId,
          course_id: this.courseId,
          member_id: value
        })
        .subscribe()
    },
    onChangeConsumeType(val) {
      const obj = JSON.parse(val)
      this.consumeType = obj.consume_type
      //  因为会员卡，私教课，储值卡，课程包只有课程包有这个字段 没这个字段也是生效 undefined也为1
      this.effectiveState = obj.effective_state === 0 ? 0 : 1
      this.consumeName = obj.name
      this.deductNum = obj.deduct_num
      this.consumeId = obj.id
    },
    onChangeSiteNumList(val) {
      let tempArr = []
      if (val.length > this.brandLimitNum) {
        this.messageService.error({
          content: `最多预约${this.brandLimitNum}个座位`
        })
        let len = this.showSite.length
        this.showSite = this.showSite.slice(0, len - 1)
        return
      }
      const unSeatArr = this.unUsedSeatOptions
        .map(item => (item.name === '无座位' ? item.id : -1))
        .filter(item => item !== -1)
      this.siteNumIds = val.map(item => {
        let value
        this.unUsedSeatOptions.forEach(ele => {
          if (item === ele.id && ele.name !== '无座位') {
            value = ele.name
          }
        })
        return unSeatArr.includes(item) ? -1 : value
      })
      this.currentReservationNum = this.showSite.length
    },
    resetData() {
      this.teamScheduleCommonService.SET_RESET_DATA()
    },
    add() {
      const form = {
        schedule_id: this.id,
        member_id: this.memberId,
        seat: this.siteNumIds,
        consume_type: this.consumeType,
        consume_id: this.consumeId
      }
      this.currentReservationNum = 0
      this.isAdd = false
      this.resetData()
      this.teamScheduleReserveService.add(form).subscribe(
        () => {
          this.isAdd = true
          this.showSite = []
          this.siteNumIds = []
          this.consumeType = ''
          this.showConsumeType = ''
          this.memberId = ''
          this.getReserve()
        },
        err => {
          console.log(err)
          this.isAdd = true
          this.showSite = []
          this.siteNumIds = []
          this.consumeType = ''
          this.showConsumeType = ''
          this.memberId = ''
        }
      )
    },
    onClickReserve() {
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
        },
        onCancel() {
          console.log('Cancel')
        },
        class: 'test'
      })
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
    getReserve() {
      const ss = this.teamScheduleReserveService
      ss.getInfo(this.id)
        .pipe(
          switchMap(state => {
            this.info = state.info
            this.list = state.list
            return this.teamScheduleCommonService.getUnusedSeatList({
              schedule_id: state.info.id,
              court_site_id: state.info.court_site_id
            })
          })
        )
        .subscribe()
    }
  },
  mounted() {
    this.getReserve()
  }
}
</script>
