<template>
  <div class="page-brand-package-info">
    <biz-package-info :info="info$" :btn-options="btnOptions">
      <div slot="actions">
        <st-btn-actions :options="btnOptions"></st-btn-actions>
      </div>
    </biz-package-info>
  </div>
</template>

<script>
import { InfoService } from './info.service'
import tableMixin from '@/mixins/table.mixin'
import ShopList from '@/views/biz-modals/package/shop-list'
import Synchronize from '@/views/biz-modals/package/synchronize'
import SuccessTip from '@/views/biz-modals/package/success-tip'
import userPackageActions from '@/hooks/package/package-actions.hook'
import BizPackageInfo from '@/views/biz-components/package/info/info.vue'
import SoldCoursePackageUpdateRights from '@/views/biz-modals/sold/course/package/update-rights'
import { ListService } from '@/views/pages/shop/product/course/manage/package/list.service.ts'
export default {
  name: 'ShopPackageInfo',
  components: { BizPackageInfo },
  mixins: [tableMixin],
  serviceInject() {
    return {
      service: InfoService,
      listService: ListService
    }
  },
  data() {
    return {
      pageType: 'shop'
    }
  },
  hooks() {
    return {
      userPackageActions: userPackageActions(this)
    }
  },
  rxState() {
    const { info$, auth$ } = this.service
    return {
      info$,
      auth$
    }
  },
  modals: {
    SoldCoursePackageUpdateRights
  },
  computed: {
    btnOptions() {
      return [
        {
          text: '编辑',
          click: this.onEdit,
          if: this.auth$['shop:product:package_course|edit']
        },
        {
          text: '删除',
          click: this.deletePackage,
          if: this.auth$['shop:product:package_course|del']
        },
        {
          text: '下架',
          click: this.onDownShelf,
          if: this.auth$['shop:product:package_course|down']
        },
        {
          text: '上架',
          click: this.onUpShelf,
          if: this.auth$['shop:product:package_course|up']
        },
        {
          text: '应用至售出',
          click: this.batchOperate,
          if: this.auth$['shop:product:package_course|batch_operate']
        },
        {
          text: '修改售出权益',
          click: this.updateRight,
          if: this.auth$['shop:product:package_course|sync_rights']
        }
      ]
    }
  },
  methods: {
    onUpShelf() {
      let id = this.info$.id
      let channel = this.info$.publish_channel
      this.userPackageActions.onUpShelf({
        id,
        channel,
        pageType: this.pageType
      })
    },
    onDownShelf() {
      let { id, course_name } = this.info$
      this.userPackageActions.onDownShelf({
        id,
        pageType: this.pageType,
        shopPackageName: course_name
      })
    },
    batchOperate() {
      let id = this.info$.package_course_id
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
    deletePackage() {
      let id = this.info$.id
      let name = this.info$.course_name
      this.userPackageActions
        .deletePackage(
          id,
          name,
          this.listService.deletePackage.bind(this.listService)
        )
        .then(res => {
          this.$router.push({ path: 'list' })
        })
    },
    onEdit() {
      let id = this.info$.id
      this.userPackageActions.onEdit({ pageType: this.pageType, id })
    },
    updateRight() {
      let id = this.info$.id
      this.$modalRouter.push({
        name: 'sold-course-package-update-rights',
        props: {
          id,
          isSync: true,
          isShowLink: true
        }
      })
    }
  }
}
</script>

<style></style>
