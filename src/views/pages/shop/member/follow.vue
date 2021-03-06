<template>
  <st-panel app :class="bPage()">
    <div slot="title">
      <st-input-search
        placeholder="输入用户姓名、手机号"
        v-model="$searchQuery.keyword"
        @search="onKeywordsSearch('keyword', $event)"
      />
    </div>
    <div slot="prepend">
      <st-search-panel @search="onSearchNative" @reset="handleReset">
        <st-search-panel-item label="用户级别：">
          <st-search-radio
            v-model="$searchQuery.member_level"
            :options="memberLevel"
          />
        </st-search-panel-item>
        <st-search-panel-item label="跟进方式：">
          <st-search-radio
            v-model="$searchQuery.follow_way"
            :options="followWayList"
          />
        </st-search-panel-item>
        <st-search-panel-item label="跟进状态：">
          <st-search-radio
            v-model="$searchQuery.follow_status"
            :options="followStatusList"
          />
        </st-search-panel-item>
        <div slot="more">
          <st-search-panel-item label="跟进销售：">
            <a-select
              :class="bPage('item')"
              placeholder="请选择跟进销售"
              optionFilterProp="children"
              @change="onChangeSell"
              v-model="$searchQuery.follow_salesman_id"
            >
              <a-select-option
                :value="+staff.id"
                v-for="staff in staffList"
                :key="staff.id"
              >
                {{ staff.sale_name }}
              </a-select-option>
            </a-select>
          </st-search-panel-item>
          <st-search-panel-item :label="`跟进${$c('coach')}：`">
            <a-select
              showSearch
              :placeholder="`请选择跟进${$c('coach')}`"
              optionFilterProp="children"
              :class="bPage('item')"
              @change="onChangeCoach"
              v-model="$searchQuery.follow_coach_id"
            >
              <a-select-option
                :value="+coach.id"
                v-for="coach in coachList"
                :key="coach.id"
              >
                {{ coach.coach_name }}
              </a-select-option>
            </a-select>
          </st-search-panel-item>
          <st-search-panel-item label="录入人：">
            <a-select
              showSearch
              placeholder="请选择录入人"
              optionFilterProp="children"
              :class="bPage('item')"
              @change="onChangeOperator"
              v-model="$searchQuery.operator_id"
            >
              <a-select-option
                :value="+operator.id"
                v-for="operator in operatorList"
                :key="operator.id"
              >
                {{ operator.name }}
              </a-select-option>
            </a-select>
          </st-search-panel-item>
          <st-search-panel-item label="跟进日期：">
            <st-range-picker :disabledDays="180" v-model="date" />
          </st-search-panel-item>
          <st-search-panel-item label="跟进次数：">
            <st-input-number
              v-model="$searchQuery.follow_start_num"
              :class="bPage('number')"
              :float="false"
              :min="0"
              :max="9999"
              placeholder="0"
            />
            &nbsp;~&nbsp;
            <st-input-number
              v-model="$searchQuery.follow_end_num"
              :class="bPage('number')"
              :float="false"
              :min="0"
              :max="9999"
              placeholder="9999"
            />
          </st-search-panel-item>
        </div>
      </st-search-panel>
    </div>
    <!-- NOTE: 导出 -->
    <!-- <st-button v-if="auth.export" :disabled='isSelectedDisabled' class="shop-member-list-button">批量导出</st-button> -->
    <st-table
      :columns="columns"
      :loading="loading.getListInfo"
      rowKey="id"
      :page="page"
      @change="onTableChange"
      :dataSource="list"
    >
      <span slot="operator" slot-scope="text, record">
        {{ record.operator.label }}
      </span>
      <span slot="member" slot-scope="text, record">
        <a
          href="javascript:;"
          v-if="auth['shop:member:member|get']"
          @click="infoFunc(record)"
        >
          {{ record.member.label }}
        </a>
        <span v-else>{{ record.member.label }}</span>
      </span>
      <span slot="member_level" slot-scope="text, record">
        {{ record.member_level.label }}
      </span>
      <span slot="coach" slot-scope="text, record">
        {{ record.coach.label }}
      </span>
      <span slot="salesman" slot-scope="text, record">
        {{ record.salesman.label }}
      </span>
      <span slot="follow_way" slot-scope="text, record">
        {{ record.follow_way.label }}
      </span>
      <span slot="follow_status" slot-scope="text, record">
        {{ record.follow_status.label }}
      </span>
      <span slot="contentTitle">
        当前跟进(次)
        <st-help-tooltip id="TSCRM003" />
      </span>
      <template slot="follow_content" slot-scope="text">
        <div>
          <st-overflow-text
            title="跟进内容"
            max-width="180px"
            :value="text"
          ></st-overflow-text>
        </div>
      </template>
    </st-table>
  </st-panel>
</template>
<script>
import moment from 'moment'
import { cloneDeep, filter } from 'lodash-es'
import { FollowService } from './follow.service'
import tableMixin from '@/mixins/table.mixin'
import { columns } from './follow.config'
import { MessageService } from '@/services/message.service'
export default {
  name: 'PageShopMemberFollow',
  bem: {
    bPage: 'page-shop-member-follow'
  },
  mixins: [tableMixin],
  serviceInject() {
    return {
      followService: FollowService,
      messageService: MessageService
    }
  },
  rxState() {
    return {
      loading: this.followService.loading$,
      auth: this.followService.auth$,
      list: this.followService.list$,
      page: this.followService.page$,
      staffList: this.followService.staffList$,
      coachList: this.followService.coachList$,
      operatorList: this.followService.operatorList$,
      memberLevel: this.followService.memberLevel$,
      followWayList: this.followService.followWayList$,
      followStatusList: this.followService.followStatusList$
    }
  },
  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      date: []
    }
  },
  computed: {
    columns
  },
  mounted() {
    this.setSearchDate()
  },
  methods: {
    setSearchDate() {
      if (!this.$searchQuery.follow_start_date) return
      const start = moment(this.$searchQuery.follow_start_date)
      const end = moment(this.$searchQuery.follow_end_date)
      this.date = [start, end]
    },
    onChangeSell(value) {
      this.$searchQuery.follow_salesman_id = value
    },
    onChangeCoach(value) {
      this.$searchQuery.follow_coach_id = value
    },
    onChangeOperator(value) {
      this.$searchQuery.operator_id = value
    },
    refeshPage() {
      this.$router.reload()
    },
    // 查询
    onSearchNative() {
      console.log(this.$searchQuery.follow_start_num)
      console.log(this.$searchQuery.follow_end_num)
      if (
        this.$searchQuery.follow_start_num > this.$searchQuery.follow_end_num &&
        this.$searchQuery.follow_start_num !== '' &&
        this.$searchQuery.follow_end_num !== ''
      ) {
        this.messageService.warn({
          content: '最小跟进次数要小于最大跟进次数'
        })
        return
      }
      this.$searchQuery.follow_start_date = this.date[0]
        ? `${this.date[0].format('YYYY-MM-DD')} 00:00`
        : ''
      this.$searchQuery.follow_end_date = this.date[1]
        ? `${this.date[1].format('YYYY-MM-DD')} 23:59`
        : ''
      this.onSearch()
    },
    infoFunc(record) {
      this.$router.push({
        name: 'shop-member-info-basic',
        query: { id: record.member.id }
      })
    },
    moment,
    handleReset() {
      this.date = [null, null]
      this.onSearchReset()
    }
  }
}
</script>
