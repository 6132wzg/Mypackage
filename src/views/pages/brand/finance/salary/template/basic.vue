<template>
  <st-form-table
    :page="page"
    @change="onTableChange"
    :loading="loading.getBasicInfo"
  >
    <colgroup>
      <col />
      <col />
      <col />
      <col />
      <col />
    </colgroup>
    <thead>
      <tr>
        <template v-for="(item, index) in columsTitlelist">
          <th :key="index" :style="{ 'text-align': item.align }">
            {{ item.title }}
          </th>
        </template>
      </tr>
    </thead>

    <tbody>
      <tr v-if="auth.add">
        <td colspan="5" class="st-form-table__add">
          <st-button
            type="dashed"
            icon="add"
            block
            v-modal-link="{
              name: 'finance-add-template',
              on: { change: refresh }
            }"
          >
            新增底薪模板
          </st-button>
        </td>
      </tr>
      <template v-for="item in list">
        <tr :key="item.id">
          <td>{{ item.template_name }}</td>
          <td :align="columsTitlelist[1].align">{{ item.salary }}</td>
          <td :align="columsTitlelist[2].align">
            <template v-if="item.used == 0">
              <span>{{ item.used }}</span>
            </template>
            <template v-if="item.used != 0">
              <a
                v-modal-link="{
                  name: 'finance-search-staff-list-salary',
                  props: { id: item.id }
                }"
              >
                {{ item.used }}
              </a>
            </template>
          </td>
          <td>{{ item.created_time }}</td>
          <td>
            <st-table-actions>
              <a
                v-if="item.auth['brand_shop:salary:basic_template|edit']"
                v-modal-link="{
                  name: 'finance-basic-template-edit',
                  props: { item: item },
                  on: { change: refresh }
                }"
              >
                编辑
              </a>
              <a
                href="javascript:;"
                v-if="item.auth['brand_shop:salary:basic_template|del']"
                @click="onDelete(item.id)"
              >
                删除
              </a>
            </st-table-actions>
          </td>
        </tr>
      </template>
    </tbody>
  </st-form-table>
</template>
<script>
import { BasicService } from './basic.service'
import { MessageService } from '@/services/message.service'
import tableMixin from '@/mixins/table.mixin'
import FinanceAddTemplate from '@/views/biz-modals/finance/add-template'
import FinanceBasicTemplateEdit from '@/views/biz-modals/finance/basic-template-edit'
import FinanceSearchStaffListSalary from '@/views/biz-modals/finance/search-staff-list-salary'

export default {
  mixins: [tableMixin],
  modals: {
    FinanceAddTemplate,
    FinanceBasicTemplateEdit,
    FinanceSearchStaffListSalary
  },
  serviceInject() {
    return {
      basicService: BasicService,
      messageService: MessageService
    }
  },
  rxState() {
    return {
      // 路由query订阅
      list: this.basicService.list$,
      loading: this.basicService.loading$,
      page: this.basicService.page$,
      auth: this.basicService.auth$
    }
  },
  data() {
    return {
      columsTitlelist: [
        {
          title: '模板名称'
        },
        {
          title: '月底薪(元)'
        },
        {
          title: '应用员工'
        },
        {
          title: '创建时间'
        },
        {
          title: '操作'
        }
      ]
    }
  },
  methods: {
    refresh() {
      this.$router.push({
        query: {
          size: this.page.pageSize,
          page: this.page.current
        }
      })
    },
    onDelete(e) {
      console.log(e)
      let that = this
      this.$confirm({
        title: '提示',
        content: '是否确认删除？',
        onOk() {
          console.log('OK')
          that.basicService.deleteTemplate(e).subscribe(() => {
            console.log('ok')
            that.messageService.success({
              content: '删除成功'
            })
            that.$router.push({
              query: {}
            })
          })
        },
        onCancel() {
          console.log('Cancel')
        },
        class: 'test'
      })
    }
  }
}
</script>
