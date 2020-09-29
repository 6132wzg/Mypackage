<template>
  <div>
    <div class="search-member__select" v-if="searchMemberIsShow">
      <st-form-item
        class="search-member__select-item"
        :label="label"
        required
        v-bind="$attrs"
      >
        <a-select
          style="width:calc(100% - 85px)"
          showSearch
          allowClear
          v-decorator="decorators[memberId]"
          :placeholder="placeholder"
          :defaultActiveFirstOption="false"
          :filterOption="false"
          :showArrow="false"
          suffixIcon="add"
          @search="onMemberSearch"
          @select="onSelectMember"
          @change="onChangeMember"
        >
          <div slot="notFoundContent">
            <a-spin size="small" v-if="loading$.getTransactionMember"></a-spin>
            <div v-else-if="!memberSearchText">无搜索结果</div>
            <div v-else>
              查无此会员，
              <a @click="onAddMember">新增新会员？</a>
            </div>
          </div>
          <a-select-option
            v-for="item in memberList$"
            :value="item.id"
            :key="item.id"
          >
            <span
              v-html="
                `${selectItemLabel(item)}`.replace(
                  new RegExp(memberSearchText, 'g'),
                  `\<span class='global-highlight-color'\>${memberSearchText}\<\/span\>`
                )
              "
            >
              {{ selectItemLabel(item) }}
            </span>
          </a-select-option>
          <span slot="suffixIcon">未成年</span>
        </a-select>
        <a class="search-member__select-href" @click="onAddMember">新增会员</a>
      </st-form-item>
    </div>

    <template v-if="selectInfo && selectInfo.is_minors === 1">
      <st-form-item label="家长手机号" required v-bind="$attrs">
        <label>{{ selectInfo.parent_mobile }}</label>
      </st-form-item>
      <st-form-item label="家长姓名" required v-bind="$attrs">
        <label>
          {{ selectInfo.parent_name }}({{ selectInfo.parent_user_role }})
        </label>
      </st-form-item>
    </template>

    <template v-if="!searchMemberIsShow">
      <st-form-item label="姓名" required v-bind="$attrs">
        <a-input
          v-decorator="decorators[memberName]"
          placeholder="请输入会员姓名"
          :maxLength="30"
        >
          <a-select
            slot="addonAfter"
            style="width: 100px"
            v-decorator="decorators[isMinors]"
            @change="onChangeModel"
          >
            <a-select-option :value="0">成年人</a-select-option>
            <a-select-option :value="1">未成年人</a-select-option>
          </a-select>
        </a-input>
      </st-form-item>
      <st-form-item
        label="手机号"
        required
        v-if="personModel === 0"
        v-bind="$attrs"
      >
        <input-phone
          size="default"
          v-decorator="decorators[memberMobile]"
          placeholder="请输入手机号"
        ></input-phone>
        <p class="mg-b0">
          <a @click="onCancelMember">取消新增</a>
        </p>
      </st-form-item>
      <st-form-item
        label="家长手机号"
        required
        v-if="personModel === 1"
        v-bind="$attrs"
      >
        <input-phone
          size="default"
          v-decorator="decorators[parentMobile]"
          placeholder="请输入手机号"
          @change="onChangeParentMobile"
        ></input-phone>
      </st-form-item>
      <st-form-item
        label="家长姓名"
        required
        v-if="personModel === 1"
        v-bind="$attrs"
      >
        <a-input
          v-decorator="decorators[parentName]"
          placeholder="请输入家长姓名"
          :disabled="disabledParentMobile"
          :maxLength="30"
        >
          <a-select
            slot="addonAfter"
            style="width: 80px"
            v-decorator="decorators[parentUserRole]"
          >
            <a-select-option
              :value="item.value"
              v-for="(item, index) in parent_types"
              :key="index"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-input>
        <p class="mg-b0">
          <a @click="onCancelMember">取消新增</a>
        </p>
      </st-form-item>
    </template>
    <template v-if="isSoldDeal">
      <st-form-item label="证件" v-bind="$attrs" :help="idCardValidatorText">
        <a-input
          placeholder="请输入"
          v-decorator="decorators[idCard]"
          @change="idCardValidator"
        >
          <a-select
            v-decorator="decorators[idCardType]"
            placeholder="请选择"
            style="width:100px"
            slot="addonBefore"
          >
            <a-select-option
              v-for="(item, index) in id_types"
              :key="index"
              :value="+item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-input>
      </st-form-item>
      <st-form-item label="卡号" v-bind="$attrs" :help="cardNumValidatorText">
        <a-input
          placeholder="请输入卡号"
          v-decorator="decorators[cardNum]"
          @change="cardNumValidator"
        />
      </st-form-item>
      <st-form-item label="物理卡号" v-bind="$attrs" :help="pidValidatorText">
        <a-input
          placeholder="请输入物理卡号"
          v-decorator="decorators[physicalId]"
          @change="pidValidator"
        />
      </st-form-item>
    </template>
  </div>
</template>

<script>
import { MemberSearchService } from './member-search.service'
import { merge } from 'lodash-es'
import { ruleOptions } from './member-search.config'
import { PatternService } from '@/services/pattern.service'
import InputPhone from '@/views/biz-components/account/input-phone/input-phone'
export default {
  name: 'MemberSearch',
  model: {
    event: 'change'
  },
  props: {
    value: {
      type: String
    },
    id: {
      type: String
    },
    label: {
      type: String,
      default: '购买会员'
    },
    /**
     * 会员查询类型 transaction | transfer
     */
    type: {
      type: String,
      default: 'transaction'
      // required: true
    },
    placeholder: {
      type: String,
      default: '输入手机号或会员名搜索'
    },
    // 外部 form 表单 必传
    form: {
      type: Object,
      required: true
    },
    fields: {
      type: Object,
      default: () => ({})
    },
    // 回填会员填写信息
    memberInfo: {
      type: Object
      // default: () => {
      //   return {
      //     member_id: 110676207534127,
      //     member_name: '张飞123222',
      //     member_mobile: 19134752085
      //   }
      // }
    },
    saleRangeType: {
      type: Number,
      default: 1
    },
    isSoldDeal: {
      type: Boolean,
      default: false
    }
  },
  serviceInject() {
    return {
      memberSearchService: MemberSearchService,
      pattern: PatternService
    }
  },
  serviceProviders() {
    return [MemberSearchService]
  },
  rxState() {
    const { memberList$, loading$, id_types$ } = this.memberSearchService
    return {
      memberList$,
      loading$,
      parent_types: this.memberSearchService.parent_types$,
      id_types: this.memberSearchService.id_types$
    }
  },

  data() {
    return {
      memberSearchText: '',
      searchMemberIsShow: true,
      personModel: 0,
      selectInfo: {},
      disabledParentMobile: false,
      idCardValidatorText: '',
      cardNumValidatorText: '',
      pidValidatorText: ''
    }
  },
  computed: {
    ruleOptions,
    decorators() {
      return this.form.addDecorators(this.ruleOptions)
    },
    usedFields() {
      return merge(
        {
          member_id: 'member_id',
          mobile: 'mobile',
          member_name: 'member_name',
          parent_name: 'parent_name',
          is_minors: 'is_minors',
          parent_mobile: 'parent_mobile',
          parent_user_role: 'parent_user_role',
          id_card: 'id_card',
          id_card_type: 'id_card_type',
          card_num: 'card_num',
          physical_id: 'physical_id'
        },
        this.fields
      )
    },
    memberId() {
      return this.usedFields.member_id
    },
    memberMobile() {
      return this.usedFields.mobile
    },
    memberName() {
      return this.usedFields.member_name
    },
    parentName() {
      return this.usedFields.parent_name
    },
    isMinors() {
      return this.usedFields.is_minors
    },
    parentMobile() {
      return this.usedFields.parent_mobile
    },
    parentUserRole() {
      return this.usedFields.parent_user_role
    },
    idCard() {
      return this.usedFields.id_card
    },
    idCardType() {
      return this.usedFields.id_card_type
    },
    cardNum() {
      return this.usedFields.card_num
    },
    physicalId() {
      return this.usedFields.physical_id
    }
  },
  methods: {
    idCardValidator(e) {
      let value = e.target.value
      let pattern = this.pattern
      let id_card_type = this.form.getFieldValue('id_card_type')
      this.idCardValidatorText = ''
      if (id_card_type === 1 && value && !pattern.ID.test(value)) {
        this.idCardValidatorText = '请填写正确的身份证号'
      }
      if (id_card_type === 2 && value && !pattern.PASSPORT.test(value)) {
        this.idCardValidatorText = '请填写正确的护照号码'
      }
    },
    cardNumValidator(e) {
      let value = e.target.value
      if (!value || value.length > 20) {
        this.cardNumValidatorText = '请输入正确格式的卡号'
      } else {
        this.cardNumValidatorText = ''
      }
    },
    pidValidator(e) {
      let value = e.target.value
      if (!value || value.length > 10) {
        this.pidValidatorText = '请输入正确格式的物理ID'
      } else {
        this.pidValidatorText = ''
      }
    },
    onChangeParentMobile(val) {
      setTimeout(() => {
        this.form.validate(['parent_mobile']).then(values => {
          val.mobile = val.phone
          this.memberSearchService.getParentInfoByPhone(val).subscribe(res => {
            if (res.exists) {
              this.disabledParentMobile = true
              this.form.setFieldsValue({
                parent_name: res.info.member_name
              })
            } else {
              this.disabledParentMobile = false
              this.form.setFieldsValue({
                parent_name: ''
              })
            }
          })
        })
      })
    },
    selectItemLabel(item) {
      if (item.is_minors === 1) {
        return `${item.member_name}(未成年) ${item.parent_mobile}(${item.parent_user_role})`
      }
      return `${item.member_name} ${item.mobile}`
    },
    onSelectMember(val) {
      console.log('memberList', this.memberList$)
      this.selectInfo = val
        ? this.memberList$.filter(item => item.id === val)[0]
        : {}
      this.form.setFieldsValue({
        [this.memberId]: this.selectInfo.id || undefined,
        [this.physicalId]: this.selectInfo.physical_id || undefined,
        [this.idCard]: this.selectInfo.id_card || undefined,
        [this.cardNum]: this.selectInfo.card_num || undefined,
        [this.idCardType]: this.selectInfo.id_card_type || 1
      })
      console.log('this.selectInfo', this.selectInfo)
      // setTimeout(() => {

      // })
      this.$emit('select', val)
    },
    onChangeMember(val) {
      console.log('onChangeMember', val)
      if (!val) {
        this.onSelectMember(val)
      } else {
        // TODO: b254dd12 fix: 购买会员change事件 三个月前
        this.$emit('change', val)
      }
    },
    onChangeModel(val) {
      this.personModel = val
    },
    // 搜索会员
    onMemberSearch(data) {
      this.memberSearchText = data
      if (data === '') {
        this.memberSearchService.RESET_LIST()
        this.form.resetFields([this.memberId])
        this.$emit('change:list', [])
      } else {
        this.memberSearchService.getMember(data, this.saleRangeType)
        this.memberSearchService.getMemberAction$.subscribe(list => {
          if (!list.length) {
            this.form.resetFields([this.memberId])
            this.onChangeMember('')
          } else {
            console.log('memberInfo', this.memberInfo)
            if (this.memberInfo) {
              this.form.setFieldsValue({
                [this.memberId]: this.memberInfo.member_id
              })
              this.onChangeMember(this.memberInfo.member_id)
            }
          }
        })
      }
    },
    // 切换新增会员
    onAddMember() {
      this.selectInfo = {}
      this.searchMemberIsShow = false
    },
    onCancelMember() {
      this.searchMemberIsShow = true
      this.selectInfo = {}
      // 取消新增，重置为成年人模式
      this.personModel = 0
      this.form.resetFields([this.memberId, this.memberName, this.memberMobile])
    }
  },
  mounted() {
    this.memberSearchService.SET_TYPE(this.type)
    console.log('member-search')
    try {
      if (this.memberInfo) {
        console.log('memberInfo', this.memberInfo)
        this.onMemberSearch(this.memberInfo.member_name)
        if (this.isSoldDeal) {
          this.form.setFieldsValue({
            [this.physicalId]: this.memberInfo.physical_id,
            [this.idCard]: this.memberInfo.id_card,
            [this.cardNum]: this.memberInfo.card_num,
            [this.idCardType]: this.memberInfo.id_card_type
          })
        }
      } else {
        this.memberSearchService.getMemberAction$.subscribe(list => {
          console.log('list', list)
          if (!list.length) {
            this.form.resetFields([this.memberId])
          }
        })
      }
    } catch (error) {
      console.log('error', error)
    }
  },
  components: {
    InputPhone
  }
}
</script>
