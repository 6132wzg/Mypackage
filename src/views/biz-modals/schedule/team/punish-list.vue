<template>
  <st-modal
    class="modal-punish"
    title="爽约惩罚列表"
    v-model="show"
    :footer="null"
    width="848px"
  >
    <st-table
      rowKey="id"
      :loading="loading.getList"
      :dataSource="list"
      :columns="columns"
      @change="onPageChange"
      :page="page"
      :simplePage="true"
      :class="list.length > 0 ? 'st-scroll-data' : ''"
    >
      <template slot="action" slot-scope="text, record">
        <st-popconfirm
          title="确认解除惩罚？"
          @confirm="delPunishment(record.id)"
        >
          <a>解除惩罚</a>
        </st-popconfirm>
      </template>
    </st-table>
  </st-modal>
</template>

<script>
import { MessageService } from '@/services/message.service'
import { PunishListService } from './punish-list.service'
import { columns } from './punish-list.config'

export default {
  name: 'PunishList',
  serviceInject() {
    return {
      messageService: MessageService,
      punishService: PunishListService
    }
  },
  rxState() {
    const { list$, page$, loading$ } = this.punishService
    return {
      list: list$,
      page: page$,
      loading: loading$
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    columns
  },
  created() {
    this.getList(this.page)
  },
  methods: {
    getList(page) {
      const { current_page, size } = page
      this.punishService
        .getList({
          size,
          current_page
        })
        .subscribe()
    },
    delPunishment(id) {
      this.punishService.delPunishment(id).subscribe(() => {
        this.messageService.success({
          content: '解除惩罚成功！'
        })
        this.getList({
          ...this.page,
          current_page: 1
        })
      })
    },
    onPageChange(page) {
      this.getList({
        current_page: page.current,
        size: page.pageSize
      })
    }
  }
}
</script>
