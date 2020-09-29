<template>
  <div :class="b()">
    <div :class="b('header')">
      <div class="left">
        <a-checkbox
          class="check"
          v-if="isEdit"
          v-model="checkAll"
          :indeterminate="indeterminate"
          :checked="checkAll"
          @change="onCheckAllChange"
        ></a-checkbox>
        <div class="info" v-if="!isEdit">当前在场{{ page.total_counts }}人</div>
        <div class="info" v-else>已选{{ entranceKeys.length }}人</div>
      </div>
      <div class="buttons" v-if="!isEdit">
        <st-button
          class="button"
          type="link"
          size="small"
          :disabled="!hasNoMember"
          @click="handleEditLeaveStatus(true)"
        >
          批量离场
        </st-button>
      </div>
      <div class="buttons" v-else>
        <st-button
          class="button"
          type="link"
          :disabled="!entranceKeys.length || !auth.batchCheckout"
          @click="onLeaveBatch"
          size="small"
        >
          离场
        </st-button>
        <st-button
          class="mg-l8 button"
          type="link"
          size="small"
          @click="handleEditLeaveStatus(false)"
        >
          取消
        </st-button>
      </div>
    </div>
    <a-checkbox-group
      v-model="entranceKeys"
      @change="onChange"
      :class="[b('list-wrapper'), { noEdit: !isEdit }]"
    >
      <div :class="b('list')" v-scrollBar="{ stopPropagation: true }">
        <a-list
          v-infinite-scroll="handleInfiniteOnLoad"
          :infinite-scroll-distance="10"
          :dataSource="list"
          :loading="loading.getList"
          rowKey="member_id"
          :split="false"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <div :class="b('list-item')" @click="handleOpenEntrance(item)">
              <div class="left">
                <a-checkbox
                  class="check"
                  v-if="isEdit"
                  :value="item.member_id"
                ></a-checkbox>
                <div class="avatar">
                  <img :src="item.avatar" alt="" />
                </div>
                <div class="info">
                  <div class="name">
                    <st-overflow-text
                      :value="item.member_name"
                      maxWidth="100px"
                    ></st-overflow-text>
                  </div>
                  <div class="phone">
                    <st-overflow-text
                      :value="item.mobile"
                      maxWidth="100px"
                    ></st-overflow-text>
                  </div>
                </div>
              </div>
              <div class="right">
                <div class="time">{{ item.entry_time }}</div>
              </div>
            </div>
          </a-list-item>
        </a-list>
      </div>
    </a-checkbox-group>
  </div>
</template>

<script>
import { MemberOnlineService } from './member-online.service'
import tableMixin from '@/mixins/table.mixin'
import { columns } from './member-online.config.ts'
import infiniteScroll from 'vue-infinite-scroll'
import { debounce } from 'lodash-es'
import ShopReceptionEntrance from '@/views/biz-modals/shop/reception/entrance'

export default {
  mixins: [tableMixin],

  directives: { infiniteScroll },

  name: 'shop-reception-member-online',

  bem: {
    b: 'shop-reception-member-online'
  },

  modals: { ShopReceptionEntrance },

  serviceInject() {
    return {
      memberOnlineService: MemberOnlineService
    }
  },

  rxState() {
    return {
      auth: this.memberOnlineService.auth$,
      list: this.memberOnlineService.list$,
      page: this.memberOnlineService.page$,
      loading: this.memberOnlineService.loading$,
      finished: this.memberOnlineService.finished$
    }
  },

  components: {},

  props: {},

  data() {
    return {
      isEdit: false,
      entranceKeys: [], // 入场会员key值组合
      checkAll: false, // 是否全选
      indeterminate: false
    }
  },

  computed: {
    columns,
    hasNoMember() {
      return this.page.total_counts
    }
  },

  async: {},

  mounted() {},

  methods: {
    handleOpenEntrance(record) {
      if (this.isEdit) return false
      this.$modalRouter.push({
        name: 'shop-reception-entrance',
        props: {
          member_id: record.member_id
        },
        on: {
          done: () => {
            // this.$router.reload()
            this.$emit('refresh')
          }
        }
      })
    },
    onCheckAllChange(e) {
      let entranceKeys = this.list.map(item => item.member_id)
      this.entranceKeys = e.target.checked ? entranceKeys : []
      this.indeterminate = false
      this.checkAll = e.target.checked
    },
    onChange(checkedList) {
      let listLen = this.list.length
      let checkLen = checkedList.length
      this.indeterminate = !!checkLen && checkLen < listLen
      this.checkAll = checkLen === listLen
    },
    handleInfiniteOnLoad: debounce(function(e) {
      if (!this.finished) {
        this.memberOnlineService
          .getList({
            current_page: ++this.page.current_page,
            size: 20
          })
          .subscribe()
      }
    }, 400),
    // 离场之前的确认
    onLeaveConfirm(record) {
      this.memberOnlineService
        .getCabinetInfo(record.member_id)
        .subscribe(res => {
          if (res.info.is_smart) {
            this.$error({
              title: `当前会员有储物柜「${res.info.cabinet_area_name}」「${res.info.serial_num}」尚未归还，请先归还！`,
              okText: '知道了'
            })
          } else {
            this.onLeave(record)
          }
        })
    },
    onLeaveBatch() {
      this.$confirm({
        title: '批量离场',
        content: `确定离场吗？`,
        onOk: () => {
          return this.memberOnlineService
            .setEntranceLeaveBatch({
              ids: this.entranceKeys
            })
            .toPromise()
            .then(() => {
              this.handleEditLeaveStatus(false)
              this.$emit('refresh')
            })
        }
      })
    },
    handleEditLeaveStatus(status) {
      this.checkAll = false
      this.isEdit = status
      this.entranceKeys = []
    }
  },

  beforeRouteUpdate(to, from, next) {
    console.log('member-online')
    next()
  }
}
</script>
