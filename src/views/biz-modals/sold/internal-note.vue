<template>
  <st-modal v-model="show" title="对内备注" :footer="null">
    <st-button
      type="dashed"
      icon="add"
      block
      v-if="!isAddNote"
      @click="addNote"
    >
      新增对内备注
    </st-button>
    <div class="create-note" v-else>
      <st-input
        v-model="note"
        :maxLength="200"
        placeholder="对内备注仅工作人员可见，限制200字以内。"
      ></st-input>
      <st-button
        class="creat-button mg-l8"
        type="primary"
        @click="addNoteSubmit"
        :loading="loading.addDescription"
        :disabled="!note"
      >
        确定
      </st-button>
    </div>
    <st-table
      :scroll="false"
      class="mg-t16 word-break"
      rowKey="id"
      :dataSource="descriptionList"
      :columns="columns"
      :pagination="false"
    ></st-table>
  </st-modal>
</template>
<script>
import { columns } from './internal-note.config.ts'
import { InternalNoteService } from './internal-note.service'
import { MessageService } from '@/services/message.service'
export default {
  name: 'SoldInternalNote',
  data() {
    return {
      show: false,
      isAddNote: false,
      note: ''
    }
  },
  props: {
    id: {
      required: true
    }
  },
  serviceInject() {
    return {
      internalNoteService: InternalNoteService,
      messageService: MessageService
    }
  },
  rxState() {
    return {
      loading: this.internalNoteService.loading$,
      descriptionList: this.internalNoteService.list$
    }
  },
  computed: {
    columns
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.internalNoteService.getList(this.id).subscribe()
    },
    addNote() {
      this.isAddNote = true
    },
    addNoteSubmit() {
      this.internalNoteService
        .addDescription({
          order_id: this.id,
          description: this.note.trim()
        })
        .subscribe(() => {
          this.isAddNote = false
          this.messageService.success({
            content: '对内备注新增成功'
          })
          this.note = ''
          this.getList()
        })
    }
  }
}
</script>
