<template>
  <st-modal :title="title" v-model="show" @ok="onSubmit" @cancel="onCancel">
    <div>
      <st-header-actions type="small">
        <template slot="left">
          <div class="color-danger" v-if="selectedRowKeys.length > max">
            最多选择{{ max }}项
          </div>
          <div v-else>已选{{ selectedRowKeys.length }}项</div>
        </template>
        <template slot="right">
          <a-select
            class="mg-r16"
            style="width: 145px"
            v-model="searchQuery.course_type"
            @change="onSingleSearch('course_type', $event)"
          >
            <a-select-option :value="1">团课</a-select-option>
            <a-select-option :value="2">私教课</a-select-option>
            <a-select-option :value="3">小班课</a-select-option>
          </a-select>
          <st-input-search
            style="width: 240px"
            @change="onSingleSearch('keywords', $event.target.value)"
            placeholder="搜索"
          ></st-input-search>
        </template>
      </st-header-actions>
      <st-container>
        <st-table
          rowKey="id"
          :loading="fnLoading"
          :columns="columns"
          :dataSource="list"
          :page="page"
          :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectionChange
          }"
          :scroll="{ x: 600 }"
          :simplePage="true"
          @change="onTableChange"
        >
          <template slot="class_status" slot-scope="text, record">
            {{ record.class_status | enumFilter('small_course.class_status') }}
          </template>
          <template slot="small_course_type" slot-scope="text, record">
            {{
              record.small_course_type
                | enumFilter('small_course.small_course_type')
            }}
          </template>
        </st-table>
      </st-container>
    </div>
  </st-modal>
</template>

<script>
import {
  TeamCoursecolumns,
  PersonalCoursecolumns,
  SmallCoursecolumns
} from './recommend-course-table-select.config'
import { RecommendCourseTableSelectService } from './recommend-course-table-select.service'
import { MessageService } from '@/services/message.service'
import tableMixin from '@/mixins/table2.mixin'
import moment from 'moment'

export default {
  mixins: [tableMixin],
  bem: {
    b: 'custom-decorate-product-table-select'
  },
  props: {
    title: {
      type: String
    },
    /**
     * 最大选择数量
     */
    max: {
      type: Number,
      default: 10
    }
  },

  serviceInject() {
    return {
      messageService: MessageService,
      service: RecommendCourseTableSelectService
    }
  },
  rxState() {
    return {
      loading: this.service.loading$,
      list: this.service.list$,
      page: this.service.page$
    }
  },

  data() {
    return {
      show: false,
      customQuery: {
        course_type: 1
      }
    }
  },
  computed: {
    columns() {
      const columnsMap = {
        1: TeamCoursecolumns,
        2: PersonalCoursecolumns,
        3: SmallCoursecolumns
      }
      return columnsMap[this.searchQuery.course_type](this)
    },
    fnLoading() {
      const loadingMap = {
        1: this.loading.getTeamCourseList,
        2: this.loading.getPersonalCourseList,
        3: this.loading.getSmallCourseList
      }
      return loadingMap[this.searchQuery.course_type]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    moment,
    getList() {
      console.log('我是新的推荐课程', this.searchQuery.course_type)
      switch (this.searchQuery.course_type) {
        case 1:
          this.service.getTeamCourseList(this.searchQuery).subscribe()
          break
        case 2:
          this.service.getPersonalCourseList(this.searchQuery).subscribe()
          break
        case 3:
          this.service.getSmallCourseList(this.searchQuery).subscribe()
          break
      }
    },
    onSubmit() {
      const data = {
        selected: this.selectedRowKeys,
        selectedRows: this.selectedRows || []
      }
      if (this.handlerValidate && !this.handlerValidate(data)) return
      this.show = false
      console.log('complete', data)
      this.handlerSubmit && this.handlerSubmit(data)
      this.$emit('complete', data)
    },
    onCancel() {
      this.show = false
    },
    handlerValidate() {
      if (this.selectedRowKeys.length > this.max) {
        this.messageService.error({
          content: '当前数量已达上限，请在删除后重新添加'
        })
        return false
      }
      return true
    }
  }
}
</script>
