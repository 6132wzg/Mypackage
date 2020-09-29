<template>
  <st-modal :title="title" @ok="onOk" v-model="show">
    <div :class="course()">
      <div :class="course('search')">
        <div></div>
        <div>
          <a-select
            :class="course('search-select')"
            v-model="searchData.course_type"
            :options="courseTypeOptions$"
            @change="onChange"
            style="width:148px"
            class="mg-r16"
          ></a-select>
          <st-input-search
            @search="onSearch"
            v-model="searchData.search"
            :class="course('search-input')"
            placeholder="搜索课程"
          />
        </div>
      </div>
      <st-container class="mg-t16">
        <st-table
          :columns="columns"
          :dataSource="courseList$"
          :simplePage="true"
          rowKey="course_id"
          :page="page$"
          :alertSelection="{ onReset: onClear }"
          :rowSelection="{ selectedRowKeys, onChange: onSelectionChange }"
          :loading="loading$.getCourseList"
          pageMode="client"
        >
          <template slot="shop_name" slot-scope="text">
            <st-overflow-text
              :value="text"
              max-width="180px"
            ></st-overflow-text>
          </template>
        </st-table>
      </st-container>
    </div>
  </st-modal>
</template>

<script>
// TODO: 暂时是前端翻页，准备做后端翻页。
import tableMixin from '@/mixins/table.mixin'
import { columns } from './select-course.config'
import { SelectCourseService } from './select-course.service'
import { cloneDeep, uniqBy } from 'lodash'
export default {
  name: 'ModalSelectCourse',
  bem: {
    course: 'biz-select-course'
  },
  serviceInject() {
    return {
      service: SelectCourseService
    }
  },
  rxState() {
    const { courseTypeOptions$, page$, courseList$, loading$ } = this.service
    return { courseTypeOptions$, page$, courseList$, loading$ }
  },
  computed: {
    columns
  },
  mixins: [tableMixin],
  data() {
    return {
      show: false,
      courseList: [],
      selectedRowKeys: [],
      searchData: {
        search: '',
        course_type: '',
        use_range: 3,
        use_shop_list: []
      }
    }
  },
  props: {
    title: {
      type: String,
      default: '选择团课'
    },
    courseType: {
      type: String,
      default: ''
    },
    useRange: {
      type: Number
    },
    useShopList: {
      type: Array,
      default: () => []
    },
    initDataSource: {
      type: Array,
      default: () => [
        {
          course_id: 1,
          shop_id: 1,
          shop_name:
            '常青一点都不帅，银鞍照白马，更换名字测11试，更换名字测12试，kael，kael1，关店测试，超超的三体云动门店，云云的门店测试',
          course_name: '团体课测试',
          course_category: '团体课程',
          course_type: '团体课'
        },
        {
          course_id: 2,
          shop_id: 1,
          shop_name: '银鞍照白马',
          course_name: '团体课测试1',
          course_category: '团体课程',
          course_type: '团体课'
        },
        {
          course_id: 5,
          shop_id: 0,
          shop_name: '银鞍照白马，更换名字测11试',
          course_name: '新增团体课-测试',
          course_category: '团体课程',
          course_type: '团体课'
        }
      ]
    }
  },
  methods: {
    initSelectedRowKeys() {
      this.selectedRows = cloneDeep(this.initDataSource)
      this.selectedRowKeys = this.initDataSource.map(item => item.course_id)
    },
    // 初始化搜索数据
    initSearchData() {
      this.searchData = {
        type: this.courseType,
        platform: 'brand',
        search: '',
        course_type: -1,
        use_range: this.useRange,
        use_shop_list: this.useShopList
      }
    },
    init() {
      this.initSelectedRowKeys()
      this.initSearchData()
      this.getCourseList()
      this.getCourseTypeOptions()
    },
    onClear() {
      console.log('onClear')
      this.onSelectionReset()
    },
    onSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      //  修复antd tablebug ，当搜索后返回的搜索之前selectedRows不会返回
      this.selectedRows = uniqBy(
        [...this.selectedRows, ...selectedRows],
        'course_id'
      )
    },
    // 请求课程列表
    getCourseList() {
      return this.service.getCourseList(this.searchData).subscribe(res => {
        // 将已选中的数据与请求回来的列表比对，选中的默认勾上
      })
    },
    getCourseTypeOptions() {
      return this.service.getCourseTypeList().subscribe()
    },
    // 课程类型的选择
    onChange() {
      this.getCourseList()
    },
    // 课程的模糊搜索
    onSearch() {
      this.getCourseList()
    },
    // 选中课程提交
    onOk() {
      // 最后传出去的出去原来被选中的和重复应该过滤掉
      let courseList = this.selectedRows
      this.$emit('done', courseList)
      this.show = false
    }
  },
  created() {
    this.init()
  }
}
</script>
