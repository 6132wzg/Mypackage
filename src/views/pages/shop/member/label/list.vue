<template>
  <st-panel app class="page-shop-label-container">
    <div slot="title">
      <st-button
        type="primary"
        v-if="auth.add"
        icon="add"
        v-modal-link="{ name: 'label-add', on: { change: onSearchReset } }"
      >
        新增标签
      </st-button>
    </div>
    <div slot="actions">
      <st-input-search
        v-model="$searchQuery.tag_name"
        placeholder="请输入标签名"
        @search="onSearch"
      />
    </div>
    <a-row :gutter="8">
      <st-table
        :columns="columns"
        :dataSource="list"
        :page="page"
        @change="onTableChange"
        rowKey="id"
      >
        <div slot="action" slot-scope="record">
          <st-table-actions>
            <a
              v-if="record.auth['shop:member:tag|edit']"
              v-modal-link="{
                name: 'label-edit',
                props: { item: record },
                on: { change: onSearchReset }
              }"
            >
              编辑
            </a>
            <a
              v-if="record.auth['shop:member:tag|del']"
              @click="onDelete(record)"
            >
              删除
            </a>
          </st-table-actions>
        </div>
      </st-table>
    </a-row>
  </st-panel>
</template>
<script>
import { ListService } from './list.service'
import { MessageService } from '@/services/message.service'
import tableMixin from '@/mixins/table.mixin'
import { columns } from './list.config.ts'
import LabelAdd from '@/views/biz-modals/label/add'
import LabelEdit from '@/views/biz-modals/label/edit'
export default {
  name: 'ShopMemberLabelList',
  mixins: [tableMixin],
  modals: {
    LabelAdd,
    LabelEdit
  },
  serviceInject() {
    return {
      listService: ListService,
      messageService: MessageService
    }
  },
  rxState() {
    return {
      auth: this.listService.auth$,
      list: this.listService.list$,
      page: this.listService.page$
    }
  },
  data() {
    return {
      tag_name: ''
    }
  },
  mounted() {},
  computed: {
    columns
  },
  methods: {
    onEdit(e) {
      console.log(e)
    },
    onDelete(e) {
      this.$confirm({
        title: '提示',
        content:
          '用户信息里所有此标签将会被同步删除，无法恢复，确认删除此标签？',
        onOk: () => {
          this.listService.deleteLabel(e.id).subscribe(() => {
            this.messageService.success({ content: '删除成功' })
            this.$router.reload()
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
