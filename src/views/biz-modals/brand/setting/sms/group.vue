<template>
  <st-modal
    :class="bModal()"
    title="群发短信"
    v-model="show"
    @ok="save"
    width="502px"
    @cancel="cancel"
  >
    <st-form :form="form">
      <st-form-item labelWidth="70px" label="接受对象" :class="bModal('form')">
        <a-radio-group
          v-decorator="decorators.user_type"
          @change="getCurPrizUserType"
        >
          <a-radio
            v-for="(item, index) in userType"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
        <st-textarea
          class="mg-t8"
          v-if="curUser === USER_TYPES.USER"
          v-model="tel"
          :max-rows="1000"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="输入手机号,每行一个"
        ></st-textarea>

        <a-radio-group
          :class="bModal('scroll')"
          v-decorator="decorators.send_value"
          v-show="curUser === USER_TYPES.CROWD"
        >
          <a-radio-button
            :class="bModal('scroll-btn')"
            class="mg-r8"
            v-for="(item, index) in crowdList"
            :key="index"
            :value="item.crowd_id"
          >
            {{ item.crowd_name }}
          </a-radio-button>
        </a-radio-group>
        <span :class="bModal('scroll-add')" v-if="curUser === USER_TYPES.CROWD">
          <span :class="bModal('scroll-not')">不满足？</span>
          <a @click="goCrowd" class="cursor-pointer">去新增人群</a>
        </span>
      </st-form-item>
      <st-form-item labelWidth="70px" label="发送时间">
        <a-radio-group
          v-decorator="decorators.send_type"
          @change="getCurTimeType"
        >
          <a-radio
            v-for="(item, index) in sendType"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
        <a-date-picker
          v-show="curTime === SEND_TYPES.ONTIME"
          :disabledDate="disabledStartDate"
          placeholder="请选择时间"
          style="width:144px"
          format="YYYY-MM-DD HH:mm"
          showTime
          v-decorator="decorators.send_time"
        ></a-date-picker>
      </st-form-item>
      <st-form-item labelWidth="70px" label="编辑短信" class="mg-b0">
        <a-radio-group
          v-decorator="decorators.tmpl_type"
          @change="getCurTemType"
        >
          <a-radio
            v-for="(item, index) in tmplType"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
        <template v-if="curTem === TMPL_TYPES.PERSONAL">
          <st-textarea
            class="mg-t8"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-decorator="decorators.content"
            :maxlength="278 - sign.length"
            :suffix="sign"
            placeholder="输入短信内容，短信签名默认尾部展示"
            @change="calcSmsNum"
          ></st-textarea>
          <div class="st-des mg-b8">
            短信超过70个字按每67个字计费1条，当前将产生{{ smsNumber }}条短信
          </div>
        </template>
        <div :class="bModal('save')" v-if="curTem === TMPL_TYPES.PERSONAL">
          <a-checkbox
            v-decorator="decorators.is_save"
            :class="bModal('save-btn')"
            @change="isSave"
          >
            存为模板
          </a-checkbox>
          <a-input
            :disabled="!isSaveChecked"
            v-decorator="decorators.title"
            placeholder="请输入模版标题"
          ></a-input>
        </div>
        <a-select
          style="width:120px"
          class="mg-b8"
          v-show="curTem === TMPL_TYPES.CUSTOM"
          placeholder="请选择模版"
          @change="getCurTemContent"
          v-decorator="decorators.tmpl_id"
        >
          <a-select-option
            :value="item.tmpl_id"
            v-for="item in templateList"
            :key="item.tmpl_id"
          >
            {{ item.title }}
          </a-select-option>
        </a-select>
        <template v-if="curTem === TMPL_TYPES.CUSTOM">
          <st-textarea
            :maxlength="278 - sign.length"
            :autosize="{ minRows: 2, maxRows: 4 }"
            :suffix="sign"
            plcaeholder="输入短信内容，短信签名默认尾部展示"
            v-model="temContent"
          ></st-textarea>
          <span class="st-des">
            短信超过70个字按每67个字计费1条，当前将产生{{ tempSmsNum }}条短信
          </span>
        </template>
      </st-form-item>
    </st-form>
  </st-modal>
</template>
<script>
import { ruleOptions } from './group.config'
import { GroupService } from './group.service'
import { USER_TYPES, SEND_TYPES, TMPL_TYPES } from '@/constants/setting/sms'
import { MessageService } from '@/services/message.service'
import { PatternService } from '@/services/pattern.service'

export default {
  name: 'SettingSmsGroup',
  bem: {
    bModal: 'setting-sms-group'
  },
  serviceInject() {
    return {
      groupService: GroupService,
      messageService: MessageService,
      pattern: PatternService
    }
  },
  rxState() {
    return {
      loading: this.groupService.loading$,
      templateList: this.groupService.templateList$,
      userType: this.groupService.userType$,
      tmplType: this.groupService.tmplType$,
      sendType: this.groupService.sendType$,
      crowdList: this.groupService.crowdList$,
      sign: this.groupService.sign$
    }
  },
  props: {
    id: {
      type: Number
    },
    tmpl: {
      type: Object
    },
    crowd: {
      type: Object
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      USER_TYPES,
      SEND_TYPES,
      TMPL_TYPES,
      show: false,
      curUser: USER_TYPES.USER,
      curTem: TMPL_TYPES.PERSONAL,
      curTime: SEND_TYPES.NOW,
      temContent: '',
      tel: '',
      info: {},
      time: '',
      isSaveChecked: false,
      singleSmsLength: 67, // 短信限制，如果大于70个字按照67字截取一条短信，否则就是一条短信
      smsNumber: 1
    }
  },
  created() {
    this.getCrowdList()
    this.getTemplateOptionList()
    this.getSmsSign()
  },
  computed: {
    tempSmsNum() {
      let signLength = this.sign.length + 2 // 签名加上"【】"的长度
      if (this.temContent.length + signLength > 70) {
        return Math.ceil(
          (this.temContent.length + signLength) / this.singleSmsLength
        )
      } else {
        return 1
      }
    }
  },
  mounted() {
    // 编辑
    if (this.id) {
      this.getEditInfo(this.id)
    }
    // 从短信模版跳出来
    if (this.tmpl) {
      this.form.setFieldsValue({
        tmpl_type: 2,
        tmpl_id: this.tmpl.tmpl_id
      })
      this.curTem = 2
      this.temContent = this.tmpl.content
      this.calcSmsNum(this.temContent)
    }
    if (this.crowd) {
      this.form.setFieldsValue({
        user_type: 2,
        send_value: this.crowd.send_value
      })
      this.curUser = 2
    }
  },
  methods: {
    cancel() {},
    // 获取人群列表
    getCrowdList() {
      return this.groupService.getCrowdList().subscribe()
    },
    getSmsSign() {
      return this.groupService.getSmsSign().subscribe()
    },
    getTemplateOptionList() {
      return this.groupService.getTemplateOptionList().subscribe()
    },
    getCurPrizUserType(e) {
      this.curUser = e.target.value
    },
    getCurTemType(e) {
      this.curTem = e.target.value
    },
    getCurTimeType(e) {
      this.curTime = e.target.value
    },
    calcSmsNum(value) {
      let signLength = this.sign.length + 2 // 签名加上"【】"的长度
      this.smsNumber =
        value.length + signLength > 70
          ? Math.ceil((value.length + signLength) / this.singleSmsLength)
          : 1
    },
    getCurTemContent(e) {
      this.templateList.map(item => {
        if (item.tmpl_id === e) {
          this.temContent = item.content
        }
      })
    },
    isSave(e) {
      this.isSaveChecked = !e.target.value
    },
    getEditInfo(id) {
      return this.groupService.getEditInfo(id).subscribe(res => {
        this.form.setFieldsValue({
          user_type: res.info.user_type,
          send_value: res.info.send_value,
          send_type: res.info.send_type,
          send_time: moment(res.info.send_time),
          title: res.info.title,
          content: res.info.content,
          tmpl_id: res.info.tmpl_id,
          is_save: 0,
          tmpl_type: res.info.tmpl_type
        })
        this.curUser = res.info.user_type
        this.curTime = res.info.send_type
        this.curTem = res.info.tmpl_type
        this.temContent = res.info.content
        if (res.info.user_type === this.USER_TYPES.USER) {
          this.tel = res.info.send_value
        }
        if (res.info.tmpl_type === this.TMPL_TYPES.CUSTOM) {
          this.getCurTemContent(res.info.tmpl_id)
        }
      })
    },
    // 跳转到新增人群
    goCrowd() {
      this.$router.push('/brand/marketing/plugin/crowd/index')
      this.show = false
    },
    // 日期禁用
    disabledStartDate(current) {
      return (
        current &&
        current.format('YYYY-MM-DD') <
          moment()
            .add(0, 'days')
            .format('YYYY-MM-DD')
      )
    },
    save() {
      this.form.validate((error, values) => {
        if (values.send_time) {
          values.send_time = values.send_time.format('YYYY-MM-DD HH:mm')
        }
        if (this.curUser === this.USER_TYPES.USER) {
          if (!this.tel) {
            this.messageService.warn({
              content: '请输入手机号'
            })
            return
          } else {
            let telArr = this.tel.split(/[\n]/)
            for (let i = 0; i < telArr.length; i++) {
              if (!this.pattern.MOBILE.test(telArr[i].trim())) {
                this.messageService.warn({
                  content: '请输入正确格式手机号'
                })
                return
              }
            }
          }
          values.send_value = this.tel
        }
        if (this.curUser === this.USER_TYPES.CROWD) {
          if (!values.send_value) {
            this.messageService.warn({
              content: '请选择人群'
            })
            return
          }
        }
        if (this.curTem === this.TMPL_TYPES.PERSONAL) {
          if (this.isSaveChecked && !values.title) {
            this.messageService.warn({
              content: '请输入模板标题'
            })
            return
          }
          if (!values.content) {
            this.messageService.warn({
              content: '请输入模板内容'
            })
            return
          }
        } else {
          if (!this.temContent) {
            this.messageService.warn({
              content: '请填写模板内容'
            })
            return
          }
          values.content = this.temContent
        }

        if (this.id) {
          values.group_id = this.id
          return this.groupService.editGroup({ ...values }).subscribe(res => {
            this.messageService.success({
              content: '编辑成功'
            })
            this.$emit('success')
            this.show = false
          })
        } else {
          return this.groupService.addGroup({ ...values }).subscribe(res => {
            this.messageService.success({
              content: '新增成功'
            })
            this.$emit('success')
            this.show = false
          })
        }
      })
    }
  }
}
</script>
