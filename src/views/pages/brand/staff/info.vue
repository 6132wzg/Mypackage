<template>
  <st-panel-layout class="pages-staffdata-container">
    <st-panel class="pages-staffdata-header">
      <a-row>
        <a-col :span="15" class="pages-staffdata-header-detail">
          <div class="staff-avatar-container st-preview-item">
            <img :src="image_avatar_url" />
            <div class="staff-avatar-tip">
              {{ info.work_status.name }}
              <span v-if="info.nature_work.name">
                /{{ info.nature_work.name }}
              </span>
            </div>
          </div>
          <div class="staff-info-container">
            <div class="staff-info-name">
              {{ info.staff_name }}
              <span v-if="info.nickname">（{{ info.nickname }}）</span>
              <st-icon
                :type="info.sex === 1 ? 'female' : 'male'"
                :style="info.sex === 1 ? 'color:#FF5E41' : 'color:#3F66F6'"
              />
            </div>
            <div class="staff-info-cont">
              <span class="mg-r24">手机号：{{ info.mobile }}</span>
              <span class="mg-r24" v-if="info.staff_num">
                工号：{{ info.staff_num }}
              </span>
              <span v-if="info.coach_level">
                {{ $c('coach') }}等级：{{ info.coach_level }}
              </span>
            </div>
            <div class="staff-info-shops">
              <span class="mg-r24">所在部门：{{ info.department }}</span>
              <span>所在门店：{{ info.shop_num }}家门店</span>
            </div>
          </div>
        </a-col>
        <a-col :span="9" style="text-align: right;">
          <st-btn-actions :options="btnOptions"></st-btn-actions>
        </a-col>
      </a-row>
    </st-panel>
    <st-panel app :tabs="identity">
      <div slot="actions"></div>
      <router-view></router-view>
    </st-panel>
  </st-panel-layout>
</template>
<script>
import { InfoService } from './info.service'
import { forEach } from 'lodash-es'
import StaffBindEntityCard from '@/views/biz-modals/staff/bind-entity-card'
import StaffRePassword from '@/views/biz-modals/staff/re-password'
import StaffReinstatement from '@/views/biz-modals/staff/reinstatement'
import StaffSalaryAccountSetting from '@/views/biz-modals/staff/salary-account-setting'
import StaffTurnover from '@/views/biz-modals/staff/turnover'
import StaffUpdateStaffPosition from '@/views/biz-modals/staff/update-staff-position'
import { DepartmentService } from './department.service'
export default {
  modals: {
    StaffBindEntityCard,
    StaffRePassword,
    StaffReinstatement,
    StaffSalaryAccountSetting,
    StaffTurnover,
    StaffUpdateStaffPosition
  },
  serviceInject() {
    return {
      infoService: InfoService,
      departmentService: DepartmentService
    }
  },
  rxState() {
    return {
      info: this.infoService.info$,
      auth: this.infoService.auth$
    }
  },
  data() {
    return {
      identity: [],
      basic: {
        label: '员工资料',
        route: {
          name: 'brand-staff-info-basic',
          query: { id: this.$searchQuery.id }
        }
      },
      course: {
        label: '上课记录',
        route: {
          name: 'brand-staff-info-course',
          query: { id: this.$searchQuery.id }
        }
      },
      follow: {
        label: '跟进记录',
        route: {
          name: 'brand-staff-info-follow',
          query: { id: this.$searchQuery.id }
        }
      },
      sold: {
        label: '售卖订单',
        route: {
          name: 'brand-staff-info-sold',
          query: { id: this.$searchQuery.id }
        }
      },
      member: {
        label: '服务课程',
        route: {
          name: 'brand-staff-info-member',
          query: { id: this.$searchQuery.id }
        }
      }
    }
  },
  computed: {
    image_avatar_url() {
      return (
        (this.info &&
          this.info.image_avatar &&
          this.info.image_avatar.image_url) ||
        ''
      )
    },
    btnOptions() {
      return [
        {
          text: '编辑资料',
          click: this.editStaffInfo,
          if: this.auth['brand:staff:staff|edit']
        },
        {
          text: '绑定实体卡',
          click: this.openModalBindCard,
          if: this.auth['brand:staff:staff|bind_card']
        },
        {
          text: '重绑实体卡',
          click: this.openModalRebindCard,
          if: this.auth['brand:staff:staff|rebind_card']
        },
        {
          text: '职位和薪资变更',
          click: this.openModalPosition,
          if: this.auth['brand:staff:staff|position']
        },
        {
          text: '离职',
          click: this.openModalLeave,
          if: this.auth['brand:staff:staff|leave']
        },
        {
          text: '复职',
          click: this.openModalReinstate,
          if: this.auth['brand:staff:staff|reinstate']
        },
        {
          text: '管理登录账户',
          click: this.openModalSave,
          if: this.auth['brand:staff:staff:account|save']
        },
        {
          text: '设置提现账户',
          click: this.openModalSalary,
          if: this.auth['brand:staff:staff|salary']
        },
        {
          text: '清空指纹信息',
          click: this.onClearFingerprintInfo,
          if: this.auth['brand:staff:staff|finger_del']
        },
        {
          text: '清空硬件密码',
          click: this.onClearHardwarePassword,
          if: this.auth['brand:staff:staff|cabinet_pwd_del']
        }
      ]
    }
  },
  created() {
    // 会籍销售：跟进记录、服务课程 、销售订单
    // 团课教练：上课记录
    // 私教教练：上课记录、跟进记录、服务课程 、销售订单

    // 1,普通员工 2-会籍销售；3-团课教练；4-私人教练
    let { identity } = this.info
    identity = identity.map(item => item.id)
    let indetitySet = new Set()
    this.setIndentyList(['basic'], indetitySet)
    if (Array.isArray(identity) && identity.length) {
      identity.forEach(ele => {
        if (ele === 2) {
          this.setIndentyList(['member', 'sold'], indetitySet)
        } else if (ele === 3) {
          this.setIndentyList(['course'], indetitySet)
        } else if (ele === 4) {
          this.setIndentyList(
            ['course', 'follow', 'member', 'sold'],
            indetitySet
          )
        }
      })
    }
    this.identity = Array.from(indetitySet).map(key => this[key])
  },
  methods: {
    setIndentyList(arr, targetArr) {
      arr.forEach(key => targetArr.add(key, this[key]))
    },
    openModal(modalType) {
      const modalPathList = {
        bind_card: 'staff-bind-entity-card',
        rebind_card: 'staff-bind-entity-card',
        leave: 'staff-turnover',
        reinstate: 'staff-reinstatement',
        save: 'staff-re-password',
        position: 'staff-update-staff-position',
        salary: 'staff-salary-account-setting'
      }
      const name = modalPathList[modalType]
      this.$modalRouter.push({
        name,
        props: { staff: this.info }
      })
    },
    openModalBindCard() {
      this.openModal('bind_card')
    },
    openModalRebindCard() {
      this.openModal('rebind_card')
    },
    openModalLeave() {
      this.openModal('leave')
    },
    openModalReinstate() {
      this.openModal('reinstate')
    },
    openModalSave() {
      this.openModal('save')
    },
    openModalPosition() {
      this.openModal('position')
    },
    openModalSalary() {
      this.openModal('salary')
    },
    editStaffInfo() {
      this.$router.push({
        name: 'brand-staff-edit',
        query: { id: this.info.id }
      })
    },
    // 清空指纹信息
    onClearFingerprintInfo() {
      this.$confirm({
        title: '提示信息',
        content: '确认清空指纹信息？',
        onOk: () => {
          this.departmentService.deleteStaffFinger(this.info.id).subscribe()
        }
      })
    },
    // 清空硬件密码
    onClearHardwarePassword() {
      this.$confirm({
        title: '提示信息',
        content: '确认清空硬件密码吗？',
        onOk: () => {
          this.departmentService
            .deleteStaffCabinetPassword(this.info.id)
            .subscribe()
        }
      })
    }
  }
}
</script>
