<template>
  <st-modal
    title="新增常用功能"
    @ok="save"
    v-model="show"
    width="464px"
    wrapClassName="edit-shortcuts"
  >
    <div class="content">
      <div class="section">
        <div class="label">不展示功能：</div>
        <draggable
          v-model="noshowList"
          :animation="200"
          group="shortcuts"
          class="shortcuts hidden"
          :move="checkMove"
          @start="dragStart"
          @end="dragEnd"
        >
          <div
            v-for="item in noshowList"
            :key="item.id"
            class="shortcut"
            @click="handleAddShortcut(item)"
          >
            <span class="name">{{ item.name }}</span>
            <a-icon class="icon" type="plus" />
          </div>
        </draggable>
      </div>
      <div class="section">
        <div class="label">展示功能：</div>
        <draggable
          v-model="showList"
          :animation="200"
          group="shortcuts"
          class="shortcuts show"
          :move="checkMove"
          @start="dragStart"
          @end="dragEnd"
        >
          <div
            v-for="item in showList"
            :key="item.id"
            class="shortcut"
            :class="{ hidden: !item.auth }"
            @click="handleRemoveShortcut(item)"
          >
            <span class="name">{{ item.name }}</span>
            <a-icon class="icon" type="close" />
          </div>
        </draggable>
      </div>
    </div>
  </st-modal>
</template>
<script>
import draggable from 'vuedraggable'
import { EditShortcutService } from './edit-shortcuts.service'
import { cloneDeep } from 'lodash-es'

export default {
  serviceInject() {
    return {
      editShortcutService: EditShortcutService
    }
  },
  rxState() {
    return {
      list: this.editShortcutService.list$,
      auth: this.editShortcutService.auth$
    }
  },
  components: { draggable },
  name: '',
  props: {},
  data() {
    return {
      show: false,
      cloneList: [],
      showList: [],
      noshowList: []
    }
  },
  created() {
    this.editShortcutService.getIcons().subscribe(res => {
      let list = cloneDeep(this.list)
      this.cloneList = list.map(i => {
        i.auth = this.auth[i.id]
        return i
      })
      this.showList = this.cloneList.filter(i => i.is_show)
      this.noshowList = this.cloneList.filter(i => !i.is_show)
    })
  },
  methods: {
    save(e) {
      let self = this
      e.preventDefault()
      console.log('showList', this.showList)
      console.log('noshowList', this.noshowList)
      this.editShortcutService
        .setIcons({
          icons: [...this.showList, ...this.noshowList]
        })
        .subscribe(res => {
          this.show = false
          this.$emit('done')
        })
    },
    checkMove(evt) {
      const { draggedContext, dragged, from, to } = evt
      const draggedElement = draggedContext.element
      const fromClassList = from.classList
      const toClassList = to.classList
      if (fromClassList.contains('show') && toClassList.contains('hidden')) {
        draggedElement.is_show = 0
      } else if (
        fromClassList.contains('hidden') &&
        toClassList.contains('show')
      ) {
        draggedElement.is_show = 1
      }
    },
    handleRemoveShortcut(item) {
      item.is_show = 0
      this.showList = this.cloneList.filter(i => i.is_show)
      this.noshowList = this.cloneList.filter(i => !i.is_show)
    },
    handleAddShortcut(item) {
      item.is_show = 1
      this.showList = this.cloneList.filter(i => i.is_show)
      this.noshowList = this.cloneList.filter(i => !i.is_show)
    },
    dragStart(ev) {
      ev.item.classList.add('dragged')
    },
    dragEnd(ev) {
      ev.item.classList.remove('dragged')
    }
  }
}
</script>
