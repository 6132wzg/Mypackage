<template>
  <st-panel app :class="listClass()">
    <div slot="title">
      <st-input-search
        @search="onSingleSearch('course_name', $event, true)"
        v-model="$searchQuery.course_name"
        placeholder="搜索课程包名称"
      />
    </div>
    <div :class="listClass('operation')">
      <st-button
        type="primary"
        v-if="auth$.add"
        @click="onAddPackage"
        icon="add"
      >
        新增门店课程包
      </st-button>
      <div :class="listClass('select-group')">
        <a-select
          v-model="$searchQuery.support_num"
          @change="onSingleSearch('support_num', $event)"
          style="width: 160px"
          class="mg-r16"
          :options="supportNum$"
        />
        <a-select
          v-model="$searchQuery.package_type"
          @change="onSingleSearch('package_type', $event)"
          :class="listClass('select')"
          style="width: 160px"
          :options="packageTypes$"
        />
        <a-select
          v-model="$searchQuery.publish_channel"
          @change="onSingleSearch('publish_channel', $event)"
          :class="listClass('select')"
          class="mg-l16"
          style="width: 160px"
          :options="publicChannel$"
        />
        <a-select
          v-model="$searchQuery.shelf_status"
          @change="onSingleSearch('shelf_status', $event)"
          :class="listClass('select')"
          style="width: 160px"
          :options="shelfStatus$"
        />
      </div>
    </div>
    <st-table
      :page="page"
      :columns="columns"
      @change="onTableChange"
      rowKey="package_course_id"
      :dataSource="list"
      :loading="loading.getList"
    >
      <template slot="package_type" slot-scope="text">
        {{ text | enumFilter('package_course.package_type') }}
      </template>
      <template slot="is_limit" slot-scope="text">
        <span>{{ text | enumFilter('package_course.is_limit') }}</span>
      </template>
      <template slot="valid_time" slot-scope="text, record">
        {{ text }}
        {{
          record.valid_time_unit | enumFilter('package_course.valid_time_unit')
        }}
      </template>
      <template slot="shelf_status" slot-scope="text, record">
        <st-text
          :status="{
            success: record.shelf_status === 1,
            error: record.shelf_status === 2,
            warning: record.shelf_status === 0
          }"
        >
          {{ text | enumFilter('package_course.shelf_status') }}
        </st-text>
        <template v-if="record.shelf_status === 2">
          <st-help-popover>
            <span slot="content">{{ record.reason }}</span>
          </st-help-popover>
        </template>
      </template>

      <div slot="action" slot-scope="text, record">
        <st-table-actions>
          <a
            v-if="record.auth['shop:product:package_course|edit']"
            @click="onEdit(record.package_course_id, record.package_type)"
          >
            编辑
          </a>
          <a
            v-if="record.auth['shop:product:package_course|get']"
            @click="onDetail(record.package_course_id, record.package_type)"
          >
            详情
          </a>
          <a
            v-if="record.auth['shop:product:package_course|batch_operate']"
            @click="batchOperate(record.package_course_id, record.course_name)"
          >
            应用至售出
          </a>
          <a
            v-if="record.auth['shop:product:package_course|up']"
            @click="
              onUpShelf(
                record.package_course_id,
                record.publish_channel,
                record.is_permanent_sale
              )
            "
          >
            上架
          </a>
          <a
            v-if="record.auth['shop:product:package_course|down']"
            @click="onDownShelf(record.package_course_id, record.course_name)"
          >
            下架
          </a>
          <a
            v-if="record.auth['shop:product:package_course|del']"
            @click="deletePackage(record.package_course_id, record.course_name)"
          >
            删除
          </a>
          <a
            v-if="record.auth['shop:product:package_course|delllls']"
            @click="deletePackage(record.package_course_id, record.course_name)"
          >
            批量操作
          </a>
          <a
            v-if="record.auth['shop:product:package_course|sync_rights']"
            v-modal-link="{
              name: 'sold-course-package-update-rights',
              props: {
                id: record.package_course_id,
                isSync: true,
                isShowLink: true
              }
            }"
          >
            修改售出权益
          </a>
        </st-table-actions>
      </div>
    </st-table>
  </st-panel>
</template>
<script>
import moment from 'moment'
import { cloneDeep } from 'lodash-es'
import { ListService } from './list.service'
import { UserService } from '@/services/user.service'
import tableMixin from '@/mixins/table.mixin'
import { columns } from './list.config'
import userPackageActions from '@/hooks/package/package-actions.hook'
import Synchronize from '@/views/biz-modals/package/synchronize'
import SoldCoursePackageUpdateRights from '@/views/biz-modals/sold/course/package/update-rights'
import { MessageService } from '@/services/message.service'
import { ruleOptions, ruleOffSaleOptions } from './list.config'
import { PRODUCT_CHANNEL } from '@/constants/course/package.ts'

export default {
  name: 'ShopPackageList',
  mixins: [tableMixin],
  serviceInject() {
    return {
      userService: UserService,
      messageService: MessageService,
      listService: ListService
    }
  },
  modals: {
    Synchronize,
    SoldCoursePackageUpdateRights
  },
  hooks() {
    return {
      userPackageActions: userPackageActions(this)
    }
  },
  rxState() {
    return {
      publicChannel$: this.listService.publicChannel$,
      supportNum$: this.listService.supportNum$,
      list: this.listService.list$,
      page: this.listService.page$,
      loading: this.listService.loading$,
      packageTypes$: this.listService.packageType$,
      shelfStatus$: this.listService.shelfStatus$,
      auth$: this.listService.auth$
    }
  },
  bem: {
    listClass: 'page-shop-package-list'
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      offsaleIsShow: false,
      deleteIsShow: false,
      onsaleIsShow: false,
      packageId: '',
      packageName: '',
      start_time: null,
      is_permanent_sale: 0,
      end_time: null,
      endOpen: false,
      offSaleText: '',
      type: ['', 'unlimit', 'range', 'fix']
    }
  },
  computed: {
    columns
  },
  methods: {
    // 售卖时间-start
    start_time_change(data) {
      this.start_time = cloneDeep(data)
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    disabledStartDate(startValue) {
      const endValue = this.end_time
      if (!endValue) {
        // 结束时间未选择
        return (
          startValue.valueOf() <
          moment()
            .subtract(1, 'd')
            .valueOf()
        )
      }
      let start =
        endValue.valueOf() >
        moment()
          .add(30, 'y')
          .valueOf()
          ? moment(endValue)
              .subtract(30, 'y')
              .valueOf()
          : moment()
              .subtract(1, 'd')
              .add(1, 'ms')
              .valueOf()
      return (
        startValue.valueOf() < start ||
        startValue.valueOf() >
          moment(endValue)
            .subtract(1, 'd')
            .valueOf()
      )
    },
    // 售卖时间-end
    end_time_change(data) {
      this.end_time = cloneDeep(data)
    },
    handleEndOpenChange(open) {
      this.endOpen = open
    },
    disabledEndDate(endValue) {
      const startValue = this.start_time
      if (!startValue) {
        // 开始时间未选择
        return (
          endValue.valueOf() >=
            moment()
              .add(30, 'y')
              .valueOf() || endValue.valueOf() <= moment().valueOf()
        )
      }
      return (
        endValue.valueOf() >=
          moment(startValue)
            .add(30, 'y')
            .valueOf() ||
        endValue.valueOf() <
          moment(startValue)
            .add(1, 'd')
            .valueOf()
      )
    },
    // moment
    moment,
    onAddPackage() {
      this.$router.push({ name: 'shop-product-package-add' })
    },
    onEdit(id) {
      this.$router.push({
        name: 'shop-product-package-edit',
        query: {
          id
        }
      })
    },
    onDetail(id, packageType) {
      this.$router.push({
        name: 'shop-product-package-info',
        query: {
          id,
          packageType
        }
      })
    },
    batchOperate(id) {
      this.$modalRouter.push({
        name: 'Synchronize',
        on: {
          success: () => {
            this.$confirm({
              title: '提示',
              content: `请再次确认是否同步，同步后会覆盖售出课程包，将会有2～5s无法正常使用`,
              onOk: () => {
                this.listService.setSyncSold(id).subscribe(res => {
                  this.$modalRouter.push({
                    name: 'success-tip'
                  })
                  this.$router.reload()
                })
              },
              onCancel() {}
            })
          }
        }
      })
    },
    onUpShelf(id, channel) {
      this.userPackageActions.onUpShelf({ id, channel, pageType: 'shop' })
    },
    onDownShelf(id, name) {
      this.userPackageActions.onDownShelf({
        id,
        pageType: 'shop',
        shopPackageName: name
      })
    },

    deletePackage(id, name) {
      this.userPackageActions
        .deletePackage(
          id,
          name,
          this.listService.deletePackage.bind(this.listService)
        )
        .then(res => {
          this.$router.reload()
          console.log(res)
        })
    }
  }
}
</script>
