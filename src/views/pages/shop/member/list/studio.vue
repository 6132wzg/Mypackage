<template>
  <st-panel app class="shop-member-list">
    <div slot="title">
      <st-input-search
        placeholder="输入手机号、姓名、卡号进行搜索"
        v-model="$searchQuery.keyword"
        @search="onKeywordsSearch('keyword', $event)"
      />
    </div>
    <div slot="prepend">
      <st-search-panel @search="onSearch" @reset="onSearchReset">
        <st-search-panel-item label="用户级别:">
          <template slot="label">
            <st-help-tooltip id="TSUL006" />
          </template>
          <a-cascader
            changeOnSelect
            v-model="member_level"
            placeholder="请选择用户级别"
            :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
            :options="memberLevelOptions"
            @change="changeLevel"
          ></a-cascader>
        </st-search-panel-item>
        <st-search-panel-item label="用户标签：">
          <a-select
            class=" select"
            v-model="$searchQuery.tag_id"
            placeholder="请选择标签"
          >
            <a-select-option
              v-for="(item, index) in labelList"
              :key="index"
              :value="item.id"
            >
              {{ item.tag_name }}
            </a-select-option>
          </a-select>
        </st-search-panel-item>
        <st-search-panel-item label="是否购买私教课：">
          <st-search-radio
            v-model="$searchQuery.buy_personal_course"
            :options="buyPersonalCourseList"
          />
        </st-search-panel-item>
        <div slot="more">
          <st-search-panel-item label="跟进销售：">
            <a-select
              class="mg-r40 select"
              v-model="$searchQuery.follow_salesman_id"
              placeholder="请选择销售"
            >
              <a-select-option
                v-for="(item, index) in saleList"
                :key="index"
                :value="item.id"
              >
                {{ item.sale_name }}
              </a-select-option>
            </a-select>
          </st-search-panel-item>
          <st-search-panel-item :label="`跟进${$c('coach')}：`">
            <a-select
              class=" select"
              v-model="$searchQuery.follow_coach_id"
              :placeholder="`请选择${$c('coach')}`"
            >
              <a-select-option
                v-for="(item, index) in coachList"
                :key="index"
                :value="item.id"
              >
                {{ item.coach_name }}
              </a-select-option>
            </a-select>
          </st-search-panel-item>
        </div>
      </st-search-panel>
    </div>
    <div class="mg-t24 mg-b16">
      <st-button
        type="primary"
        @click="addUser()"
        class="shop-member-list-button"
        v-if="auth.add"
        icon="add"
      >
        新增用户
      </st-button>
      <st-button
        v-if="auth.export"
        type="primary"
        class="mg-r8"
        v-export-excel="{
          type: 'studio_member',
          query: { conditions: conditions }
        }"
      >
        全部导出
      </st-button>
      <!-- NOTE: 导入 -->
      <!-- <st-button class="shop-member-list-button" v-if="auth.import">导入用户</st-button> -->
      <st-button
        v-if="auth.tag"
        class="shop-member-list-button"
        :disabled="!selectedRowKeys.length"
        v-modal-link="{
          name: 'shop-add-lable',
          props: {
            memberIds: selectedRowKeys
          },
          on: { success: refeshPage }
        }"
      >
        加标签
      </st-button>
      <a-popover placement="bottom">
        <template slot="content">
          <div v-if="auth.bindCoach" class="shop-member-list-button-div">
            <label
              class="shop-member-list-button-label"
              v-modal-link="{
                name: 'shop-distribution-coach',
                props: {
                  memberIds: selectedRowKeys
                },
                on: { success: refeshPage }
              }"
            >
              分配{{ $c('coach') }}
            </label>
          </div>
          <div v-if="auth.bindSalesman" class="shop-member-list-button-div">
            <label
              class="shop-member-list-button-label"
              v-modal-link="{
                name: 'shop-distribution-sale',
                props: {
                  memberIds: selectedRowKeys
                },
                on: { success: refeshPage }
              }"
            >
              分配销售
            </label>
          </div>
        </template>
        <st-button
          v-if="auth.bindCoach && auth.bindSalesman"
          class="shop-member-list-button"
          :disabled="selectedRowKeys.length > 0 ? false : true"
        >
          分配员工
        </st-button>
      </a-popover>
      <!-- NOTE: 导出 -->
    </div>
    <st-table
      :columns="columns"
      :loading="loading.getListInfo"
      :scroll="{ x: 1400 }"
      :alertSelection="{ onReset: onSelectionReset }"
      :rowSelection="{ selectedRowKeys, onChange: onSelectionChange }"
      rowKey="member_id"
      :page="page"
      @change="onTableChange"
      :dataSource="list"
    >
      <div slot="image_face" slot-scope="text, record">
        <span class="st-preview-item st-preview-item--cover" v-viewer>
          <img
            v-if="record.image_face"
            class="st-image-face"
            :src="record.image_face.url"
            :data-src="record.image_face.url"
          />
        </span>
      </div>
      <div slot="member_name" slot-scope="text, record">
        <a
          href="javascript:;"
          v-if="record.auth['shop:member:member|get']"
          @click="infoFunc(record)"
        >
          <st-overflow-text :value="text" maxWidth="100px"></st-overflow-text>
        </a>
        <span v-else>
          <st-overflow-text :value="text" maxWidth="100px"></st-overflow-text>
        </span>
        <st-icon
          v-if="record.is_minors"
          type="user-type"
          class="mg-l4"
          :color="record.sex === SEX.GIRL ? '#FF5E41' : '#3F66F6'"
        />
      </div>
      <div slot="action" slot-scope="text, record">
        <st-table-actions>
          <a
            v-if="record.auth['shop:member:member|get']"
            @click="infoFunc(record)"
          >
            详情
          </a>
          <a
            v-if="record.auth['shop:member:member|edit']"
            @click="edit(record)"
          >
            编辑
          </a>
          <a
            v-if="record.auth['shop:member:member|bind_coach']"
            @click="onDistributionCoach(record)"
          >
            绑定{{ $c('coach') }}
          </a>
          <a
            v-if="record.auth['shop:member:member|change_coach']"
            @click="onDistributionCoach(record)"
          >
            分配{{ $c('coach') }}
          </a>
          <a
            v-if="record.auth['shop:member:member|bind_salesman']"
            @click="onDistributionSale(record)"
          >
            绑定销售
          </a>
          <a
            v-if="record.auth['shop:member:member|change_salesman']"
            @click="onDistributionSale(record)"
          >
            分配销售
          </a>
          <a
            v-if="record.auth['shop:member:member|bind_card']"
            v-modal-link="{
              name: 'shop-binding-entity-card',
              props: { record },
              on: {
                success: refeshPage
              }
            }"
          >
            绑实体卡
          </a>
          <a
            v-if="record.auth['shop:member:member|rebind_card']"
            v-modal-link="{ name: 'shop-missing-card', props: { record } }"
          >
            重绑实体卡
          </a>
          <!-- <a v-if="record.auth['shop:member:member|transfer']" v-modal-link="{ name: 'shop-transfer-shop', props:{record}, on: {
                 success: refeshPage
               } }">转店</a> -->
          <a
            v-if="record.auth['shop:member:member|frozen']"
            v-modal-link="{
              name: 'shop-frozen',
              props: { record },
              on: {
                success: refeshPage
              }
            }"
          >
            冻结用户
          </a>
          <a
            v-if="record.auth['shop:member:member|unbind_wechat']"
            @click="onRemoveBind(record)"
          >
            解除微信绑定
          </a>
          <a
            v-if="record.auth['shop:member:member|change_type']"
            @click="onChangeUserType(record)"
          >
            变更用户类型
          </a>
          <a
            v-if="record.auth['shop:member:member|finger_del']"
            @click="onClearFingerprintInfo(record)"
          >
            清空指纹信息
          </a>
          <a
            v-if="record.auth['shop:member:member|cabinet_pwd_del']"
            @click="onClearHardwarePassword(record)"
          >
            清空硬件密码
          </a>
          <a
            v-if="record.auth['shop:member:member|add_point']"
            @click="onAddOrDelIntegral('shop-add')"
          >
            增加积分
          </a>
          <a
            v-if="record.auth['shop:member:member|reduce_point']"
            @click="onAddOrDelIntegral('shop-minus')"
          >
            扣减积分
          </a>
        </st-table-actions>
      </div>
    </st-table>
  </st-panel>
</template>
<script>
import moment from 'moment'
import { cloneDeep, filter, last } from 'lodash-es'
import { UserService } from '@/services/user.service'
import { StudioService } from './studio.service'
import tableMixin from '@/mixins/table.mixin'
import { columns } from './studio.config'
import ShopAddLable from '@/views/biz-modals/shop/add-lable'
import ShopBindingEntityCard from '@/views/biz-modals/shop/binding-entity-card'
import ShopDistributionCoach from '@/views/biz-modals/shop/distribution-coach'
import ShopDistributionSale from '@/views/biz-modals/shop/distribution-sale'
import ShopChangeUserType from '@/views/biz-modals/shop/change-user-type'
import ShopFrozen from '@/views/biz-modals/shop/frozen'
import ShopMissingCard from '@/views/biz-modals/shop/missing-card'
import PointsAddOrMinus from '@/views/biz-modals/brand/marketing/points/add-or-minus'
import { SEX } from '@/constants/member/info'
import { findPathWithTree } from '@/utils/find-path-with-tree'
export default {
  name: 'ShopMemberListStudio',
  mixins: [tableMixin],
  modals: {
    ShopAddLable,
    ShopBindingEntityCard,
    ShopDistributionCoach,
    ShopDistributionSale,
    ShopFrozen,
    ShopMissingCard,
    ShopChangeUserType,
    PointsAddOrMinus
  },
  serviceInject() {
    return {
      studioService: StudioService,
      userService: UserService
    }
  },
  rxState() {
    return {
      loading: this.studioService.loading$,
      auth: this.studioService.auth$,
      list: this.studioService.list$,
      page: this.studioService.page$,
      memberLevel: this.studioService.memberLevel$,
      buyPersonalCourseList: this.studioService.buyPersonalCourse$,
      saleList: this.studioService.saleList$,
      coachList: this.studioService.coachList$,
      labelList: this.studioService.labelLsit$
    }
  },
  data() {
    return {
      expand: false,
      sourceRegisterList: [],
      consumption: [],
      selectDataList: [],
      selectedRowKeys: [],
      selectedRows: [],
      SEX,
      memberLevelOptions: [],
      member_level: []
    }
  },
  computed: {
    columns,
    conditions() {
      let conditions = {
        ...this.$searchQuery,
        search: this.$searchQuery.keyword
      }
      return conditions
    }
  },
  mounted() {
    this.sourceRegisters()
    this.memberLevel.forEach(level => {
      let obj = {
        id: level.level_type,
        name: level.level_name
      }
      if (!!level.level_condition.length) {
        obj['children'] = []
        level.level_condition.forEach(item => {
          obj.children.push({
            id: item.id,
            name: item.condition_name
          })
        })
      }
      this.memberLevelOptions.push(obj)
    })
    this.setSearchData()
  },
  watch: {
    $searchQuery(newVal) {
      this.setSearchData()
    }
  },

  methods: {
    refeshPage() {
      this.selectedRowKeys = []
      this.$router.reload()
    },
    sourceRegisters() {
      this.studioService.getMemberSourceRegisters().subscribe(status => {
        this.sourceRegisterList = status
      })
    },
    setSearchData() {
      let memberLevel = []
      if (this.$searchQuery.member_level) {
        memberLevel.push(this.$searchQuery.member_level)
        if (this.$searchQuery.member_level_condition) {
          memberLevel.push(this.$searchQuery.member_level_condition)
        }
      }
      this.member_level = memberLevel
    },
    // 分配教练
    onDistributionCoach(record) {
      this.$modalRouter.push({
        name: 'shop-distribution-coach',
        props: {
          memberIds: [record.member_id],
          coachId: record.follow_coach_id
        },
        on: {
          success: () => {
            this.refeshPage()
          }
        }
      })
    },
    // 分配销售
    onDistributionSale(record) {
      this.$modalRouter.push({
        name: 'shop-distribution-sale',
        props: {
          memberIds: [record.member_id],
          saleId: record.follow_salesman_id
        },
        on: {
          success: () => {
            this.refeshPage()
          }
        }
      })
    },
    onRemoveBind(record) {
      this.$confirm({
        title: '提示信息',
        content: `确认解绑 ${record.member_name} 会员的微信绑定关系？`,
        onOk: () => {
          this.studioService
            .removeWechatBind(record.member_id)
            .subscribe(() => {
              this.refeshPage()
            })
        },
        onCancel() {}
      })
    },
    onChangeUserType(record) {
      this.$modalRouter.push({
        name: 'shop-change-user-type',
        props: {
          info: record
        },
        on: {
          success: () => {
            this.refeshPage()
          }
        }
      })
    },
    // 增加、扣减积分
    onAddOrDelIntegral(type) {
      this.$modalRouter.push({
        name: 'points-add-or-minus',
        props: {
          type,
          query: {
            memberName: this.info.member_name,
            memberId: this.$searchQuery.id
          }
        },
        on: {
          done: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 清空指纹信息
    onClearFingerprintInfo(record) {
      this.$confirm({
        title: '提示信息',
        content: '确认清空指纹信息？',
        onOk: () => {
          this.studioService.deleteMemberFinger(record.member_id).subscribe()
        }
      })
    },
    // 清空硬件密码
    onClearHardwarePassword(record) {
      this.$confirm({
        title: '提示信息',
        content: '确认清空硬件密码吗？',
        onOk: () => {
          this.studioService
            .deleteMemberCabinetPassword(record.member_id)
            .subscribe()
        }
      })
    },
    changeLevel(ids) {
      ;(this.$searchQuery.member_level = ids[0]),
        (this.$searchQuery.member_level_condition = ids[1])
    },
    edit(record) {
      this.$router.push({
        name: 'shop-member-edit',
        query: { id: record.member_id }
      })
    },
    addUser() {
      this.$router.push({ name: 'shop-member-add' })
    },
    infoFunc(record) {
      this.$router.push({
        name: 'shop-member-info-basic',
        query: { id: record.member_id }
      })
    },
    moment,
    handleReset() {
      let self = this
      for (let prop in self.form) {
        self.form[prop] = ''
      }
      this.$refs.stSeleter.handleResetItem()
      this.consumption = []
      this.$router.push({ query: {} })
    },
    toggle() {
      this.expand = !this.expand
    },
    onSelectionReset() {
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    onSelectionChange(keys, selectedRows) {
      this.selectedRowKeys = keys
      this.selectedRows = selectedRows
      this.selectDataList = selectedRows.map(item => {
        return item.id
      })
    },
    $searchQueryFunc() {
      this.$router.push({ query: this.form })
    },
    toCrowd() {
      this.$router.push({
        name: 'shop-member-crowd-index'
      })
    }
  }
}
</script>
