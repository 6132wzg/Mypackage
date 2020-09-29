<template>
  <st-panel app :class="b()">
    <div slot="title">
      <st-input-search
        @search="onSingleSearch('course_name', $event, true)"
        v-model="$searchQuery.course_name"
        placeholder="课程包名称"
      />
    </div>
    <div :class="b('operation')">
      <st-button
        type="primary"
        @click="addPackage"
        :disabled="!auth$.add"
        icon="add"
      >
        新增课程包
      </st-button>
      <div :class="b('select-group')">
        <a-select
          v-model="$searchQuery.support_num"
          @change="onSingleSearch('support_num', $event)"
          :class="b('select')"
          class="mg-r16"
          style="width: 160px"
          :options="supportNum$"
        />
        <a-select
          v-model="$searchQuery.package_type"
          @change="onSingleSearch('package_type', $event)"
          :class="b('select')"
          style="width: 160px"
          :options="packageType$"
        />
        <a-select
          v-model="$searchQuery.publish_channel"
          @change="onSingleSearch('publish_channel', $event)"
          :class="b('select')"
          class="mg-l16"
          style="width: 160px"
          :options="publicChannel$"
        />
      </div>
    </div>
    <st-table
      class="mg-t16"
      :page="page$"
      :columns="columns"
      @change="onTableChange"
      rowKey="package_course_id"
      :dataSource="list$"
      :loading="loading$.getList"
    >
      <template slot="package_type" slot-scope="text">
        {{ text | enumFilter('package_course.package_type') }}
      </template>
      <template slot="valid_time" slot-scope="text, record">
        <span class="white-nowrap">
          {{ text }}
          {{
            record.valid_time_unit
              | enumFilter('package_course.valid_time_unit')
          }}
        </span>
      </template>
      <template slot="is_limit" slot-scope="text">
        <span>{{ text | enumFilter('package_course.is_limit') }}</span>
      </template>
      <template slot="sale_shop_num" slot-scope="text, record">
        <a @click="getShopList(record.package_course_id)">
          {{ `${record.up_shop_num} / ${text}` }}
        </a>
      </template>

      <div slot="action" slot-scope="text, record">
        <st-table-actions>
          <a
            v-if="record.auth['brand:product:package_course|edit']"
            @click="onEdit(record.package_course_id)"
          >
            编辑
          </a>
          <a
            v-if="record.auth['brand:product:package_course|get']"
            @click="onDetail(record.package_course_id, record.package_type)"
          >
            详情
          </a>
          <a
            v-if="record.auth['brand:product:package_course|up']"
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
            v-if="record.auth['brand:product:package_course|down']"
            @click="onDownShelf(record.package_course_id, record.course_name)"
          >
            下架
          </a>
          <a
            v-if="record.auth['brand:product:package_course|batch_operate']"
            @click="batchOperate(record.package_course_id, record.course_name)"
          >
            应用至售出
          </a>
          <a
            v-if="record.auth['brand:product:package_course|del']"
            @click="deletePackage(record.package_course_id, record.course_name)"
          >
            删除
          </a>
          <a
            v-if="record.auth['brand:product:package_course|sync_rights']"
            v-modal-link="{
              name: 'sold-course-package-update-rights',
              props: {
                id: record.package_course_id,
                isSync: true,
                isShowLink: true,
                isBrandTaskLink: true
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
import { ListService } from './list.service'
import tableMixin from '@/mixins/table.mixin'
import { columns } from './list.config'
import { ruleOptions } from './list.config'
import ShopList from '@/views/biz-modals/package/shop-list'
import Synchronize from '@/views/biz-modals/package/synchronize'
import SuccessTip from '@/views/biz-modals/package/success-tip'
import SoldCoursePackageUpdateRights from '@/views/biz-modals/sold/course/package/update-rights'
import userPackageActions from '@/hooks/package/package-actions.hook'
export default {
  name: 'BrandPackageList',
  mixins: [tableMixin],
  serviceInject() {
    return {
      listService: ListService
    }
  },
  modals: {
    ShopList,
    Synchronize,
    SuccessTip,
    SoldCoursePackageUpdateRights
  },
  hooks() {
    return {
      userPackageActions: userPackageActions(this)
    }
  },
  rxState() {
    const {
      list$,
      page$,
      loading$,
      auth$,
      packageType$,
      publicChannel$,
      supportNum$
    } = this.listService
    return {
      list$,
      page$,
      loading$,
      auth$,
      packageType$,
      publicChannel$,
      supportNum$
    }
  },
  bem: {
    b: 'page-brand-package-list'
  },
  data() {
    return {
      FIXATION: 3,
      UNLIMIT: 1,
      RANGE: 2,
      pageType: 'brand'
    }
  },
  computed: {
    columns
  },
  methods: {
    addPackage() {
      this.$router.push({ name: 'brand-product-package-add' })
    },
    getShopList(id) {
      this.$modalRouter.push({
        name: 'shop-list',
        props: {
          id
        }
      })
    },
    onUpShelf(id, channel) {
      this.userPackageActions.onUpShelf({
        id,
        channel,
        pageType: this.pageType
      })
    },
    onDownShelf(id) {
      this.userPackageActions.onDownShelf({ id, pageType: this.pageType })
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
    deletePackage(id, name) {
      this.userPackageActions
        .deletePackage(
          id,
          name,
          this.listService.deletePackage.bind(this.listService)
        )
        .then(res => {
          this.$router.reload()
        })
    },
    onEdit(id) {
      this.userPackageActions.onEdit({ pageType: this.pageType, id })
    },
    onDetail(id, packageType) {
      this.$router.push({
        name: 'brand-product-package-info',
        query: {
          id,
          packageType
        }
      })
    }
  }
}
</script>
