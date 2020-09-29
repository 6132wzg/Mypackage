<template>
  <st-panel class="page-staff-table">
    <st-table
      :loading="loading"
      :alertSelection="{ onReset: onSelectionReset }"
      :rowSelection="{ selectedRowKeys, onChange: onSelectionChange }"
      :page="page"
      :columns="columns"
      :dataSource="staffList"
      :scroll="{ x: 1100 }"
      rowKey="id"
      @change="onTableChange"
    >
      <div slot="action" slot-scope="text, record">
        <st-table-actions>
          <a
            v-if="record.auth['brand:staff:staff|get']"
            @click="staffInfo(record)"
          >
            详情
          </a>
          <a
            href="javascript: void(0)"
            v-if="record.auth['brand:staff:staff|edit']"
            @click="editStaff(record.id)"
          >
            编辑
          </a>
          <a
            href="javascript: void(0)"
            v-if="record.auth['brand:staff:staff|bind_card']"
            v-modal-link="{
              name: 'staff-bind-entity-card',
              props: { staff: record }
            }"
          >
            绑定实体卡
          </a>
          <a
            href="javascript: void(0)"
            v-if="record.auth['brand:staff:staff|rebind_card']"
            v-modal-link="{
              name: 'staff-bind-entity-card',
              props: { staff: record }
            }"
          >
            重绑定实体卡
          </a>
          <a
            href="javascript: void(0)"
            v-if="record.auth['brand:staff:staff|position']"
            @click="staffPositionChange(record)"
          >
            职位和薪资变更
          </a>
          <a
            href="javascript: void(0)"
            v-if="record.auth['brand:staff:staff|leave']"
            @click="staffLeave(record)"
          >
            离职
          </a>
          <a
            href="javascript: void(0)"
            v-if="record.auth['brand:staff:staff|reinstate']"
            v-modal-link="{
              name: 'staff-reinstatement',
              props: { staff: record }
            }"
          >
            复职
          </a>
          <a
            href="javascript: void(0)"
            v-if="record.auth['brand:staff:account|save']"
            v-modal-link="{
              name: 'staff-re-password',
              props: { staff: record }
            }"
          >
            管理登录账号
          </a>
          <a
            href="javascript: void(0)"
            v-if="record.auth['brand:staff:staff|salary']"
            v-modal-link="{
              name: 'staff-salary-account-setting',
              props: { staff: record }
            }"
          >
            设置提现账户
          </a>
          <a
            v-if="record.auth['brand_shop:staff:staff|del']"
            @click="onClickDelete(record)"
          >
            删除
          </a>
          <a
            v-if="record.auth['brand:staff:staff|finger_del']"
            @click="onClearFingerprintInfo(record)"
          >
            清空指纹信息
          </a>
          <a
            v-if="record.auth['brand:staff:staff|cabinet_pwd_del']"
            @click="onClearHardwarePassword(record)"
          >
            清空硬件密码
          </a>
        </st-table-actions>
      </div>
      <div slot="work_status" slot-scope="work_status">
        <st-text
          :status="{
            success: work_status.id === 1,
            error: work_status.id === 2
          }"
        >
          {{ work_status.name }}
        </st-text>
      </div>
      <div slot="shop" slot-scope="shop, record">
        <!-- 超管所属门店显示为全部 -->
        <template v-if="record.is_super_admin">全部</template>
        <template v-else>
          <a
            v-modal-link="{
              name: 'staff-shop-with-staff',
              props: { shopList: shop }
            }"
            v-if="shop.length"
          >
            共{{ shop.length }}家门店
          </a>
          <span v-else>--</span>
        </template>
      </div>
      <div slot="identity" slot-scope="identity">
        {{ identity | identityNames }}
      </div>
      <template slot="staff_name" slot-scope="text, record">
        {{ text }}
        <img
          v-if="record.is_super_admin === 1"
          class="page-shop-staff-list__staff-role"
          src="~@/assets/img/icon_superadmin.png"
          alt="超级管理员"
        />
      </template>
    </st-table>
  </st-panel>
</template>
<script>
import { columns } from './staff-table.config.ts'
import tableMixin from '@/mixins/table.mixin'
import StaffBindEntityCard from '@/views/biz-modals/staff/bind-entity-card'
import StaffDelete from '@/views/biz-modals/staff/delete'
import StaffRePassword from '@/views/biz-modals/staff/re-password'
import StaffReinstatement from '@/views/biz-modals/staff/reinstatement'
import StaffSalaryAccountSetting from '@/views/biz-modals/staff/salary-account-setting'
import StaffShopWithStaff from '@/views/biz-modals/staff/shop-with-staff'
import StaffTurnover from '@/views/biz-modals/staff/turnover'
import StaffUpdateStaffPosition from '@/views/biz-modals/staff/update-staff-position'
import { WORK_STATUS } from '@/constants/staff/info'
import { DepartmentService } from './../department.service'

export default {
  mixins: [tableMixin],
  modals: {
    StaffBindEntityCard,
    StaffDelete,
    StaffRePassword,
    StaffReinstatement,
    StaffSalaryAccountSetting,
    StaffShopWithStaff,
    StaffTurnover,
    StaffUpdateStaffPosition
  },
  serviceInject() {
    return {
      departmentService: DepartmentService
    }
  },
  rxState() {
    return {}
  },
  props: {
    staffList: {
      type: Array,
      default: () => {
        return []
      }
    },
    page: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    columns
  },
  watch: {
    selectedRowKeys: {
      handler(v) {
        this.$emit('selectedRow', this.selectedRowKeys)
      },
      deep: true
    }
  },
  filters: {
    identityNames(val) {
      if (val.length === 0) return '--'
      return val
        .map(item => {
          return item.name
        })
        .join(',')
    }
  },
  data() {
    return {
      WORK_STATUS
    }
  },
  methods: {
    onClickDelete(record) {
      this.$modalRouter.push({
        name: 'staff-delete',
        props: { staff: record },
        on: {}
      })
    },
    staffLeave(record) {
      this.$modalRouter.push({
        name: 'staff-turnover',
        props: {
          staff: record
        }
      })
    },
    staffPositionChange(record) {
      this.$modalRouter.push({
        name: 'staff-update-staff-position',
        props: {
          staff: record
        }
      })
    },
    staffInfo(staff) {
      this.$router.push({
        name: 'brand-staff-info-basic',
        query: {
          id: staff.id
        }
      })
    },
    editStaff(staffId) {
      this.$emit('edit-staff', staffId)
    },
    // 清空指纹信息
    onClearFingerprintInfo(record) {
      this.$confirm({
        title: '提示信息',
        content: '确认清空指纹信息？',
        onOk: () => {
          this.departmentService.deleteStaffFinger(record.id).subscribe()
        }
      })
    },
    // 清空硬件密码
    onClearHardwarePassword(record) {
      this.$confirm({
        title: '提示信息',
        content: '确认清空硬件密码吗？',
        onOk: () => {
          this.departmentService
            .deleteStaffCabinetPassword(record.id)
            .subscribe()
        }
      })
    }
  }
}
</script>
