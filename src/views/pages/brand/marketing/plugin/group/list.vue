<template>
  <st-panel-layout>
    <MarkteingPluginTitle pathName="brand-marketing-plugin-group-list" />
    <st-panel app initial :class="basic()">
      <div slot="title" :class="basic('search')">
        <div :class="basic('add')" v-if="auth.add">
          <st-button icon="add" type="primary" @click="onAddGroup">
            新增活动
          </st-button>
          <st-button @click="onConfigHandle" class="mg-l16">
            配置到小程序
          </st-button>
        </div>
        <a-select
          :class="basic('select')"
          v-model="activityStatus"
          placeholder="活动状态"
          @change="onSingleSearch('activity_status', $event)"
          style="width: 160px"
        >
          <a-select-option v-for="item in groupBuyEnums" :key="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
        <st-input-search
          v-model="activityName"
          @search="onSingleSearch('activity_name', $event)"
          placeholder="请输入活动名称"
          maxlength="50"
        />
      </div>
      <div :class="basic('content')">
        <st-table
          :page="page"
          rowKey="id"
          :columns="columns"
          @change="onTableChange"
          :dataSource="list"
        >
          <!-- 商品类型 -->
          <template slot="product_type" slot-scope="text, record">
            <span>{{ record.product_type.name }}</span>
          </template>
          <!-- 支持门店 -->
          <template slot="support_sales" slot-scope="text, record">
            <a
              v-if="record.id"
              v-modal-link="{
                name: 'card-brand-member-shop-table',
                props: { id: record.id, type: 'Group', title: '支持门店' }
              }"
            >
              {{ text }}
            </a>
          </template>
          <!-- 活动状态 -->
          <template slot="activity_state" slot-scope="text, record">
            <span
              v-if="
                record.activity_state && record.activity_state.published_time
              "
            >
              <st-text
                :status="{
                  warning: record.activity_state.id === 1
                }"
              >
                {{ record.activity_state.name }}
              </st-text>
              <st-help-popover v-if="record.activity_state.published_time">
                <span slot="content">
                  发布时间：{{ record.activity_state.published_time }}
                </span>
              </st-help-popover>
            </span>
            <span v-else>
              <st-text
                :status="{
                  warning: record.activity_state.id === 1,
                  default: record.activity_state.id === 2,
                  success: record.activity_state.id === 3,
                  error: record.activity_state.id === 4
                }"
              >
                {{ record.activity_state.name }}
              </st-text>
            </span>
          </template>
          <!-- 做权限点判断 -->
          <template slot="action" slot-scope="text, record">
            <st-table-actions sytle="width: 120px">
              <a
                @click="onData(record)"
                v-if="record.auth['brand:activity:group_buy|data']"
              >
                数据
              </a>
              <a
                @click="onGeneralize(record)"
                v-if="record.auth['brand:activity:group_buy|spread']"
              >
                推广
              </a>
              <a
                @click="onEdit(record)"
                v-if="record.auth['brand:activity:group_buy|edit']"
              >
                编辑
              </a>
              <a
                @click="onStop(record)"
                v-if="record.auth['brand:activity:group_buy|stop']"
              >
                结束
              </a>
              <a
                @click="onRelease(record)"
                v-if="record.auth['brand:activity:group_buy|release']"
              >
                发布
              </a>
            </st-table-actions>
          </template>
        </st-table>
      </div>
      <st-modal
        v-model="modalShow"
        :footer="null"
        :title="title"
        wrapClassName="scroll-modal"
      >
        <st-table
          :page="shopPage"
          rowKey="id"
          :loading="loading[`getShopList`]"
          :columns="shopListColumns"
          @change="onShopTableChange"
          :scroll="{ y: 230, x: 600 }"
          :dataSource="shopList"
          :pagination="{
            current: shopPage.current_page,
            total: shopPage.total_counts,
            pageSize: shopPage.size
          }"
        >
          <template slot="action" slot-scope="text, record">
            <st-table-actions sytle="width: 80px">
              <a @click="onSelect(record)">
                选择
              </a>
            </st-table-actions>
          </template>
        </st-table>
      </st-modal>
    </st-panel>
  </st-panel-layout>
</template>
<script>
import { UserService } from '@/services/user.service'
import { ListService } from './list.service'
import MarkteingPluginTitle from '../../components#/marketing-title'
import tableMixin from '@/mixins/table.mixin'
import { columns, shopListColumns } from './list.config'
import BrandMarketingBind from '@/views/biz-modals/brand/marketing/bind'
import useShare from '@/hooks/marketing/share.hook'
import CardBrandMemberShopTable from '@/views/biz-modals/card/brand-member/shop-table'

export default {
  name: 'PageBrandMarketingPluginGroupList',
  mixins: [tableMixin],
  bem: {
    basic: 'page-brand-plugin-group-list'
  },
  modals: {
    BrandMarketingBind,
    CardBrandMemberShopTable
  },
  serviceInject() {
    return {
      listService: ListService,
      userService: UserService
    }
  },
  rxState() {
    return {
      list: this.listService.list$,
      page: this.listService.page$,
      loading: this.listService.loading$,
      auth: this.listService.auth$,
      info: this.listService.info$,
      groupBuyEnums: this.listService.groupBuyEnums$,
      shopList: this.listService.shopList$,
      shopPage: this.listService.shopPage$,
      isAuth: this.listService.isAuth$
    }
  },
  hooks() {
    return {
      share: useShare()
    }
  },
  data(vm) {
    return {
      activityName: '',
      activityStatus: -1,
      columns: columns,
      shopListColumns: shopListColumns,
      modalShow: false, // 控制选择门店
      title: '选择门店',
      groupId: ''
    }
  },
  computed: {},
  mounted() {
    this.setSearchData()
  },
  watch: {
    query(newVal) {
      this.setSearchData()
    }
  },
  methods: {
    onConfigHandle() {
      this.$router.push({
        path: '/brand/setting/mina/index'
      })
    },
    // 选择门店推广
    onSelect(record) {
      this.listService
        .getSharePosterInfo(this.groupId, { shop_id: record.id })
        .subscribe(res => {
          this.modalShow = false
          let isAuth = this.isAuth
          const shsInfo = {
            person_num: this.info.group_sum,
            name: this.info.product_name,
            qrcode_url: this.info.qrcode_base,
            logo: this.info.brand_logo,
            brand_name: this.info.brand_name,
            price: this.info.price,
            image: this.info.product_logo
          }
          this.share.poster({
            isAuth,
            shsInfo,
            hasQrCodeBtn: true,
            shsPath: '/saas-mina/groupbuy'
          })
        })
    },
    // 设置状态&名称
    setSearchData() {
      let { activity_name, activity_status } = this.$searchQuery
      this.activityName = activity_name
      this.activityStatus = activity_status || -1
    },
    // 活动发布
    onRelease(record) {
      let that = this
      this.$confirm({
        title: '提示',
        content: '确定发布该活动?发布成功后，用户即可在小程序端看到该活动。',
        onOk() {
          that.listService.releaseGroup(record.id).subscribe(res => {
            that.$router.reload()
          })
        },
        onCancel() {}
      })
    },

    // 数据
    onData(record) {
      this.$router.push({
        path: './data',
        query: { id: record.id }
      })
    },
    // 选择门店
    onGeneralize(record) {
      this.groupId = record.id
      this.listService
        .getShopList(record.id, {
          size: record.size || 20,
          current_page: record.current_page || 1
        })
        .subscribe(res => {
          this.modalShow = true
        })
    },
    // 门店分页
    onShopTableChange(data) {
      console.log(data)
      this.onGeneralize({
        id: this.groupId,
        size: data.pageSize,
        current_page: data.current
      })
    },
    // 编辑列表
    onEdit(record) {
      let typeId = record.product_type.id
      let id = record.id
      switch (typeId) {
        case 3:
          this.$router.push({
            path: './edit-personal',
            query: { id: id }
          })
          break
        case 2:
          this.$router.push({
            path: './edit-deposit',
            query: { id: id }
          })
          break
        case 1:
          this.$router.push({
            path: './edit-member',
            query: { id: id }
          })
          break
        case 4:
          this.$router.push({
            path: './edit-package-course',
            query: { id: id }
          })
          break
        default:
      }
    },
    // 结束活动
    onStop(record) {
      let that = this
      this.$confirm({
        title: '提示',
        content: '确定停止该活动吗？活动停止后，未成团订单将自动关闭并退款。',
        onOk() {
          that.listService.stopGroup(record.id).subscribe(res => {
            that.$router.reload()
          })
        },
        onCancel() {}
      })
    },
    // 新增活动
    onAddGroup() {
      this.$router.push({
        path: './choose'
      })
    }
  },
  components: {
    MarkteingPluginTitle
  }
}
</script>
