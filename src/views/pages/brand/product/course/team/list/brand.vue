<template>
  <div class="page-shop-sale-list-brand">
    <header>
      <div
        class="page-shop-sale-list-brand__opreation page-shop-sale-list__opreation"
      >
        <st-button
          icon="add"
          type="primary"
          v-if="auth.add"
          @click="addPersonalCourse"
        >
          新增团体课
        </st-button>
        <div>
          <a-select
            :defaultValue="-1"
            v-model="$searchQuery.category_id"
            class="mg-r16"
            style="width: 160px"
            :options="categoryList"
            @change="onSingleSearch('category_id', $event)"
          />
        </div>
      </div>
    </header>
    <main class="page-shop-sale-list-brand__table mg-t8">
      <st-table
        class="mg-t16"
        rowKey="id"
        :page="page"
        :columns="columns"
        :dataSource="list"
        :loading="loading.getList"
        @change="onTableChange"
      >
        <a
          href="javascript:;"
          slot="course_name"
          slot-scope="text, record"
          @click="onClickCourseInfo(record.id)"
        >
          {{ text }}
        </a>
        <a-rate
          slot="strength_level"
          slot-scope="strength_level"
          :defaultValue="strength_level"
          disabled
        />
        <!-- 操作 -->
        <div slot="action" slot-scope="text, record">
          <st-table-actions>
            <a
              href="javascript:;"
              v-if="record.auth['brand:product:team_course|get']"
              class="mg-r8"
              @click="onClickCourseInfo(record.id)"
            >
              详情
            </a>
            <a
              href="javascript:;"
              v-if="record.auth['brand:product:team_course|edit']"
              @click="onClickEditCourseInfo(record.id)"
            >
              编辑
            </a>
            <a v-if="record.auth['brand:product:team_course|del']">
              <st-popconfirm
                :title="
                  '一旦删除则无法恢复，确认删除' + record.course_name + '？'
                "
                @confirm="onDeleteCourse(record)"
                okText="确定"
                cancelText="取消"
              >
                删除
              </st-popconfirm>
            </a>
          </st-table-actions>
        </div>
      </st-table>
    </main>
  </div>
</template>

<script>
import { BrandService } from './brand.service'
import { ListService } from '../list.service'
import tableMixin from '@/mixins/table.mixin'
import { columns } from './brand.config'
export default {
  name: 'TeamCourseBrand',
  mixins: [tableMixin],
  serviceInject() {
    return {
      brandService: BrandService
    }
  },
  rxState() {
    return {
      categoryList: this.brandService.categoryList$,
      auth: this.brandService.auth$,
      list: this.brandService.list$,
      page: this.brandService.page$,
      loading: this.brandService.loading$
    }
  },
  data() {
    return {
      columns
    }
  },
  methods: {
    onDeleteCourse(record) {
      this.brandService.deleteCourse(record.id).subscribe(() => {
        this.$router.reload()
      })
    },
    addPersonalCourse() {
      this.$router.push({ name: 'brand-product-course-team-add' })
    },
    onClickCourseInfo(id) {
      this.$router.push({
        name: 'brand-product-course-team-info',
        query: {
          courseId: id
        }
      })
    },
    onClickEditCourseInfo(id) {
      this.$router.push({
        name: 'brand-product-course-team-edit',
        query: {
          id
        }
      })
    }
  }
}
</script>
