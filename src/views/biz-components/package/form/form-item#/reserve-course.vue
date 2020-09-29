<template>
  <div
    class="biz-package-form__course-select"
    :class="{ 'package-fix__course-list': packageAttr === 3 }"
  >
    <st-form-table>
      <thead>
        <tr>
          <th :width="item.width" :key="item.dataIndex" v-for="item in columns">
            {{ item.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            :class="
              courseList.length === 0
                ? 'biz-package-form__has-not-data'
                : 'has-data'
            "
            :colspan="columns.length"
            class="st-form-table__add"
          >
            <st-button
              type="dashed"
              icon="add"
              @click="handleAdd"
              class="biz-package-form__course-select-button"
            >
              {{
                courseType === 'team'
                  ? '选择支持预约的团体课'
                  : '选择支持预约的私教课'
              }}
            </st-button>
          </td>
        </tr>

        <tr style="background-color: #fff;">
          <td
            v-if="courseList.length"
            style="padding: 0;"
            :colspan="columns.length"
          >
            <!-- 为什么不使用st-table 因为使用它翻到第二页输入表单会跳到第一页 -->
            <a-table
              pageMode="client"
              :class="{
                'biz-package-form__has-data': courseList.length
              }"
              :pagination="pagination"
              class="biz-package-form__course-select-table"
              rowKey="course_id"
              :columns="columns"
              :dataSource="courseList"
            >
              <!-- 教练等级 私教-->
              <template slot="coach_level_ids" slot-scope="text, record">
                <a-popover
                  v-model="record.visible"
                  placement="bottom"
                  trigger="click"
                >
                  <a-checkbox-group
                    slot="content"
                    @change="onChangeCoachLevel(record, $event)"
                    v-model="record.coach_level_ids"
                  >
                    <ul>
                      <li
                        class="mg-b8"
                        v-for="item in form.coachList"
                        :key="item.value"
                      >
                        <a-checkbox :value="item.value">
                          {{ item.label }}
                        </a-checkbox>
                      </li>
                    </ul>
                    <div>
                      <a @click="onBatchCoachLevel(record.coach_level_ids)">
                        复制到全部
                      </a>
                    </div>
                  </a-checkbox-group>
                  <a href="">
                    {{ record.coachLevelName || '全部等级' }}
                    <st-icon class="icon-12" type="down-small" />
                  </a>
                </a-popover>
              </template>
              <!-- 预约课程扣除次数 范围内限次-->
              <template slot="reduce_times" slot-scope="text, record">
                <st-input-number
                  v-model="record.reduce_times"
                  style="width: 114px"
                >
                  <template slot="addonAfter">次</template>
                </st-input-number>
                <a class="mg-l4" @click="onBatchReserve(record.reduce_times)">
                  复制到全部
                </a>
              </template>
              <!-- 参考单价/元  固定课程-->
              <template slot="course_unit_price" slot-scope="text, record">
                <st-input-number v-model="record.course_unit_price">
                  <template slot="addonAfter" style="width: 114px">元</template>
                </st-input-number>
              </template>
              <!-- 课程次数 固定课程 -->
              <template slot="course_times" slot-scope="text, record">
                <st-input-number
                  v-model="record.course_times"
                  style="width: 114px"
                >
                  <template slot="addonAfter">次</template>
                </st-input-number>
              </template>
              <st-table-actions slot="action" slot-scope="text, record">
                <a @click="onDelete(record)">
                  删除
                </a>
              </st-table-actions>
            </a-table>
          </td>
        </tr>
      </tbody>
    </st-form-table>
  </div>
</template>

<script>
import { columns, dataSource } from './reserve-course.config'
import SelectCourse from '@/views/biz-modals/package/select-course'
export default {
  name: 'CourseSelectFormItem',
  inject: ['form'],
  data() {
    return {
      visible: false,
      cacheCoachId: -1,
      dataSource: []
    }
  },
  modals: {
    SelectCourse
  },
  props: {
    courseType: {
      type: String,
      default: 'team'
    },
    initDataSource: {
      type: Array,
      default: () => {}
    }
  },
  watch: {
    dataSource: {
      handler(newValue) {
        const course = newValue.map(item => {
          const {
            course_id,
            course_name,
            course_times,
            course_unit_price,
            reduce_times,
            coach_level_ids
          } = item

          return this.courseType === 'team'
            ? {
                course_id,
                course_name,
                course_times,
                course_unit_price,
                reduce_times
              }
            : {
                course_id,
                course_name,
                course_times,
                course_unit_price,
                reduce_times,
                coach_level_ids
              }
        })
        this.$emit('change', course)
      },
      deep: true
    }
  },
  computed: {
    pagination() {
      return {
        total: this.courseList.length,
        pageSize: 20,
        pageSizeOptions: ['10', '20', '30', '40'],
        showSizeChanger: true,
        showTotal: () => `共${this.courseList.length}条`
      }
    },
    isShop$() {
      return this.form.isShop$
    },
    singleShops() {
      return [this.$route.query.app_shop_id]
    },
    packageAttr() {
      return this.form.packageAttr
    },
    allCoachLevelIds() {
      return this.form.coachList.map(ele => ele.value)
    },
    formVueData() {
      return this.form.form
    },
    useRange() {
      return this.isShop$ ? 1 : this.form.useRange
    },
    columns,
    courseList() {
      return [...this.dataSource]
    }
  },
  methods: {
    // 应用到本页
    onBatchCoachLevel(ids) {
      this.dataSource = this.dataSource.map(item => {
        this.$set(item, 'coach_level_ids', ids)
        this.$set(item, 'coachLevelName', this.getCoachLevelName(ids))
        return item
      })
    },
    // 返回教练等级名用于列表展示
    getCoachLevelName(ids) {
      if (ids.length === this.form.coachList.length) return '全部等级'
      return this.form.coachList
        .filter(item => ids.includes(item.value))
        .map(item => item.label)
        .toString()
    },
    onChangeCoachLevel(record, $event) {
      // 当教练只剩下一个的时候，缓存教练，变化到零的时候再次添加进去
      if (record.coach_level_ids.length === 1) {
        this.cacheCoachId = $event
      }
      // 为零就补进去
      if (record.coach_level_ids.length === 0) {
        this.$set(record, 'coach_level_ids', this.cacheCoachId)
      }
      this.$set(record, 'coachLevelName', this.getCoachLevelName($event))
    },
    onBatchReserve(value) {
      this.dataSource = this.dataSource.map(item => {
        this.$set(item, 'reduce_times', value)
        return item
      })
    },
    onDelete(record) {
      this.dataSource = this.dataSource.filter(
        item => !(item.course_id === record.course_id)
      )
    },
    openModal() {
      const { dataSource, courseType, useRange, formVueData } = this
      const title =
        courseType === 'team' ? '选择支持预约的团体课' : '选择支持预约的私教课'
      const useShopList =
        useRange === 1
          ? this.singleShops
          : formVueData.getFieldValue('use_shop_list')
      this.$modalRouter.push({
        name: 'select-course',
        props: {
          initDataSource: dataSource,
          title,
          useRange,
          courseType: this.courseType,
          useShopList
        },
        on: {
          done: courseList => {
            this.dataSource =
              this.courseType === 'team'
                ? courseList
                : courseList.map(item => {
                    this.$set(item, 'coach_level_ids', this.allCoachLevelIds)
                    return item
                  })
            this.dataSource = this.dataSource.map(item => {
              !item.reduce_times && this.$set(item, 'reduce_times', 1)
              return item
            })
          }
        }
      })
    },
    handleAdd() {
      this.openModal()
    }
  },
  mounted() {
    this.dataSource = this.initDataSource
  }
}
</script>
