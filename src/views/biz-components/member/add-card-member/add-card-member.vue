<template>
  <st-container>
    <st-form-table :class="b()">
      <colgroup>
        <col style="width:40%;" />
        <col style="width:40%;" />
        <col style="width:20%;" />
      </colgroup>
      <thead>
        <tr>
          <th>成员姓名</th>
          <th>手机号</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="3" :class="b('search-wrapper')">
            <a-popover
              trigger="click"
              v-model="visible"
              placement="bottom"
              :arrowPointAtCenter="true"
              overlayClassName="change-member-popover"
            >
              <div
                slot="content"
                :class="b('search-section')"
                id="search-section"
                ref="searchSection"
              >
                <a-input-search
                  placeholder="请输入手机号码或者会员姓名"
                  v-model="memberSearchText"
                  @change="onMemberSearch"
                  :style="{
                    width: searchWidth
                  }"
                  class="test-input"
                />
                <ul :class="b('search-list')">
                  <li
                    :class="b('search-text')"
                    v-for="(item, index) in memberList"
                    :value="item.id"
                    :key="index"
                    @click.stop="onMemberChange(item)"
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
                  </li>
                  <li
                    v-if="type !== 2"
                    :class="[b('search-text'), b('search-tip')]"
                  >
                    查无此会员，
                    <a @click="onAddMember">新增新会员？</a>
                  </li>
                </ul>
              </div>
              <st-button
                :disabled="list.length >= max"
                type="dashed"
                icon="add"
                block
                ref="addMemberCardButton"
              >
                {{ addText }}
              </st-button>
            </a-popover>
          </td>
        </tr>
        <tr v-for="(item, index) in list" :key="index">
          <td>
            <template v-if="item.isEdit">
              <a-input placeholder="输入姓名" v-model="item.name">
                <a-select
                  slot="addonAfter"
                  default-value="1"
                  style="width: 100px"
                  v-if="productType === 'package'"
                  @change="onChangeMinors($event, item)"
                  v-model="item.is_minors"
                  :options="minorsTypeOptions$"
                ></a-select>
              </a-input>
            </template>
            <template v-else>
              {{ item.name }}
              <st-icon
                v-if="item.is_minors"
                type="user-type"
                color="#3F66F6"
              ></st-icon>
            </template>
          </td>
          <td>
            <template v-if="item.isEdit">
              <a-input placeholder="输入手机号" v-model="item.mobile">
                <a-select
                  slot="addonAfter"
                  :default-value="1"
                  v-model="item.parent_user_role"
                  style="width: 80px"
                  v-if="productType === 'package' && item.is_minors"
                  :options="parentTypeOptions$"
                ></a-select>
              </a-input>
            </template>
            <template v-else-if="item.is_minors">
              {{ item.parent_mobile }}({{
                parentUserRoleStr(item.parent_user_role)
              }})
            </template>
            <template v-else>
              {{ item.mobile }}
            </template>
          </td>
          <td>
            <a
              v-if="item.isEdit"
              class="mg-r8"
              @click="onConfirmItem(item, index)"
            >
              确认
            </a>
            <a v-if="item.isEdit" @click="onCancelItem(item, index)">取消</a>
            <a v-if="!item.isEdit" @click="onDeleteItem(item, index)">删除</a>
          </td>
        </tr>
        <tr v-if="list.length <= 0">
          <td colspan="3">
            <st-no-data />
          </td>
        </tr>
      </tbody>
    </st-form-table>
  </st-container>
</template>
<script>
import { cloneDeep } from 'lodash-es'
import { AddCardMemberService } from './add-card-member.service'
import { MessageService } from '@/services/message.service'
import { PatternService } from '@/services/pattern.service'
export default {
  name: 'AddCardMember',
  bem: {
    b: 'page-add-card-member'
  },
  serviceProviders() {
    return [AddCardMemberService]
  },
  serviceInject() {
    return {
      addCardMemberService: AddCardMemberService,
      messageService: MessageService,
      patternService: PatternService
    }
  },
  rxState() {
    let { parentTypeOptions$, minorsTypeOptions$ } = this.addCardMemberService
    return {
      memberList: this.addCardMemberService.memberList$,
      parentTypeOptions$,
      minorsTypeOptions$
    }
  },
  model: {
    prop: 'list',
    event: 'change'
  },
  props: {
    addText: {
      type: String,
      default: '新增卡成员'
    },
    type: {
      type: Number,
      default: 1
    },
    productType: {
      type: String
    },
    max: {
      type: Number,
      default: 10
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      memberSearchText: '',
      searchMemberIsShow: true,
      memberId: '',
      searchFlag: false,
      searchWidth: ''
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.searchWidth =
        this.$refs.addMemberCardButton.$el.offsetWidth - 32 + 'px'
    })
  },
  methods: {
    parentUserRoleStr(value) {
      let label = value
      if (typeof value === 'number') {
        this.parentTypeOptions$.forEach(element => {
          if (element.value === value) {
            label = element.label
          }
        })
      }
      return label
    },
    selectItemLabel(item) {
      if (item.is_minors === 1) {
        return `${item.member_name}(未成年) ${item.parent_mobile}(${item.parent_user_role})`
      }
      return `${item.member_name} ${item.mobile}`
    },
    onConfirmItem(data, index) {
      if (!data.name) {
        this.messageService.error({
          content: '请填写正确成员姓名'
        })
        return
      }
      if (!data.mobile || !this.patternService.MOBILE.test(data.mobile)) {
        this.messageService.error({
          content: '请填写正确手机号'
        })
        return
      }

      const isExist = this.list.filter(
        item => item.mobile === data.mobile && !item.isEdit
      )
      if (data.is_minors) {
        data.parent_mobile = data.mobile
      }
      // 未成年人不校验手机重复 20200720
      if (!data.is_minors && isExist && isExist.length > 0) {
        this.messageService.error({
          content: '该手机号已经存在'
        })
        return
      }
      data.isEdit = false
      this.$emit('change', this.list)
    },
    onCancelItem(item, index) {
      this.list.shift()
      this.$emit('change', this.list)
    },
    onDeleteItem(item, index) {
      this.list.splice(index, 1)
      this.$emit('change', this.list)
    },
    onChangeMinors($event, item) {
      console.log($event, item)
      // 未成年需要关系字段
      if ($event === 1) {
        item.parent_mobile = item.mobile
        this.$set(item, 'parent_user_role', 1)
      }
    },
    onAddMember() {
      this.memberSearchText = ''
      const isExistEdit = this.list.filter(item => item.isEdit)
      if (isExistEdit && isExistEdit.length > 0) {
        this.messageService.error({
          content: '还有没有新增完成的成员'
        })
        return
      }
      this.visible = false
      this.list.unshift({
        name: '',
        mobile: '',
        is_minors: 0,
        isEdit: true
      })
    },
    onMemberSearch(data) {
      this.memberSearchText = data.target.value
      if (data) {
        this.addCardMemberService.memberListAction$.dispatch(
          data.target.value,
          this.type
        )
      }
    },
    onMemberChange(data) {
      if (this.list.length >= this.max) return
      const isExist = this.list.filter(
        item => item.mobile === data.mobile && !item.isEdit
      )
      if (isExist && isExist.length > 0) {
        this.messageService.error({
          content: '该手机号已经存在'
        })
        return
      }
      const isExistEdit = this.list.filter(item => item.isEdit)
      let insertIndex = 0
      if (isExistEdit && isExistEdit.length > 0) {
        insertIndex = 1
      }
      this.list.splice(insertIndex, 0, {
        id: data.id,
        name: data.member_name,
        mobile: data.mobile,
        is_minors: data.is_minors,
        parent_mobile: data.parent_mobile,
        parent_name: data.parent_name,
        parent_user_role: data.parent_user_role
      })
      this.visible = false
      this.resetSearchCondition()
      this.$emit('change', this.list)
    },
    resetSearchCondition() {
      this.memberSearchText = ''
      this.memberList = []
    }
  }
}
</script>
