<template>
  <div :class="b()">
    <div :class="b('header')">
      <div :class="b('navs')">
        <div
          class="nav"
          :class="{ checked: activeIndex === 0 }"
          @click="activeIndex = 0"
        >
          {{ notesTabTips }}
        </div>
        <div
          class="nav"
          :class="{ checked: activeIndex === 1 }"
          @click="activeIndex = 1"
        >
          已完成
        </div>
      </div>
      <div :class="b('add')" v-if="activeIndex === 0">
        <st-button
          type="link"
          @click="onAddWorkNotes"
          :disabled="!auth.addTodo"
          class="to-do-add"
        >
          新增待办
        </st-button>
      </div>
    </div>

    <div :class="b('contents')">
      <div
        :class="b('list')"
        v-scrollBar="{ stopPropagation: true }"
        v-show="activeIndex === 0"
      >
        <a-list
          :data-source="workNoteList"
          :loading="loading.getWorkNoteList"
          itemLayout="vertical"
          :split="false"
          :class="b('wait-list')"
        >
          <a-list-item slot="renderItem" slot-scope="item" :class="b('todo')">
            <div class="wrapper">
              <div class="operation-subject">
                <st-overflow-text
                  :value="item.subject"
                  maxWidth="200px"
                ></st-overflow-text>
              </div>
              <div class="operation-content">
                <st-overflow-text
                  :value="item.content"
                  maxWidth="200px"
                  needMaxContainerWidth
                ></st-overflow-text>
              </div>
              <div class="operation-action">
                <div class="left">
                  <img :src="item.avatar" alt="" class="avatar" />
                  <span class="time">{{ item.created_time }}</span>
                </div>
                <div class="right">
                  <st-button class="complete" @click="onSetWorkNote(item)">
                    完 成
                  </st-button>
                </div>
              </div>
            </div>
          </a-list-item>
        </a-list>
      </div>
      <div
        :class="b('list')"
        v-scrollBar="{ stopPropagation: true }"
        v-show="activeIndex === 1"
      >
        <a-list
          :data-source="workNoteDoneList"
          :loading="loading.getWorkNoteDoneList"
          :class="b('finish-list')"
          itemLayout="vertical"
          :split="false"
        >
          <a-list-item slot="renderItem" slot-scope="item" :class="b('todo')">
            <div class="wrapper">
              <div class="operation-subject">
                <st-overflow-text
                  :value="item.subject"
                  maxWidth="200px"
                ></st-overflow-text>
              </div>
              <div class="operation-content">
                <st-overflow-text
                  :value="item.content"
                  maxWidth="200px"
                  needMaxContainerWidth
                ></st-overflow-text>
              </div>
              <div class="operation-action">
                <div class="left">
                  <img :src="item.avatar" alt="" class="avatar" />
                  <span class="time">{{ item.updated_time }}</span>
                </div>
                <div class="right">
                  <span class="finish-status">已完成</span>
                </div>
              </div>
            </div>
          </a-list-item>
        </a-list>
      </div>
    </div>
  </div>
</template>

<script>
import { timer } from 'rxjs'
import { TodoListService } from './todolist.service'
import FrontAddWorkNote from '@/views/biz-modals/front/add-work-note'
export default {
  name: 'shop-reception-todolist',

  bem: {
    b: 'shop-reception-todolist'
  },

  modals: {
    FrontAddWorkNote
  },

  components: {},

  props: {},

  data() {
    return {
      activeIndex: 0
    }
  },

  serviceInject() {
    return {
      todolistService: TodoListService
    }
  },

  rxState() {
    return {
      auth: this.todolistService.auth$,
      loading: this.todolistService.loading$,
      workNoteList: this.todolistService.workNoteList$,
      workNoteDoneList: this.todolistService.workNoteDoneList$
    }
  },

  computed: {
    notesTabTips() {
      let len = this.workNoteList.length
      let str = '待办'
      if (len) {
        str += `(${len})`
      }
      return str
    }
  },

  async: {},

  mounted() {
    this.todolistService.init().subscribe()
  },

  methods: {
    // 新增待办
    onAddWorkNotes() {
      this.$modalRouter.push({
        name: 'front-add-work-note',
        on: {
          success: () => {
            this.todolistService.getWorkNoteList().subscribe()
          }
        }
      })
    },
    onSetWorkNote(item) {
      this.$confirm({
        title: '完成待办',
        content: `确定完成${item.subject}吗？`,
        onOk: () => {
          return this.todolistService
            .setWorkNote(item.id)
            .toPromise()
            .then(() => {
              timer(800).subscribe(() => {
                this.todolistService.getWorkNoteList().subscribe()
                this.todolistService.getWorkNoteDoneList().subscribe()
              })
            })
        }
      })
    }
  }
}
</script>
