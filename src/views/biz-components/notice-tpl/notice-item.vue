<template>
  <div :class="tpl()">
    <div :class="tpl('title')">{{ info.title }}</div>
    <div :class="tpl('content')">
      <div :class="tpl('text')">{{ info.notify_time.name }}</div>
      <div :class="tpl('text')">{{ info.notify_type.name }}</div>
      <div :class="tpl('text')" style="padding-left:0">
        <st-switch
          @change="save"
          v-if="auth.sms"
          v-model="params.notify_mode.sms"
        ></st-switch>
      </div>
      <div :class="tpl('text')" style="padding-left:0">
        <st-switch
          v-if="info.notify_type.value === typeMap['app'] && auth.app"
          @change="save"
          v-model="params.notify_mode.app"
        ></st-switch>
        <st-switch
          v-if="
            info.notify_type.value === typeMap['mini_programs'] &&
              params.notify_mode.mini_programs > -1 &&
              auth.mina
          "
          @change="save"
          v-model="params.notify_mode.mini_programs"
        ></st-switch>
        <span
          class="color-primary mg-l12 cursor-pointer"
          v-show="
            info.notify_type.value === typeMap['mini_programs'] &&
              params.notify_mode.mini_programs &&
              params.notify_mode.mini_programs > -1
          "
          type="primary"
          v-modal-link="{
            name: 'brand-setting-sms-notice',
            props: {
              img: info.img_url
            }
          }"
        >
          预览
        </span>
        <span
          class="color-text-light"
          v-if="
            info.notify_type.value === typeMap['mini_programs'] &&
              params.notify_mode.mini_programs < 0
          "
        >
          暂不支持
        </span>
      </div>
      <div
        v-show="
          params.notify_mode.sms ||
            params.notify_mode.app ||
            params.notify_mode.mini_programs
        "
      >
        <div class="shadow"></div>
        <div :class="tpl('column')" v-show="!isShowEdit">
          <div class="width75" :class="tpl('text')" v-if="info.preview">
            <span class="color-title mg-r8">预览内容:</span>
            <span :class="tpl('text-right')">{{ info.preview }}</span>
          </div>
          <div :class="tpl('text')" style="padding-left:0">
            <span
              class="color-primary cursor-pointer"
              @click="showEdit"
              v-if="auth.edit"
            >
              编辑
            </span>
          </div>
          <div
            class="width75"
            :class="tpl('text')"
            v-if="info.receiver_description"
          >
            <span class="color-title">接收人员:</span>
            <span class="mg-l8">{{ info.receiver_description }}</span>
          </div>
          <div
            class="width75"
            :class="tpl('text')"
            v-if="info.course_type_description"
          >
            <span class="color-title">课程类型:</span>
            <span class="mg-l8">{{ info.course_type_description }}</span>
          </div>
          <div
            class="width75"
            :class="tpl('text')"
            v-if="info.order_type_description"
          >
            <span class="color-title">订单类型:</span>
            <span class="mg-l8">{{ info.order_type_description }}</span>
          </div>
        </div>
        <div :class="tpl('column')" v-show="isShowEdit">
          <div class="width75" :class="tpl('text')">
            <div class="mg-b16" v-if="info.preview">
              <span class="mg-r8 color-title">发送内容</span>
              <span :class="tpl('text-right')">
                <a-input
                  v-if="info.notify_type.value === 1"
                  :class="tpl('column-input')"
                  v-model="params.msg_preffix"
                  placeholder="请输入"
                ></a-input>
                <span>{{ info.content }}</span>
                <a-input
                  v-if="info.notify_type.value === 1"
                  :class="tpl('column-input')"
                  v-model="params.msg_suffix"
                  placeholder="请输入"
                ></a-input>
              </span>
            </div>
            <div class="mg-b16" v-if="info.preview">
              <span class="mg-r8 color-title">预览内容</span>
              <span :class="tpl('text-right')">{{ info.preview }}</span>
            </div>
            <div class="mg-b16" v-if="Object.keys(info.course_type).length > 0">
              <span class="color-title">课程类型</span>
              <span class="mg-l16 inlineblock">
                <st-checkbox
                  v-if="params.course_type.team_course"
                  v-model="params.course_type.team_course.value"
                >
                  {{ params.course_type.team_course.name }}
                </st-checkbox>
                <st-checkbox
                  v-if="params.course_type.personal_course"
                  v-model="params.course_type.personal_course.value"
                >
                  {{ params.course_type.personal_course.name }}
                </st-checkbox>
                <st-checkbox
                  v-if="params.course_type.small_course"
                  v-model="params.course_type.small_course.value"
                >
                  {{ params.course_type.small_course.name }}
                </st-checkbox>
              </span>
            </div>
            <div class="mg-b16" v-if="Object.keys(info.receiver).length > 0">
              <span class="color-title">接收人员</span>
              <span class=" mg-l16 inlineblock">
                <st-checkbox
                  v-if="params.receiver.seller"
                  v-model="params.receiver.seller.value"
                >
                  {{ params.receiver.seller.name }}
                </st-checkbox>
                <st-checkbox
                  v-if="params.receiver.coach"
                  v-model="params.receiver.coach.value"
                >
                  {{ params.receiver.coach.name }}
                </st-checkbox>
                <st-checkbox
                  v-if="params.receiver.member"
                  v-model="params.receiver.member.value"
                >
                  {{ params.receiver.member.name }}
                </st-checkbox>
                <st-checkbox
                  v-if="params.receiver.leader"
                  v-model="params.receiver.leader.value"
                >
                  {{ params.receiver.leader.name }}
                </st-checkbox>
                <st-checkbox
                  v-if="params.receiver.custom"
                  v-model="params.receiver.custom.value"
                >
                  {{ params.receiver.custom.name }}
                </st-checkbox>
              </span>
              <a-input
                style="width:44%"
                v-show="isShowPhone"
                v-model="params.custom_phone"
                placeholder="请输入手机号码，多个用逗号分隔"
              />
            </div>

            <div class="mg-b16" v-if="Object.keys(info.order_type).length > 0">
              <span class="color-title">订单类型</span>
              <span class="mg-l16 inlineblock">
                <st-checkbox
                  v-if="params.order_type.advance"
                  v-model="params.order_type.advance.value"
                >
                  {{ params.order_type.advance.name }}
                </st-checkbox>
                <st-checkbox
                  v-if="params.order_type.deposit"
                  v-model="params.order_type.deposit.value"
                >
                  {{ params.order_type.deposit.name }}
                </st-checkbox>
                <st-checkbox
                  v-if="params.order_type.product"
                  v-model="params.order_type.product.value"
                >
                  {{ params.order_type.product.name }}
                </st-checkbox>
                <st-checkbox
                  v-if="params.order_type.poundage"
                  v-model="params.order_type.poundage.value"
                >
                  {{ params.order_type.poundage.name }}
                </st-checkbox>
              </span>
            </div>
            <div>
              <span class="color-title mg-r8">发送规则</span>
              <span
                v-if="
                  info.notify_type.value === 1 &&
                    info.notify_sub_type.value === 4
                "
              >
                课程开始前
                <a-select v-model="params.notify_time" style="width:100px">
                  <a-select-option
                    v-for="(item, index) in notifyHour"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
                发送
              </span>

              <a-radio-group
                v-if="
                  info.notify_type.value === 1 &&
                    info.notify_sub_type.value === 6
                "
                v-model="params.notify_time"
                class="mg-b16"
              >
                <a-radio
                  v-for="(item, index) in notifyRule"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-radio>
              </a-radio-group>
              <span
                v-if="
                  info.notify_sub_type.value === 10 ||
                    info.notify_sub_type.value === 12
                "
              >
                {{
                  info.notify_sub_type.value === 10
                    ? '客保到期前'
                    : '会员流失前'
                }}
                <a-input
                  v-model="params.notify_time"
                  style="width:80px"
                  type="number"
                />
                天提醒，每日早7点推送
              </span>
              <span v-if="info.notify_sub_type.value === 14">
                会员课程剩余
                <a-input
                  v-model="params.notify_number"
                  style="width:80px"
                  type="number"
                />
                次时，或会员课程有效期剩余
                <a-input
                  v-model="params.notify_time"
                  style="width:80px"
                  type="number"
                />
                天时提醒，每日早7点推送
              </span>
              <span
                v-if="
                  info.notify_sub_type.value !== 6 &&
                    info.notify_sub_type.value !== 4
                "
              >
                {{ info.notify_time.name }}
              </span>
            </div>
          </div>
          <div :class="tpl('text')" style="padding-left:0">
            <span class="btn color-primary mg-r12" @click="cancel">取消</span>
            <span class="btn color-primary" @click="save">保存</span>
          </div>
        </div>
        <div class="shadow-bottom"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { UserService } from '@/services/user.service'
import BrandSettingSmsNotice from '@/views/biz-modals/brand/setting/sms/notice'
const componentName = 'components-notice-tpl-item'
export default {
  name: 'NoticeItem',
  bem: {
    tpl: componentName
  },
  serviceInject() {
    return {
      userService: UserService
    }
  },
  rxState() {
    return {
      notifyRule: this.userService.getOptions$('setting.notify_rule'),
      notifyHour: this.userService.getOptions$('setting.notify_time_hour')
    }
  },
  modals: {
    BrandSettingSmsNotice
  },
  data() {
    return {
      isShowContent: 0,
      isShowPre: 0,
      isShowEdit: 0,
      isShowPhone: false, // 默认不展示输入手机号
      rule: {},
      typeMap: {
        mini_programs: 1,
        app: 2
      },
      params: {
        id: '',
        msg_suffix: '',
        msg_preffix: '',
        custom_phone: '',
        course_type: {
          team_course: {
            value: 0,
            name: '团课'
          },
          personal_course: {
            value: 0,
            name: '私教课'
          },
          small_course: {
            value: 0,
            name: this.$c('small_course')
          }
        },
        order_type: {
          advance: {
            value: 0,
            name: '定金'
          },
          deposit: {
            value: 0,
            name: '押金'
          },
          product: {
            value: 0,
            name: '商品'
          },
          poundage: {
            value: 0,
            name: '手续费'
          }
        },
        receiver: {
          coach: {
            value: 0,
            name: this.$c('coach')
          },
          member: {
            value: 0,
            name: '会员'
          },
          seller: {
            value: 0,
            name: '销售'
          },
          custom: {
            value: 0,
            name: '自定义'
          },
          leader: {
            value: 0,
            name: '负责人'
          }
        },
        notify_time: '',
        notify_number: '',
        notify_mode: {
          sms: 0,
          app: 0,
          mini_programs: 0
        }
      }
    }
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    auth: {
      type: Object,
      default: () => {
        return {
          sms: true,
          app: true,
          mina: true,
          edit: true
        }
      }
    }
  },
  created() {
    if (Object.keys(this.info.order_type).length > 0) {
      this.params.order_type = this.info.order_type
    }
    if (Object.keys(this.info.course_type).length > 0) {
      this.params.course_type = this.info.course_type
    }
    if (Object.keys(this.info.receiver).length > 0) {
      this.params.receiver = this.info.receiver
    }
    this.params.notify_time = this.info.notify_time.value
    this.params.notify_number = this.info.notify_number
    this.params.msg_preffix = this.info.msg_preffix
    this.params.msg_suffix = this.info.msg_suffix
    this.params.custom_phone = this.info.custom_phone.join(' ')
    this.params.notify_mode = {
      sms: this.info.notify_mode.sms && this.info.notify_mode.sms.value,
      app: this.info.notify_mode.app && this.info.notify_mode.app.value,
      mini_programs:
        this.info.notify_mode.mini_programs &&
        this.info.notify_mode.mini_programs.value
    }
  },
  methods: {
    showEdit() {
      this.isShowEdit = 1
    },
    cancel() {
      this.isShowEdit = 0
    },
    save() {
      let course_type = {}
      let order_type = {}
      let receiver = {}
      if (this.info.course_type.team_course) {
        course_type.team_course = 0
      }
      if (this.info.course_type.personal_course) {
        course_type.personal_course = 0
      }
      if (this.info.course_type.small_course) {
        course_type.small_course = 0
      }
      if (this.info.order_type.advance) {
        order_type.advance = 0
      }
      if (this.info.order_type.deposit) {
        order_type.deposit = 0
      }
      if (this.info.order_type.product) {
        order_type.product = 0
      }
      if (this.info.order_type.poundage) {
        order_type.poundage = 0
      }

      if (this.info.receiver.coach) {
        receiver.coach = 0
      }
      if (this.info.receiver.member) {
        receiver.member = 0
      }
      if (this.info.receiver.custom) {
        receiver.custom = 0
      }
      if (this.info.receiver.seller) {
        receiver.seller = 0
      }
      if (this.info.receiver.leader) {
        receiver.leader = 0
      }
      if (this.info.course_type.team_course) {
        course_type.team_course = this.params.course_type.team_course.value
          ? 1
          : 0
      }
      if (this.info.course_type.personal_course) {
        course_type.personal_course = this.params.course_type.personal_course
          .value
          ? 1
          : 0
      }
      if (this.info.course_type.small_course) {
        course_type.small_course = this.params.course_type.small_course.value
          ? 1
          : 0
      }
      if (this.info.order_type.advance) {
        order_type.advance = this.params.order_type.advance.value ? 1 : 0
      }
      if (this.info.order_type.deposit) {
        order_type.deposit = this.params.order_type.deposit.value ? 1 : 0
      }
      if (this.info.order_type.product) {
        order_type.product = this.params.order_type.product.value ? 1 : 0
      }
      if (this.info.order_type.poundage) {
        order_type.poundage = this.params.order_type.poundage.value ? 1 : 0
      }

      if (this.info.receiver.coach) {
        receiver.coach = this.params.receiver.coach.value ? 1 : 0
      }
      if (this.info.receiver.member) {
        receiver.member = this.params.receiver.member.value ? 1 : 0
      }
      if (this.info.receiver.custom) {
        receiver.custom = this.params.receiver.custom.value ? 1 : 0
      }
      if (this.info.receiver.seller) {
        receiver.seller = this.params.receiver.seller.value ? 1 : 0
      }
      if (this.info.receiver.leader) {
        receiver.leader = this.params.receiver.leader.value ? 1 : 0
      }
      console.log(111)
      console.log(this.params.receiver)
      const para = Object.assign({}, this.params, {
        id: this.info.id,
        custom_phone:
          this.params.custom_phone.length > 0
            ? this.params.custom_phone.split(',')
            : [],
        order_type,
        receiver,
        course_type
      })
      this.$emit('editInfo', para)
      this.isShowEdit = 0
    }
  },
  watch: {
    'params.receiver.custom.value'(oldVal, newVal) {
      if (oldVal) {
        this.isShowPhone = true
      } else {
        this.isShowPhone = false
      }
    }
  }
}
</script>
