<template>
  <main class="page-shop-product-team__table">
    <st-table
      class="mg-t16"
      rowKey="id"
      :columns="columns"
      :page="page"
      :dataSource="list"
      :loading="loading.getList"
      @change="onTableChange"
    >
      <template slot="course_name" slot-scope="text, record">
        <a
          href="javascript:;"
          v-if="record.auth['shop:product:team_course|get']"
          @click="onClickCourseInfo(record.id)"
        >
          {{ text }}
        </a>
        <span v-else>{{ text }}</span>
      </template>
      <a-rate
        slot="strength_level"
        slot-scope="strength_level"
        :defaultValue="strength_level"
        disabled
      />
      <div slot="action" slot-scope="text, record">
        <st-table-actions>
          <a
            href="javascript:;"
            v-if="record.auth['shop:product:team_course|get']"
            class="mg-r8"
            @click="onClickCourseInfo(record.id)"
          >
            详情
          </a>
          <a
            href="javascript:;"
            v-if="record.auth['shop:product:team_course|edit']"
            @click="onClickEditCourseInfo(record.id)"
          >
            编辑
          </a>

          <a v-if="record.auth['shop:product:team_course|del']">
            <st-popconfirm
              :title="
                '一旦删除则无法恢复，确认删除' + record.course_name + '？'
              "
              @confirm="onConfirmDeleteCourse(record)"
            >
              删除
            </st-popconfirm>
          </a>
        </st-table-actions>
      </div>
    </st-table>
  </main>
</template>

<script>
import tableMixin from '@/mixins/table.mixin'
import { columns } from './shop.config'
import { ListService } from '../list.service'
export default {
  name: 'TeamTableShop',
  mixins: [tableMixin],
  data() {
    return {
      columns
    }
  },
  serviceInject() {
    return {
      service: ListService
    }
  },
  rxState() {
    return {
      list: this.service.list$,
      page: this.service.page$,
      loading: this.service.loading$
    }
  },
  methods: {
    onClickCourseInfo(id) {
      this.$router.push({
        name: 'shop-product-course-manage-team-info',
        query: {
          courseId: id
        }
      })
    },
    onClickEditCourseInfo(id) {
      this.$router.push({
        name: 'shop-product-course-manage-team-edit',
        query: {
          id
        }
      })
    },
    onConfirmDeleteCourse(record) {
      this.$emit('delete-course', record)
    }
  }
}
</script>
