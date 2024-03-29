<template>
  <st-panel app v-if="auth.get">
    <div :class="b()">
      <st-t2>用户等级设置</st-t2>
      <a-row :gutter="12" class="mg-t24 ta-c">
        <!-- 潜在会员 -->
        <a-col :span="7">
          <div :class="b('item')">
            <st-t2>{{ potential.level_name }}</st-t2>
            <div>
              <img
                :class="b('item-icon')"
                src="~@/assets/img/member_potential.png"
                alt="潜在会员"
              />
            </div>
            <div :class="b('sub-title')">条件</div>
            <ul>
              <li v-if="potential.condition.length" :class="b('list-item')">
                <i
                  class="icon-member-checked icon-member-checked--potential"
                ></i>
                <span v-for="(item, index) in potential.condition" :key="index">
                  {{
                    item.condition_name | textFilter(potential.condition, index)
                  }}
                </span>
              </li>
            </ul>
          </div>
        </a-col>
        <!-- 正式会员 -->
        <a-col :span="10">
          <div :class="b('item')">
            <st-t2>{{ member.level_name }}</st-t2>
            <st-info-action
              icon="edit"
              text="编辑"
              :class="b('item-edit')"
              v-if="auth.edit && !isEdit"
              @click="onEdit"
            />
            <div>
              <img
                :class="b('item-icon')"
                src="~@/assets/img/member.png"
                alt="正式会员"
              />
            </div>
            <div :class="b('sub-title')">
              条件
              <st-help-tooltip id="TBYHDJ001" />
            </div>
            <select-condition
              v-if="isEdit && info.condition"
              v-model="info.condition"
              @change="onConditionChange"
            />
            <ul v-else>
              <li v-if="member.condition.length" :class="b('list-item')">
                <i
                  class="icon-member-checked icon-member-checked--potential"
                ></i>
                <span v-for="(item, index) in member.condition" :key="index">
                  {{
                    item.condition_name | textFilter(member.condition, index)
                  }}
                </span>
              </li>
            </ul>
            <div :class="b('sub-title')">
              特权类目
              <st-help-tooltip id="TBYHDJ002" />
            </div>
            <select-rights
              v-if="isEdit && info.rights"
              v-model="info.rights"
              @change="onRightsChange"
            />
            <ul v-else>
              <li :class="b('list-item')" v-if="member.rights.length">
                <i class="icon-member-checked"></i>
                <span v-for="(item, index) in member.rights" :key="index">
                  {{ item.rights_name | textFilter(member.rights, index) }}
                </span>
              </li>
              <li v-else class="st-des mg-t8">暂无特权类目～</li>
            </ul>
          </div>
        </a-col>
        <!-- 流失会员 -->
        <a-col :span="7">
          <div :class="b('item')">
            <st-t2>{{ lost.level_name }}</st-t2>
            <div>
              <img
                :class="b('item-icon')"
                src="~@/assets/img/member_lost.png"
                alt="流失会员"
              />
            </div>
            <div :class="b('sub-title')">条件</div>
            <ul>
              <li v-if="lost.condition.length" :class="b('list-item')">
                <i
                  class="icon-member-checked icon-member-checked--potential"
                ></i>
                <span v-for="(item, index) in lost.condition" :key="index">
                  {{ item.condition_name | textFilter(lost.condition, index) }}
                </span>
              </li>
            </ul>
          </div>
        </a-col>
      </a-row>
      <div class="ta-c mg-t24" v-if="isEdit">
        <st-button type="primary" @click="onSave" :loading="loading.update">
          保存
        </st-button>
        <st-button class="mg-l8" @click="onCancel">取消</st-button>
      </div>
    </div>
  </st-panel>
</template>
<script>
import { UserLevelService } from './user-level.service'
import { MessageService } from '@/services/message.service'
import SelectCondition from './components#/select-condition'
import SelectRights from './components#/select-rights'
export default {
  bem: {
    b: 'page-user-level'
  },
  serviceInject() {
    return {
      userLevelService: UserLevelService,
      messageService: MessageService
    }
  },
  rxState() {
    const { userLevelService } = this
    return {
      list: userLevelService.list$,
      info: userLevelService.info$,
      loading: userLevelService.loading$,
      auth: userLevelService.auth$
    }
  },
  data() {
    return {
      condition: [],
      rights: []
    }
  },
  filters: {
    textFilter(text, list, index) {
      return text + (index < list.length - 1 ? '、' : '')
    }
  },
  components: {
    SelectCondition,
    SelectRights
  },
  computed: {
    isEdit() {
      return this.$searchQuery.type === 'edit'
    },
    /**
     * 潜在会员
     */
    potential() {
      return this.list[0]
    },
    /**
     * 正式会员
     */
    member() {
      return this.list[1]
    },
    /**
     * 流失会员
     */
    lost() {
      return this.list[2]
    }
  },
  methods: {
    onEdit() {
      this.$router.push({
        query: {
          type: 'edit'
        }
      })
    },
    onSave() {
      const params = this.getData()
      if (!this.inputCheck(params)) {
        this.messageService.error({
          content: '请至少选择一个升级到正式会员所需条件'
        })
        return
      }
      this.userLevelService.update(params).subscribe(() => {
        this.messageService.success({
          content: '保存成功'
        })
        this.$router.push({
          query: {}
        })
      })
    },
    onCancel() {
      this.$router.push({
        query: {}
      })
    },
    onConditionChange(val) {
      this.condition = val
    },
    onRightsChange(val) {
      this.rights = val
    },
    getData() {
      return {
        condition: this.condition,
        rights: this.rights
      }
    },
    inputCheck(params) {
      const { condition } = params
      if (!condition.length) {
        return false
      }
      return true
    }
  }
}
</script>
