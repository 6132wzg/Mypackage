<template>
  <div :class="inviation()">
    <st-form :form="form" labelWidth="108px">
      <st-form-item label="功能开关" required v-if="auth.add">
        <st-switch v-model="openStatus" @change="onOpenStatusChange" />
        <span class="mg-l12 mg-r12">{{ openStatus ? '已' : '未' }}开启</span>
        <span v-if="!openStatus">
          （一旦开启，将会在小程序展示，如需关闭，请谨慎操作。）
        </span>
      </st-form-item>
      <template v-if="openStatus">
        <st-form-item label="成功规则">
          每邀请1人成功购买卡项或课程（成功支付）
        </st-form-item>
        <template v-if="!isOpen">
          <st-form-item label="邀请人奖励" required :help="inviterHelpText">
            <div :class="inviation('coupon')">
              <span class="mg-r8">可获得</span>
              <st-input-number
                :min="1"
                :max="99"
                v-model="inviterCouponNum"
                style="width:142px"
              >
                <span slot="addonAfter">张</span>
              </st-input-number>
              <span class="mg-l24 mg-r8">选择券</span>
              <template v-if="!inviterCoupon.id">
                <st-button icon="anticon:plus" @click="onAddCoupon('inviter')">
                  新增券
                </st-button>
              </template>
              <template v-else>
                <coupon-tag
                  key="1"
                  class="mg-r8"
                  :name="
                    inviterCoupon.coupon_name ? inviterCoupon.coupon_name : ''
                  "
                  @close="onClose('inviter')"
                />
                <st-button @click="onEditCoupon('inviter')">重新选择</st-button>
              </template>
            </div>
          </st-form-item>
          <st-form-item label="被邀请人奖励" required :help="inviteeHelpText">
            <div :class="inviation('coupon')">
              <span class="mg-r8">可获得</span>
              <st-input-number
                :min="1"
                :max="99"
                v-model="inviteeCouponNum"
                style="width:142px"
              >
                <span slot="addonAfter">张</span>
              </st-input-number>
              <span class="mg-l24 mg-r8">选择券</span>
              <template v-if="!inviteeCoupon.id">
                <st-button icon="anticon:plus" @click="onAddCoupon('invitee')">
                  新增券
                </st-button>
              </template>
              <template v-else>
                <coupon-tag
                  key="2"
                  class="mg-r8"
                  :name="
                    inviteeCoupon.coupon_name ? inviteeCoupon.coupon_name : ''
                  "
                  @close="onClose('invitee')"
                />
                <st-button @click="onEditCoupon('invitee')">重新选择</st-button>
              </template>
            </div>
          </st-form-item>
        </template>
        <template v-else>
          <st-form-item label="邀请人奖励" required :help="inviterHelpText">
            <div :class="inviation('coupon')">
              <span class="mg-r8">可获得</span>
              <st-input-number
                :min="1"
                :max="99"
                v-model="inviterCouponNum"
                style="width:142px"
              >
                <span slot="addonAfter">张</span>
              </st-input-number>
              <span class="mg-l24 mg-r8">选择券</span>
              <coupon-tag
                class="mg-r8"
                :name="
                  inviterCoupon.coupon_name ? inviterCoupon.coupon_name : ''
                "
                key="3"
                @close="onEditCoupon('inviter')"
              />
            </div>
          </st-form-item>
          <st-form-item label="被邀请人奖励" required :help="inviteeHelpText">
            <div :class="inviation('coupon')">
              <span class="mg-r8">可获得</span>
              <st-input-number
                :min="1"
                :max="99"
                v-model="inviteeCouponNum"
                style="width:142px"
              >
                <span slot="addonAfter">张</span>
              </st-input-number>
              <span class="mg-l24 mg-r8">选择券</span>
              <coupon-tag
                class="mg-r8"
                :name="
                  inviteeCoupon.coupon_name ? inviteeCoupon.coupon_name : ''
                "
                key="3"
                @close="onEditCoupon('invitee')"
              />
            </div>
          </st-form-item>
        </template>
        <st-form-item label="邀请海报">
          <!-- <st-card-bg-radio v-model="banner"/> -->
          <st-invitation-bg-radio v-model="invite_poster" />
        </st-form-item>
        <st-form-item label="邀请返积分">
          <div :class="inviation('integral')">
            <a-checkbox
              v-model="gift_points"
              :disabled="pluginStatus.pointActivityAtatus !== 1"
            >
              开启邀请返积分
            </a-checkbox>
            <template v-if="pluginStatus.pointActivityAtatus !== 1">
              <span :class="inviation('integral-condition-tips')">
                请先开启会员积分功能，
              </span>
              <st-link
                _blank
                :class="inviation('integral-condition-link')"
                value="去开启"
                :to="{
                  path: '/brand/marketing/plugin/member-points/list/setting'
                }"
              ></st-link>
            </template>
          </div>
          <div :class="inviation('integral')" class="mg-t12" v-if="gift_points">
            每成功邀请一人注册可获取
            <span style="width: 150px;padding: 0 10px">
              <st-input-number
                v-model="points_per_time"
                width="150px"
                type="number"
                :min="1"
                :max="99999"
                :float="true"
                :disabled="pluginStatus.pointActivityAtatus !== 1"
                placeholder="请输入"
              >
                <template slot="addonAfter">
                  积分
                </template>
              </st-input-number>
            </span>
            一天最多可获取
            <span style="width: 150px;padding: 0 10px">
              <st-input-number
                width="150px"
                v-model="day_points_limit"
                type="number"
                :min="1"
                :max="99999"
                :float="true"
                :disabled="pluginStatus.pointActivityAtatus !== 1"
                placeholder="请输入"
              >
                <template slot="addonAfter">
                  积分
                </template>
              </st-input-number>
            </span>
          </div>
        </st-form-item>
        <st-form-item label-fix v-if="auth.edit">
          <st-button
            type="primary"
            :loading="loading.edit || loading.add"
            @click="onSubmit"
          >
            保存
          </st-button>
          <st-button @click="onConfigHandle" class="mg-l16">
            配置到小程序
          </st-button>
        </st-form-item>
      </template>
    </st-form>
  </div>
</template>
<script>
import { SettingService } from './setting.service'
import { cloneDeep } from 'lodash-es'
import { IndexService } from '../index.service'
import StInvitationBgRadio from './components#/invitation-bg-radio'
import MarketingAddCoupon from '@/views/biz-modals/marketing/add-coupon'
import CouponTag from '@/views/biz-components/plugin/coupon-tag/coupon-tag'
export default {
  name: 'PageBrandMarketingInviationSetting',
  bem: {
    inviation: 'page-brand-marketing-inviation-setting'
  },
  modals: {
    MarketingAddCoupon
  },
  serviceInject() {
    return {
      settingService: SettingService,
      indexService: IndexService
    }
  },
  rxState() {
    return {
      isOpen: this.indexService.isOpen$,
      loading: this.settingService.loading$,
      settingInfo: this.settingService.settingInfo$,
      pluginStatus: this.settingService.pluginStatus$,
      auth: this.settingService.auth$
    }
  },
  data() {
    return {
      // 缓存settingInfo
      settingInfoHistory: null,
      form: this.$form.createForm(this),
      // 活动状态
      openStatus: 1,
      // 邀请人
      inviteeCoupon: {},
      inviteeHelpText: '',
      inviteeCouponNum: undefined,
      // 被邀请人
      inviterCoupon: {},
      inviterHelpText: '',
      inviterCouponNum: undefined,
      // 邀请海报
      invite_poster: {
        image_id: 0,
        image_key: 'image/VZ0RGBwTX7FA1yKb.png',
        image_url: '',
        index: 1
      },
      gift_points: false,
      points_per_time: 0,
      day_points_limit: 0
    }
  },
  computed: {
    inviteeIsOk() {
      return this.inviteeHelpText === ''
    },
    inviterIsOk() {
      return this.inviterHelpText === ''
    }
  },
  watch: {
    settingInfo: {
      deep: true,
      handler() {
        this.init()
      }
    }
  },
  methods: {
    onConfigHandle() {
      this.$router.push({
        path: '/brand/setting/mina/index'
      })
    },
    init() {
      this.settingInfoHistory = cloneDeep(this.settingInfo)
      this.inviteeHelpText = ''
      this.inviterHelpText = ''
      this.openStatus = this.settingInfo.activity_status === 1 ? 1 : 0
      this.gift_points = this.settingInfo.gift_points === 1
      this.points_per_time = this.settingInfo.points_per_time
      this.day_points_limit = this.settingInfo.day_points_limit
      if (this.settingInfo.invitee_coupon_id) {
        // 开启过，需要回显
        this.inviterCoupon = {
          id: this.settingInfo.inviter_coupon_id,
          coupon_name: this.settingInfo.inviter_coupon_name
        }
        this.inviterCouponNum = this.settingInfo.inviter_coupon_num
        this.inviteeCoupon = {
          id: this.settingInfo.invitee_coupon_id,
          coupon_name: this.settingInfo.invitee_coupon_name
        }
        this.inviteeCouponNum = this.settingInfo.invitee_coupon_num
        this.invite_poster = this.settingInfo.invite_poster
      }
    },
    // 开关
    onOpenStatusChange(data) {
      if (
        !data &&
        this.settingInfoHistory.activity_status === 1 &&
        this.settingInfoHistory.invitee_coupon_id
      ) {
        this.$confirm({
          title: '提示',
          content: `一旦关闭，全部推广功能将失效，请谨慎操作。`,
          onCancel: () => {
            this.openStatus = 1
          },
          onOk: () => {
            let params = { ...this.settingInfoHistory, activity_status: 2 }
            return this.settingService
              .edit(params)
              .toPromise()
              .then(() => {
                // 关闭成功
                this.$router.push({
                  path: '/brand/marketing/plugin/invitation/index/data'
                })
                // this.$router.reload()
              })
          }
        })
      }
    },
    // onPointsChange(e) {
    //   console.log(e.target)
    //   this.isOpenPoints = e.target.checked
    // },
    // 校验
    onValidate(type) {
      if (!this[`${type}Coupon`]) {
        this[`${type}HelpText`] = '请选择优惠券'
        return
      }
      if (!this[`${type}CouponNum`]) {
        this[`${type}HelpText`] = '请输入优惠券数量'
        return
      }
      this[`${type}HelpText`] = ''
    },
    // 新增券
    onAddCoupon(type) {
      this.$modalRouter.push({
        name: 'marketing-add-coupon',
        on: {
          success: res => {
            this[`${type}Coupon`] = cloneDeep(res.coupon)
          }
        }
      })
    },
    onEditCoupon(type) {
      this.$modalRouter.push({
        name: 'marketing-add-coupon',
        props: {
          id: this[`${type}Coupon`].id
        },
        on: {
          success: res => {
            this[`${type}Coupon`] = cloneDeep(res.coupon)
          }
        }
      })
    },
    onClose(type) {
      this[`${type}Coupon`] = {}
    },
    onSubmit() {
      this.onValidate('invitee')
      this.onValidate('inviter')
      if (this.inviteeIsOk && this.inviterIsOk) {
        let fn = this.isOpen ? 'edit' : 'add'
        console.log(fn)
        this.settingService[fn]({
          activity_status: this.openStatus ? 1 : 2,
          // 邀请人
          inviter_coupon_id: this.inviterCoupon.id,
          inviter_coupon_num: +this.inviterCouponNum,
          // 被邀请人
          invitee_coupon_id: this.inviteeCoupon.id,
          invitee_coupon_num: +this.inviteeCouponNum,
          invite_poster: this.invite_poster,
          gift_points: this.gift_points ? 1 : 0,
          points_per_time: +this.points_per_time || 0,
          day_points_limit: +this.day_points_limit || 0
        }).subscribe(() => {
          this.$router.push({
            path: './data'
          })
        })
      }
    }
  },
  created() {
    this.init()
  },
  components: {
    StInvitationBgRadio,
    CouponTag
  }
}
</script>
