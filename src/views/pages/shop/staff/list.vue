<template>
  <st-panel class="page-shop-staff-list" app>
    <a-row type="flex" justify="space-between">
      <a-col :span="10">
        <div class="page-shop-staff-list__selectRow">
          <st-button
            v-if="auth.add"
            type="primary"
            class="mg-r8"
            icon="add"
            @click="onAddStaff"
          >
            新增员工
          </st-button>
          <st-button
            v-if="auth.export"
            type="primary"
            class="mg-r8"
            v-export-excel="{
              type: 'staff',
              query: { conditions: $searchQuery }
            }"
          >
            全部导出
          </st-button>
          <!-- NOTE: 导入 -->
          <!-- <st-button v-if="auth.import" class="mg-r8" @click="onExportStaff">导入员工</st-button> -->
          <st-button
            :disabled="!selectedRowKeys.length"
            @click="onJoinDepartment"
            v-if="auth.join"
            icon="add"
          >
            批量加入部门
          </st-button>
        </div>
      </a-col>
      <a-col :span="14">
        <div class="filter-staff ">
          <a-select
            placeholder="全部角色"
            :dropdownMatchSelectWidth="false"
            v-model="$searchQuery.role_id"
            @change="onSingleSearch('role_id', $event)"
            class="mg-r8"
          >
            <a-select-option
              v-for="role in roleOptions"
              :value="role.id"
              :key="role.id"
            >
              {{ role.name }}
            </a-select-option>
          </a-select>
          <a-tree-select
            showSearch
            class="mg-r8"
            :dropdownMatchSelectWidth="false"
            v-model="$searchQuery.department_id"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择部门"
            treeDefaultExpandAll
            @change="onSingleSearch('department_id', $event)"
          >
            <a-tree-select-node
              v-for="item in department"
              :value="item.id"
              :title="item.name"
              :key="item.id"
            >
              <a-tree-select-node
                v-for="item1 in item.children"
                :value="item1.id"
                :title="item1.name"
                :key="item1.id"
              >
                <a-tree-select-node
                  v-for="item2 in item1.children"
                  :value="item2.id"
                  :title="item2.name"
                  :key="item2.id"
                >
                  <a-tree-select-node
                    v-for="item3 in item2.children"
                    :value="item3.id"
                    :title="item3.name"
                    :key="item3.id"
                  >
                    <a-tree-select-node
                      v-for="item4 in item3.children"
                      :value="item4.id"
                      :title="item4.name"
                      :key="item4.id"
                    />
                  </a-tree-select-node>
                </a-tree-select-node>
              </a-tree-select-node>
            </a-tree-select-node>
          </a-tree-select>
          <a-select
            class="mg-r8"
            placeholder="请选择员工职能"
            v-model="$searchQuery.identity"
            @change="onSingleSearch('identity', $event)"
            :options="identityList"
          ></a-select>
          <a-select
            class="mg-r8"
            placeholder="请选择在职状态"
            v-model="$searchQuery.work_status"
            @change="onSingleSearch('work_status', $event)"
            :options="workStatusList"
          ></a-select>
          <st-input-search
            placeholder="搜索员工"
            v-model="$searchQuery.keyword"
            @search="onKeywordsSearch('keyword', $event)"
          />
        </div>
      </a-col>
    </a-row>
    <a-row class="mg-t16">
      <st-table
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectionChange
        }"
        :loading="loading.getStaffList"
        :columns="columns"
        :dataSource="staffList"
        class="page-shop-staff-table"
        rowKey="id"
        :page="page"
        @change="onTableChange"
      >
        <template slot="staff_name" slot-scope="text, record">
          {{ text }}
          <img
            v-if="record.is_super_admin === 1"
            class="page-shop-staff-list__staff-role"
            src="~@/assets/img/icon_superadmin.png"
            alt="超级管理员"
          />
        </template>
        <st-overflow-text
          title="所在门店"
          max-width="150px"
          slot="shop"
          slot-scope="text, record"
          :value="getShopName(record)"
        />
        <template slot="identity" slot-scope="text, record">
          <template v-for="item in record.identity">
            <span :key="item.id" class="mg-r8">{{ item.name }}</span>
          </template>
        </template>
        <template slot="sex" slot-scope="text">
          <span>{{ text.name }}</span>
        </template>
        <template slot="work_status" slot-scope="text">
          <st-text
            :status="{
              success: text.id === 1,
              error: text.id === 2
            }"
          >
            {{ text.name }}
          </st-text>
        </template>
        <template slot="action" slot-scope="text, record">
          <st-table-actions>
            <a
              href="javascript: void(0)"
              v-if="record.auth['shop:staff:staff|get']"
              @click="onSearchDetail(record)"
            >
              详情
            </a>
            <template v-if="record.work_status.name === '在职'">
              <a
                href="javascript: void(0)"
                v-if="record.auth['shop:staff:staff|edit']"
                @click="onEdit(record)"
              >
                编辑
              </a>
              <a
                href="javascript: void(0)"
                v-if="record.auth['shop:staff:staff|bind_card']"
                v-modal-link="{
                  name: 'shop-staff-bind-card',
                  props: { staff: record }
                }"
              >
                绑定实体卡
              </a>
              <a
                href="javascript: void(0)"
                v-if="record.auth['shop:staff:staff|rebind_card']"
                v-modal-link="{
                  name: 'shop-staff-bind-card',
                  props: { staff: record }
                }"
              >
                重绑实体卡
              </a>
              <a
                href="javascript: void(0)"
                v-if="record.auth['shop:staff:account|save']"
                v-modal-link="{
                  name: 'shop-staff-re-password',
                  props: { staff: record }
                }"
              >
                管理登录账号
              </a>
              <a
                href="javascript: void(0)"
                v-if="record.auth['shop:staff:staff|position']"
                v-modal-link="{
                  name: 'shop-staff-update-staff-position',
                  props: { staff: record }
                }"
              >
                职位和薪资变更
              </a>
              <a
                href="javascript: void(0)"
                v-if="record.auth['shop:staff:staff|salary']"
                v-modal-link="{
                  name: 'shop-staff-salary-account-setting',
                  props: { staff: record }
                }"
              >
                设置提现账户
              </a>
              <a
                href="javascript: void(0)"
                v-if="record.auth['shop:staff:staff|shop_leave']"
                v-modal-link="{
                  name: 'shop-staff-leave-current-shop',
                  props: { staff: record }
                }"
              >
                解除门店关系
              </a>
              <a
                href="javascript: void(0)"
                v-if="record.auth['shop:staff:staff|finger_del']"
                @click="onClearFingerprintInfo(record)"
              >
                清空指纹信息
              </a>
              <a
                href="javascript: void(0)"
                v-if="record.auth['shop:staff:staff|cabinet_pwd_del']"
                @click="onClearHardwarePassword(record)"
              >
                清空硬件密码
              </a>
            </template>
          </st-table-actions>
        </template>
      </st-table>
    </a-row>
    <change-staff-postion :show="visible" :enums="enums" :data="modaldata" />
  </st-panel>
</template>

<script>
import { UserService } from '@/services/user.service'
import { ListService } from './list.service'
import ChangeStaffPostion from './list#/change-staff-postion'
import { columns } from './list.config'
import tableMixin from '@/mixins/table.mixin'
import ShopStaffBatchImport from '@/views/biz-modals/shop-staff/batch-import'
import ShopStaffBindCard from '@/views/biz-modals/shop-staff/bind-card'
import ShopStaffLeaveCurrentShop from '@/views/biz-modals/shop-staff/leave-current-shop'
import ShopStaffRePassword from '@/views/biz-modals/shop-staff/re-password'
import ShopStaffSalaryAccountSetting from '@/views/biz-modals/shop-staff/salary-account-setting'
import ShopStaffUpdateStaffPosition from '@/views/biz-modals/shop-staff/update-staff-position'
import StaffUpdateStaffPosition from '@/views/biz-modals/staff/update-staff-position'
export default {
  mixins: [tableMixin],
  modals: {
    ShopStaffBatchImport,
    ShopStaffBindCard,
    ShopStaffLeaveCurrentShop,
    ShopStaffRePassword,
    ShopStaffSalaryAccountSetting,
    ShopStaffUpdateStaffPosition,
    StaffUpdateStaffPosition
  },
  components: {
    ChangeStaffPostion
  },
  serviceInject() {
    return {
      userService: UserService,
      service: ListService
    }
  },
  rxState() {
    return {
      staffList: this.service.staffList$,
      page: this.service.page$,
      roleOptions: this.service.roleOptions$,
      loading: this.service.loading$,
      department: this.service.department$,
      identityList: this.service.identityList$,
      workStatusList: this.service.workStatusList$,
      auth: this.service.auth$
    }
  },
  data() {
    return {
      visible: false,
      value: '',
      enums: {},
      modaldata: {}
    }
  },
  computed: {
    columns
  },
  methods: {
    getShopName(record) {
      console.log('get shop name', record)
      if (record.is_super_admin) {
        return '全部'
      }
      return record.shop
        .filter(Boolean)
        .map(item => item.name)
        .join(',')
    },
    changeStaffPosition(id) {
      this.userService.getEnums().subscribe(res => {
        this.enums = res.staff
        this.visible = true
        this.modaldata = {
          nature_work: 1,
          identity: [1, 2]
        }
      })
    },
    selectDepartment(e) {
      console.log(e)
      this.value = e + ''
    },
    joinok() {
      this.onSearchReset()
    },
    onJoinDepartment(e) {
      console.log('批量加入部门')
      this.$modalRouter.push({
        name: 'shop-staff-batch-import',
        props: {
          ids: this.selectedRowKeys
        },
        on: {
          change: this.joinok
        }
      })
    },
    onAddStaff() {
      this.$router.push({
        name: 'shop-staff-add'
      })
    },
    onExportStaff() {
      console.log('导入员工')
    },
    // 详情
    onSearchDetail(e) {
      let identity = e.identity.map(ele => {
        return ele.id
      })
      this.$router.push({
        name: 'shop-staff-info-basic',
        query: {
          id: e.id
        }
      })
    },
    onEdit(e) {
      this.$router.push({
        name: 'shop-staff-edit',
        query: {
          id: e.id
        }
      })
    },
    onChooseDepartment(e) {
      console.log('选择部门', e)
      this.$router.push({
        query: {
          shop_id: e
        }
      })
    },
    onChooseStaffFn(e) {
      console.log('选择员工职能', e)
    },
    onChooseStaffStatus(e) {
      console.log('选择在职状态', e)
      this.$router.push({
        query: {
          work_status: e
        }
      })
    },
    onSearch(e) {
      console.log('搜索员工', e)
    },
    // 清空指纹信息
    onClearFingerprintInfo(record) {
      this.$confirm({
        title: '提示信息',
        content: '确认清空指纹信息？',
        onOk: () => {
          this.service.deleteStaffFinger(record.id).subscribe()
        }
      })
    },
    // 清空硬件密码
    onClearHardwarePassword(record) {
      this.$confirm({
        title: '提示信息',
        content: '确认清空硬件密码吗？',
        onOk: () => {
          this.service.deleteStaffCabinetPassword(record.id).subscribe()
        }
      })
    }
  }
}
</script>
