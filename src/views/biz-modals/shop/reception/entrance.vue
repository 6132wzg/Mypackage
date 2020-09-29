<template>
  <st-modal
    :title="`${isEntry ? '离场' : '入场'}`"
    v-model="show"
    width="800px"
    wrapClassName="modal-shop-reception-entrance"
    @cancel="handleClose"
  >
    <div class="member">
      <!-- 会员信息 -->
      <div class="member-info">
        <div class="member-info-base">
          <!-- 头像 -->
          <div class="member-info-base__avatar">
            <face-upload
              width="146px"
              height="146px"
              placeholder="上传人脸"
              @change="handlePhotoChange"
              :list="photoList"
              :faceEditAuth="auth.editFace"
              :actionAuth="auth.delFace"
            >
              <div
                class="avatar-tip"
                v-if="memberType.name"
                slot="actionContent"
              >
                {{ memberType.name }}
              </div>
            </face-upload>
            <div class="avatar-tag" v-if="memberIsBirthday">
              <img src="~@/assets/img/icon_face_birthday.png" alt="" />
            </div>
          </div>
          <!-- 基本信息 -->
          <div class="member-info-base__info">
            <!-- 姓名,手机号  -->
            <div class="info-bar mg-b8">
              <div class="name">
                {{ memberInfo.member_name }}
              </div>
              <div class="sex">
                <st-icon
                  :type="memberInfo.sex === 1 ? 'female' : 'male'"
                  :style="
                    memberInfo.sex === 1 ? 'color:#FF5E41' : 'color:#3F66F6'
                  "
                />
              </div>

              <div class="phone">
                {{ memberInfo.mobile }}
              </div>
            </div>
            <!-- 标签 -->
            <div class="info-bar mg-b4">
              <div class="tag">
                <div v-for="tag in tags" :key="tag.id">
                  <a-tooltip :key="tag.id" :title="tag.name">
                    <a-tag
                      class="tag-item"
                      :key="tag.name"
                      :closable="auth.editMember"
                      @close="handleRemoveTag(tag)"
                    >
                      {{ tag.name }}
                    </a-tag>
                  </a-tooltip>
                </div>
                <a
                  v-modal-link="{
                    name: 'shop-add-lable',
                    props: {
                      memberIds: [member_id]
                    },
                    on: { success: handleGetMemberInfo }
                  }"
                >
                  <a-tag style="background: #fff; borderStyle: dashed;">
                    <a-icon type="plus" style="margin-right: 8px;" />
                    标签
                  </a-tag>
                </a>
              </div>
            </div>
            <div class="info-bar">
              <!-- 卡号 -->
              <info-edit
                label="实体卡号："
                :value="memberInfo.card_num"
                :canEdit="auth.editCardNum"
                :invisibleEdit="isAnyEdit"
                @confirm="handleCardNumChange"
                @changeEditStatus="handleChangeEditStatus"
              >
                <st-overflow-text
                  max-width="170px"
                  :value="cardNum"
                ></st-overflow-text>
              </info-edit>
              <!-- 物理卡号 -->
              <info-edit
                label="物理ID："
                :value="memberInfo.rfid"
                :canEdit="auth.editCardNum"
                :invisibleEdit="isAnyEdit"
                @confirm="handleRfidChange"
                @changeEditStatus="handleChangeEditStatus"
              >
                <st-overflow-text
                  max-width="170px"
                  :value="rfid"
                ></st-overflow-text>
              </info-edit>
            </div>
            <div class="info-bar">
              <!-- 跟进销售 -->
              <info-edit
                type="select"
                label="跟进销售："
                :invisibleEdit="isAnyEdit"
                :canEdit="auth.bindSalesman"
                :value="seller"
                :options="sellerList"
                @confirm="handleEditSeller"
                @changeEditStatus="handleChangeEditStatus"
              >
                <st-overflow-text
                  max-width="170px"
                  :value="sellerName"
                ></st-overflow-text>
              </info-edit>
              <!-- 跟进教练 -->
              <info-edit
                type="select"
                :label="`跟进${$c('coach')}：`"
                :invisibleEdit="isAnyEdit"
                :canEdit="auth.bindCoach"
                :value="coach"
                :options="coachList"
                @confirm="handleEditCoach"
                @changeEditStatus="handleChangeEditStatus"
              >
                <st-overflow-text
                  max-width="170px"
                  :value="coachName"
                ></st-overflow-text>
              </info-edit>
            </div>
          </div>
        </div>
        <div class="member-info-detail">
          <!-- 备注 -->
          <div class="member-info-detail__remark">
            <info-edit
              label="备注："
              labelWidth="42"
              type="textarea"
              placeholder="添加备注信息"
              :canEdit="auth.editMember"
              :value="memberInfo.remark"
              :invisibleEdit="isAnyEdit"
              @confirm="handleRemarkChange"
              @changeEditStatus="handleChangeEditStatus"
              editBgColor="#f7f9fc"
              class="remark"
            >
              <st-overflow-text
                max-width="630px"
                needMaxContainerWidth
                :defaultNoValueContent="auth.editMember ? '点击添加备注' : '--'"
                :value="memberInfo.remark"
              ></st-overflow-text>
            </info-edit>
          </div>
        </div>
      </div>
      <!-- 入场凭证 -->
      <div class="member-entrance">
        <div class="member-entrance-title">
          <div class="tip">入场凭证</div>
          <div v-if="!isEntry">
            <st-checkbox v-model="isCheckinCourse" v-if="auth.entranceCheckin">
              凭课入场后直接签到课程
            </st-checkbox>
          </div>
          <div v-else class="info">
            <div class="label">入场时间：</div>
            <div class="content">{{ memberInfo.entry_time }}</div>
          </div>
        </div>
        <!-- 入场 -->
        <div v-if="!isEntry">
          <!-- 课类凭证 -->
          <a-checkbox-group
            v-model="courseProof"
            class="member-entrance-tickets mg-b16"
            @change="handleCourseProofChange"
            v-if="courseList.length"
          >
            <div
              class="member-entrance-ticket"
              v-for="entranceOption in courseList"
              :key="entranceOption.id"
            >
              <a-checkbox
                :value="entranceOption.id"
                :disabled="!entranceOption.is_able"
              />
              <div
                class="ticket-info"
                :class="{ disabled: !entranceOption.is_able }"
              >
                <div class="ticket-info__base">
                  <div class="tag">
                    <st-tag
                      :type="entranceOptionType[entranceOption.proof_type]"
                    ></st-tag>
                  </div>
                  <div class="name">{{ entranceOption.proof_name }}</div>
                  <div class="reason">{{ entranceOption.reason }}</div>
                  <div v-if="entranceOption.reason_hover.length">
                    <a-tooltip>
                      <template slot="title">
                        <div
                          v-for="(reson, index) in entranceOption.reason_hover"
                          :key="index"
                        >
                          {{ reson }}
                        </div>
                      </template>
                      <span class="st-help-tooltip-img tip">
                        <img
                          height="14"
                          width="14"
                          src="~@/assets/img/tooltip-help.png"
                        />
                      </span>
                    </a-tooltip>
                  </div>
                </div>
                <div
                  class="ticket-info__detail"
                  v-if="
                    entranceOption.proof_info &&
                      entranceOption.proof_info.length
                  "
                >
                  <div
                    class="info"
                    v-for="(info, index) in entranceOption.proof_info"
                    :key="index"
                  >
                    <span class="label">{{ info.key }}：</span>
                    <span class="content">{{ info.value }}</span>
                  </div>
                </div>
                <!-- 备注 -->
                <div
                  class="ticket-info__remark"
                  v-if="entranceOption.description"
                >
                  <info-edit
                    label="备注："
                    labelWidth="42"
                    type="textarea"
                    placeholder="添加备注信息"
                    :canEdit="
                      handleJudgeRemarkAuth(
                        entranceOption.description.product_type,
                        entranceOption.auth
                      )
                    "
                    :value="entranceOption.description.description"
                    :invisibleEdit="isAnyEdit"
                    @confirm="
                      e =>
                        handleEntranceRemarkChange(
                          e,
                          entranceOption.description
                        )
                    "
                    @changeEditStatus="handleChangeEditStatus"
                    class="remark"
                    editBgColor="rgba(0,0,0,0.04)"
                  >
                    <span
                      v-if="!entranceOption.description.description"
                      class="ticket-info__remark-value"
                    >
                      {{
                        handleJudgeRemarkAuth(
                          entranceOption.description.product_type,
                          entranceOption.auth
                        )
                          ? '点击添加备注'
                          : '--'
                      }}
                    </span>
                    <span v-else class="ticket-info__remark-value">
                      {{ entranceOption.description.description }}
                    </span>
                  </info-edit>
                </div>
              </div>
            </div>
          </a-checkbox-group>
          <!-- 卡类凭证 -->
          <div class="member-entrance-tickets" v-if="cardList.length">
            <div
              class="member-entrance-ticket"
              v-for="entranceOption in cardList"
              :key="entranceOption.id"
              :class="{ temporary: entranceOption.id === 0 }"
            >
              <a-radio
                :value="entranceOption.id"
                :checked="entranceOption.id === cardProof"
                :disabled="!entranceOption.is_able"
                @change="handleProofChange"
              ></a-radio>
              <div
                class="ticket-info"
                :class="{ disabled: !entranceOption.is_able }"
              >
                <div class="ticket-info__base">
                  <div class="tag">
                    <st-tag
                      :type="entranceOptionType[entranceOption.proof_type]"
                    ></st-tag>
                  </div>
                  <div class="name">{{ entranceOption.proof_name }}</div>
                  <div class="reason">{{ entranceOption.reason }}</div>
                  <div v-if="entranceOption.reason_hover.length">
                    <a-tooltip>
                      <template slot="title">
                        <div
                          v-for="(reson, index) in entranceOption.reason_hover"
                          :key="index"
                        >
                          {{ reson }}
                        </div>
                      </template>
                      <span class="st-help-tooltip-img tip">
                        <img
                          height="14"
                          width="14"
                          src="~@/assets/img/tooltip-help.png"
                        />
                      </span>
                    </a-tooltip>
                  </div>
                </div>
                <div
                  class="ticket-info__detail"
                  v-if="
                    entranceOption.proof_info &&
                      entranceOption.proof_info.length
                  "
                >
                  <div
                    class="info"
                    v-for="(info, index) in entranceOption.proof_info"
                    :key="index"
                  >
                    <span class="label">{{ info.key }}：</span>
                    <span class="content">{{ info.value }}</span>
                  </div>
                </div>
                <!-- 扣次 -->
                <div
                  class="ticket-info__deductNum"
                  v-if="
                    entranceOption.proof_type === 2 && entranceOption.is_able
                  "
                >
                  本次入场扣次:
                  <st-input-number
                    :min="1"
                    :step="1"
                    :precision="0"
                    :disabled="!entranceOption.is_able"
                    v-model="entranceOption.deduct_num"
                    style="width: 65px"
                    class="ticket-info__deductNum-input"
                  ></st-input-number>
                  次
                </div>
                <!-- 备注 -->
                <div
                  class="ticket-info__remark"
                  v-if="entranceOption.description"
                >
                  <info-edit
                    label="备注："
                    labelWidth="42"
                    type="textarea"
                    placeholder="添加备注信息"
                    :canEdit="
                      handleJudgeRemarkAuth(
                        entranceOption.description.product_type,
                        entranceOption.auth
                      )
                    "
                    :value="entranceOption.description.description"
                    :invisibleEdit="isAnyEdit"
                    @confirm="
                      e =>
                        handleEntranceRemarkChange(
                          e,
                          entranceOption.description
                        )
                    "
                    @changeEditStatus="handleChangeEditStatus"
                    class="remark"
                    editBgColor="rgba(0,0,0,0.04)"
                  >
                    <span
                      v-if="!entranceOption.description.description"
                      class="ticket-info__remark-value"
                    >
                      {{
                        handleJudgeRemarkAuth(
                          entranceOption.description.product_type,
                          entranceOption.auth
                        )
                          ? '点击添加备注'
                          : '--'
                      }}
                    </span>
                    <span v-else class="ticket-info__remark-value">
                      {{ entranceOption.description.description }}
                    </span>
                  </info-edit>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 离场 -->
        <div class="member-entrance-ticket" v-else>
          <div class="ticket-info">
            <div class="ticket-info__base">
              <div class="tag">
                <st-tag
                  :type="entranceOptionType[memberProof.proof_type]"
                ></st-tag>
              </div>
              <div class="name">{{ memberProof.proof_name }}</div>
            </div>
            <div
              class="ticket-info__detail"
              v-if="memberProof.proof_info.length"
            >
              <div
                class="info"
                v-for="(info, index) in memberProof.proof_info"
                :key="index"
              >
                <span class="label">{{ info.key }}：</span>
                <span class="content">{{ info.value }}</span>
              </div>
            </div>
            <div class="ticket-info__remark" v-if="memberProof.description">
              <info-edit
                label="备注："
                labelWidth="42"
                type="textarea"
                placeholder="添加备注信息"
                :canEdit="
                  handleJudgeRemarkAuth(
                    memberProof.description.product_type,
                    memberAuth
                  )
                "
                :value="memberProof.description.description"
                :invisibleEdit="isAnyEdit"
                @confirm="
                  e => handleEntranceRemarkChange(e, memberProof.description)
                "
                @changeEditStatus="handleChangeEditStatus"
                class="remark"
                editBgColor="rgba(0,0,0,0.04)"
              >
                <span
                  v-if="!memberProof.description.description"
                  class="ticket-info__remark-value"
                >
                  {{
                    handleJudgeRemarkAuth(
                      memberProof.description.product_type,
                      memberAuth
                    )
                      ? '点击添加备注'
                      : '--'
                  }}
                </span>
                <span v-else class="ticket-info__remark-value">
                  {{ memberProof.description.description }}
                </span>
              </info-edit>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <div class="member-footer">
        <div class="member-footer-left">
          <div class="info">
            <div class="label">租柜：</div>
            <div class="content">
              <st-overflow-text
                max-width="170px"
                :value="leasingCabinetText"
              ></st-overflow-text>
            </div>
          </div>
          <div class="info">
            <div class="label">临时柜：</div>
            <div class="content" v-if="!isEntry || isCabinetAllocation">
              <a-select
                v-model="temporary_cabinet"
                placeholder="请选择"
                showSearch
                allowClear
                :open="cabinetSearchOpen"
                :filterOption="false"
                :defaultActiveFirstOption="true"
                @search="handleCabinetSearch"
                @blur="handleCabinetBlur"
                @focus="handleCabinetFocus"
                @inputKeydown="handleCabinetEnter"
                style="width: 156px"
                ref="cabinet"
              >
                <a-select-option
                  v-for="(item, index) in cabinetList"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </div>
            <div class="content" v-else>
              {{ temporaryCabinet.name || '暂无' }}
            </div>
          </div>
        </div>
        <div class="member-footer-button">
          <st-button
            class="entryButton"
            type="primary"
            v-if="!isEntry"
            :disabled="!canEntry"
            :loading="loading.setEntrance"
            @click="onEntry"
          >
            入场
            <img src="~@/assets/img/icon_enter@2x.png" alt="" />
          </st-button>
          <st-button
            class="entryButton"
            type="primary"
            v-if="isEntry"
            @click="handleAllocationCabint"
          >
            分配柜子&nbsp;
            <img
              src="~@/assets/img/icon_enter@2x.png"
              alt=""
              v-if="isCabinetAllocation"
            />
            <span v-else>F9</span>
          </st-button>
          <st-button
            class="leaveButton"
            v-if="isEntry && !isCabinetAllocation"
            :disabled="!auth.checkout"
            @click="onLeaveConfirm"
          >
            离场
            <img src="~@/assets/img/icon_enter@2x.png" alt="" />
          </st-button>
        </div>
      </div>
    </template>
  </st-modal>
</template>
<script>
import infoEdit from '@/views/components/info-edit#/info-edit'
import faceUpload from '@/views/biz-components/face-upload/face-upload'
import ShopAddLable from '@/views/biz-modals/shop/add-lable'
import { MessageService } from '@/services/message.service'

import { EntranceService } from './entrance.service'
import { cloneDeep, get, debounce } from 'lodash-es'
export default {
  name: 'modal-shop-reception-entrance',
  props: {
    member_id: {
      type: [String, Number]
    }
  },
  components: { faceUpload, infoEdit },
  modals: { ShopAddLable },
  serviceInject() {
    return {
      messageService: MessageService,
      entranceService: EntranceService
    }
  },
  rxState() {
    return {
      cabinetList: this.entranceService.cabinetList$,
      loading: this.entranceService.loading$,
      page: this.entranceService.page$,
      sellerList: this.entranceService.sellerList$,
      coachList: this.entranceService.coachList$,
      cardList: this.entranceService.cardList$,
      courseList: this.entranceService.courseList$,
      entranceList: this.entranceService.entranceList$,
      parent_types: this.entranceService.parent_types$,
      auth: this.entranceService.auth$
    }
  },
  data() {
    return {
      show: false,
      isAnyEdit: false, // 是否处于编辑状态
      memberInfo: {}, // 会员详细信息
      memberAuth: {},
      photoList: [], // 会员头像
      cabinets: [], // 柜子
      tags: [], // 标签列表
      proof: '', // 入场凭证
      courseProof: [], // 课类入场凭证
      cardProof: '', // 卡类入场凭证
      temporary_cabinet: '', // 临时租赁柜
      seller: '', // 销售
      coach: '', // 教练
      entranceOptionType: {
        '1': 'reception-period-card',
        '2': 'reception-number-card',
        '3': 'reception-visit-appointment',
        '4': 'reception-personal-course',
        '5': 'reception-personal-team-course',
        '6': 'reception-team-course',
        '7': 'reception-small-course',
        '8': 'reception-site-appointment'
      },
      isCheckinCourse: 1, // 凭课入场
      cabinetSearchOpen: false, // 储物柜下拉列表开启
      cabintSearchText: '', // 储物柜搜索词
      isCabinetAllocation: false, // 是否在分配柜子的状态下
      isCabinetFocus: false, // 是否为临时柜聚焦状态
      timer: null
    }
  },
  computed: {
    // 是否已入场
    isEntry() {
      return (
        this.memberInfo.entry_status &&
        +this.memberInfo.entry_status.value === 1
      )
    },
    canEntry() {
      if (!this.auth.checkin) return false
      if (this.courseProof.length) {
        return true
      }
      return (this.cardProof && this.cardProof !== -1) || this.cardProof === 0
    },
    memberIsBirthday() {
      return get(this.memberInfo, 'is_birthday', false)
    },
    memberType() {
      return get(this.memberInfo, 'member_type', {})
    },
    memberProof() {
      return get(this.memberInfo, 'proof', {})
    },
    temporaryCabinet() {
      let temporary_cabinet = get(this.memberInfo, 'temporary_cabinet', [])
      let cabinet = temporary_cabinet.length ? temporary_cabinet[0] : {}
      // 临时
      return cabinet
    },
    leasingCabinets() {
      // 长期
      return get(this.memberInfo, 'leasing_cabinet', [])
    },
    leasingCabinetText() {
      if (!this.leasingCabinets.length) return '暂无'
      return this.leasingCabinets.reduce((str, cur) => {
        let prefix = str ? ' / ' : ''
        str += prefix + cur.name
        return str
      }, '')
    },
    coachName() {
      return get(this.memberInfo.coach, 'name', '')
    },
    sellerName() {
      return get(this.memberInfo.seller, 'name', '')
    },
    cardNum() {
      return get(this.memberInfo, 'card_num', '')
    },
    rfid() {
      return get(this.memberInfo, 'rfid', '')
    }
  },
  mounted() {
    this.entranceService.init().subscribe()
    // 获取会员详情
    this.init()
    document.addEventListener('keydown', this.onInputKeyPress)
  },
  destroyed() {
    document.removeEventListener('keydown', this.onInputKeyPress)
  },
  methods: {
    handleJudgeRemarkAuth(product_type, authList) {
      if (Array.isArray(authList)) return false
      // 不存在产品类型
      if (!product_type) return false
      // 场地预约
      if (product_type === 8) return false
      let mapOption = {
        1: 'shop:sold:sold_personal_course|internal_description',
        2: 'shop:sold:sold_small_class_course|internal_description',
        3: 'shop:sold:sold_package_course|internal_description',
        4: 'shop:sold:sold_deposit_card|internal_description',
        5: 'shop:sold:sold_member_card|internal_description'
      }
      let auth = mapOption[product_type]
      return !!authList[auth]
    },
    handleEntranceRemarkChange(description, remarkData) {
      this.entranceService
        .addDescription({
          description,
          order_id: remarkData.order_id
        })
        .subscribe(res => {
          remarkData.description = description
        })
    },
    handleCourseProofChange(proof) {
      if (proof.length) {
        // 卡课不能一起选择
        this.cardProof = ''
      }
    },
    // 分配柜子
    handleAllocationCabint() {
      if (!this.isCabinetAllocation) {
        this.isCabinetAllocation = true
        setTimeout(() => {
          this.$refs.cabinet.$el.click()
        }, 200)
      } else {
        if (!this.isCabinetFocus) {
          if (!this.temporary_cabinet) {
            this.messageService.error({ content: '请选择一个临时柜' })
            setTimeout(() => {
              this.$refs.cabinet.$el.click()
            }, 200)
          } else {
            this.handleChangeUserCabint()
          }
        } else {
          if (this.temporary_cabinet) {
            this.handleChangeUserCabint()
          }
        }
      }
    },
    handleCabinetBlur() {
      this.cabinetSearchOpen = false
      this.isCabinetFocus = false
      this.cabintSearchText = ''
    },
    handleCabinetFocus() {
      this.isCabinetFocus = true
      if (!this.cabintSearchText) {
        this.cabinetSearchOpen = false
        return
      }
      if (!this.cabinetSearchOpen) this.cabinetSearchOpen = true
    },
    handleCabinetSearch: debounce(function(keyword) {
      this.cabinetSearchOpen = true
      this.cabintSearchText = keyword.trim()
      if (!keyword.trim()) return false
      console.log('keyword', keyword)
      this.entranceService
        .getCabinetList(this.member_id, {
          keyword: this.cabintSearchText
        })
        .subscribe()
    }, 100),
    handleCabinetEnter(e) {
      let keyCode = e.keyCode
      let keyword = e.target.value
      console.log('handleCabinetEnter', keyword)

      if (this.loading.getCabinetList) return false
      if (keyCode !== 13) return false
      if (!this.isEntry) {
        // 未入场并可以入场时
        if (keyword) {
          this.handleSearchCabintAndChange(keyword)
        } else {
          if (this.isCabinetFocus) this.onEntry()
        }
      } else {
        // 已入场,在分配柜子状态下
        if (keyword) {
          this.handleSearchCabintAndChange(keyword)
        } else {
          if (!this.temporary_cabinet) {
            this.messageService.error({ content: '请选择一个临时柜' })
            setTimeout(() => {
              this.$refs.cabinet.$el.click()
            }, 200)
          } else {
            this.handleChangeUserCabint()
          }
        }
      }
    },
    handleSearchCabintAndChange(keyword) {
      this.entranceService
        .getCabinetList(this.member_id, {
          keyword
        })
        .subscribe(res => {
          let list = res.list
          let id = list.length ? list[0]['id'] : undefined
          if (id) {
            this.temporary_cabinet = id
            console.log('id', id)
            if (this.isEntry) {
              this.handleChangeUserCabint()
            } else {
              this.onEntry()
            }
          } else {
            this.messageService.error({ content: '未搜索到储物柜' })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
              this.$refs.cabinet.$children[0]['setInputValue']('')
              this.$refs.cabinet.$el.click()
            }, 200)
          }
        })
    },
    // 分配柜子
    handleChangeUserCabint() {
      this.entranceService
        .editEntranceCabinet({
          member_id: +this.member_id,
          cabinet_id: this.temporary_cabinet
        })
        .subscribe(res => {
          this.show = false
          this.$emit('done')
          // if (this.isCabinetAllocation) this.isCabinetAllocation = false
          // this.cabintSearchText = ''
          // this.handleGetMemberInfo()
        })
    },
    onInputKeyPress(e) {
      let keyCode = e.keyCode
      // 判断是否在编辑状态,编辑状态下不可入离场
      if (this.isAnyEdit) {
        return false
      }
      if (keyCode === 13) {
        if (this.isEntry) {
          if (!this.isCabinetAllocation) {
            this.onLeaveConfirm()
          } else {
            if (this.isCabinetFocus) return false
            if (!this.temporary_cabinet) {
              setTimeout(() => {
                this.$refs.cabinet.$el.click()
                this.messageService.error({ content: '请选择一个临时柜' })
              }, 200)
            } else {
              this.handleChangeUserCabint()
            }
          }
        } else {
          // 在选择柜子
          if (!this.isCabinetFocus) {
            this.onEntry()
          }
        }
      }
      // 分配柜子
      if (keyCode === 120) {
        if (this.isEntry) this.handleAllocationCabint()
      }
    },
    init() {
      this.entranceService.getMemberInfo(this.member_id).subscribe(res => {
        this.memberInfo = cloneDeep(res.info)
        this.memberAuth = cloneDeep(res.auth)
        this.seller = get(res.info.seller, 'id', -1)
        this.coach = get(res.info.coach, 'id', -1)
        this.temporary_cabinet = get(this.temporaryCabinet, 'id', undefined)
        this.tags = res.info.member_tag
        this.photoList = !Array.isArray(res.info.face_url)
          ? [res.info.face_url]
          : []
        this.isCheckinCourse = res.info.is_checkin_course
        this.proof = get(res.info.proof, 'proof_type')
        // 获取会员入场凭证列表
        if (!this.isEntry) {
          this.entranceService
            .getEntranceOptionList(this.member_id)
            .subscribe(res => {
              this.handleInitProof()
              setTimeout(() => {
                this.$refs.cabinet.$el.click()
              }, 300)
            })
        } else {
          if (this.isCabinetAllocation) {
            setTimeout(() => {
              this.$refs.cabinet.$el.click()
            }, 300)
          }
        }
        this.entranceService.setCabinetList(res.info.temporary_cabinet)
        // 获取会员储物柜列表
      })
    },
    handleProofChange(e) {
      if (e.target.value) this.courseProof = []
      this.cardProof = e.target.value
    },
    // 删除标签
    handleRemoveTag(tag) {
      this.entranceService
        .getMemberLabelDelete({ user_id: this.member_id, tag_id: tag.id })
        .subscribe(res => {
          this.handleGetMemberInfo()
        })
    },
    // 获取会员详情
    handleGetMemberInfo() {
      this.entranceService.getMemberInfo(this.member_id).subscribe(res => {
        this.memberInfo = cloneDeep(res.info)
        this.memberAuth = cloneDeep(res.auth)
        this.seller = get(res.info.seller, 'id', -1)
        this.coach = get(res.info.coach, 'id', -1)
        this.tags = res.info.member_tag
        this.photoList = !Array.isArray(res.info.face_url)
          ? [res.info.face_url]
          : []

        if (!this.isEntry) {
          this.handleInitProof()
        }
      })
    },
    handleInitProof() {
      if (this.courseList.length && !this.courseProof.length) {
        let proofs = this.courseList.filter(option => option.is_able)
        this.courseProof = proofs.length ? [proofs[0]['id']] : []
      } else if (!this.proof) {
        let proofs = this.cardList.filter(option => option.is_able)
        if (proofs.length === 1 && proofs[0]['id'] === 0) {
          this.cardProof = ''
        } else {
          this.cardProof = proofs.length
            ? proofs[0]['id']
            : this.cardList[0]['id']
        }
      }
    },
    // 头像变更
    handlePhotoChange(list) {
      this.entranceService
        .editFace(this.member_id, {
          image_face: list[0]
        })
        .subscribe(res => {
          this.handleGetMemberInfo()
        })
    },
    // 物理卡号变更
    handleRfidChange(rfid) {
      this.entranceService
        .getMemberPhysicalBind(+this.member_id, {
          card_num:
            typeof this.memberInfo.card_num === 'string'
              ? this.memberInfo.card_num.trim()
              : this.memberInfo.card_num,
          rfid: typeof rfid === 'string' ? rfid.trim() : rfid // 物理ID
        })
        .subscribe(res => {
          this.handleGetMemberInfo()
        })
    },
    // 实体卡号变更
    handleCardNumChange(card_num) {
      this.entranceService
        .getMemberPhysicalBind(+this.member_id, {
          card_num: typeof card_num === 'string' ? card_num.trim() : card_num,
          rfid:
            typeof this.memberInfo.rfid === 'string'
              ? this.memberInfo.rfid.trim()
              : this.memberInfo.rfid // 实体卡号
        })
        .subscribe(res => {
          this.handleGetMemberInfo()
        })
    },
    // 销售变更
    handleEditSeller(seller_id) {
      this.entranceService
        .editSeller({
          member_id: +this.member_id,
          seller_id: seller_id === -1 ? 0 : seller_id
        })
        .subscribe(res => {
          this.handleGetMemberInfo()
        })
    },
    // 教练变更
    handleEditCoach(coach_id) {
      this.entranceService
        .editCoach({
          member_id: +this.member_id,
          coach_id: coach_id === -1 ? 0 : coach_id
        })
        .subscribe(res => {
          this.handleGetMemberInfo()
        })
    },
    // 备注变更
    handleRemarkChange(remark) {
      this.entranceService
        .updateMemberEdit(+this.member_id, {
          remark
        })
        .subscribe(res => {
          this.handleGetMemberInfo()
        })
    },
    // 修改编辑状态
    handleChangeEditStatus(val) {
      this.isAnyEdit = val
    },
    // 入场
    onEntry() {
      // 编辑状态下不可入场
      if (this.isAnyEdit) return false
      // 未选择凭证不可入场
      if (!this.canEntry) return false
      let cabinet_id = this.temporary_cabinet
        ? +this.temporary_cabinet
        : undefined
      let seller_id = this.seller === -1 ? undefined : +this.seller
      let coach_id = this.coach === -1 ? undefined : +this.coach
      let member_id = +this.member_id
      let is_checkin_course = this.isCheckinCourse
      let deduct_num
      let proof = []
      if (this.cardProof || this.cardProof === 0) {
        console.log('this.cardProof', this.cardProof)
        let currentProof =
          this.cardList.length > 0 &&
          this.cardList.filter(i => i.id === this.cardProof)[0]
        proof = [
          {
            proof_value: +this.cardProof,
            proof_type: currentProof.proof_type
          }
        ]
        deduct_num = currentProof.deduct_num
      } else {
        proof = this.courseProof.map(i => {
          let obj = this.courseList.filter(course => course.id === i)[0]
          console.log('obj', obj)
          return {
            proof_value: obj.id,
            proof_type: obj.proof_type
          }
        })
      }
      let reqParams = {
        member_id,
        seller_id,
        coach_id,
        cabinet_id,
        proof,
        is_checkin_course,
        deduct_num
      }
      if (cabinet_id) {
        reqParams = Object.assign(reqParams, {
          cabinet_id
        })
      }
      this.entranceService.setEntrance(reqParams).subscribe(res => {
        this.show = false
        this.messageService.success({ content: '入场成功' })
        this.$emit('done')
      })
    },
    // 离场之前的确认
    onLeaveConfirm() {
      if (!this.auth.checkout) return false
      this.entranceService.getCabinetInfo(this.member_id).subscribe(res => {
        if (res.info.is_smart) {
          this.$error({
            title: `当前会员有储物柜「${res.info.cabinet_area_name}」「${res.info.serial_num}」尚未归还，请先归还！`,
            okText: '知道了'
          })
        } else {
          this.onLeave()
        }
      })
    },
    // 离场
    onLeave() {
      this.entranceService.setEntranceLeave(this.member_id).subscribe(res => {
        this.show = false
        this.messageService.success({ content: '离场成功' })
        this.$emit('done')
      })
    },
    handleClose() {
      this.show = false
      this.$emit('done')
    }
  }
}
</script>
