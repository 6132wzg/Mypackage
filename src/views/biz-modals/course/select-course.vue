<template>
  <st-modal :title="titleList[type]" @ok="onOk" v-model="show">
    <div :class="course()">
      <div :class="course('search')">
        <a-select
          :class="course('search-select')"
          :getPopupContainer="trigger => trigger.parentNode"
          v-model="searchData.course_type"
          @change="onCourseTypeChange"
        >
          <a-select-option
            v-for="(item, index) in courseTypeList"
            :key="index"
            :value="item.id"
          >
            {{ item.setting_name }}
          </a-select-option>
        </a-select>
        <st-input-search
          @search="getCourseList"
          v-model="searchData.search"
          :class="course('search-input')"
          placeholder="请输入课程名称进行查询"
        />
      </div>
      <div :class="course('all-table')">
        <st-form-table>
          <colgroup v-if="platform === 'brand'">
            <col style="width:20%;" />
            <col style="width:20%;" />
            <col style="width:20%;" />
            <col style="width:20%;" />
            <col style="width:20%;" />
          </colgroup>
          <colgroup v-if="platform === 'shop'">
            <col style="width:25%;" />
            <col style="width:25%;" />
            <col style="width:25%;" />
            <col style="width:25%;" />
          </colgroup>
          <tr class="bg-thead">
            <th class="pl-9">课程类别</th>
            <th v-if="platform === 'brand'">上课门店</th>
            <th>课程类型</th>
            <th>课程名称</th>
            <th class="tg-c" style="text-align:center">操作</th>
          </tr>
          <tbody>
            <tr>
              <td colspan="5">
                <ul
                  :class="course('scroll-content')"
                  v-scrollBar="{ stopPropagation: true }"
                >
                  <li
                    class="table-item "
                    v-for="(item, index) in courseList"
                    :class="{
                      'table-item-brand': platform === 'brand',
                      'bg-row-odd': index % 2 === 0,
                      'bg-row-even': index % 2 !== 0
                    }"
                    :key="item.course_id"
                  >
                    <div class="pl-9">{{ item.course_category }}</div>
                    <div v-if="platform === 'brand'">
                      <st-overflow-text
                        maxWidth="120px"
                        :value="item.shop_name"
                      ></st-overflow-text>
                    </div>
                    <div>{{ item.course_type }}</div>
                    <div>
                      <st-overflow-text
                        max-width="180px"
                        :value="item.course_name"
                      ></st-overflow-text>
                    </div>
                    <div style="text-align: center">
                      <a
                        :disabled="isAddDisabled"
                        :class="{ 'color-text-light': isAddDisabled }"
                        @click="onAdd(item.course_id)"
                      >
                        新增
                      </a>
                    </div>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </st-form-table>
      </div>
      <p :class="course('count')">
        <span>共查到{{ total }}条记录</span>
        <a
          :disabled="isAddDisabled"
          :class="{ 'color-text-light': isAddDisabled }"
          @click="onAllAdd"
        >
          全部新增
        </a>
      </p>
      <p :class="course('selet-course-title')">
        已选定{{ selectCourseList.length }}种课程
        <span v-if="isLimit" class="st-des">
          （最多选择{{ this.FIX_PACKAGE_LIMIT }}种课程）
        </span>
      </p>
      <div :class="course('select-table')">
        <st-form-table>
          <colgroup v-if="platform === 'brand'">
            <col style="width:20%;" />
            <col style="width:20%;" />
            <col style="width:20%;" />
            <col style="width:20%;" />
            <col style="width:20%;" />
          </colgroup>
          <colgroup v-if="platform === 'shop'">
            <col style="width:25%;" />
            <col style="width:25%;" />
            <col style="width:25%;" />
            <col style="width:25%;" />
          </colgroup>
          <tr class="bg-thead">
            <th class="pl-9">课程类别</th>
            <th v-if="platform === 'brand'">上课门店</th>
            <th>课程类型</th>
            <th>课程名称</th>
            <th class="tg-c" style="text-align:center">操作</th>
          </tr>
          <tbody>
            <tr>
              <td colspan="5">
                <ul
                  :class="course('scroll-content')"
                  v-scrollBar="{ stopPropagation: true }"
                >
                  <li
                    class="table-item"
                    v-for="(item, index) in selectCourseList"
                    :class="{
                      'table-item-brand': platform === 'brand',
                      'bg-row-odd': index % 2 === 0,
                      'bg-row-even': index % 2 !== 0
                    }"
                    :key="item.course_id"
                  >
                    <div class="pl-9">{{ item.course_category }}</div>
                    <div v-if="platform === 'brand'">
                      <st-overflow-text
                        maxWidth="120px"
                        :value="item.shop_name"
                      ></st-overflow-text>
                    </div>
                    <div>{{ item.course_type }}</div>
                    <div>
                      <st-overflow-text
                        slot
                        max-width="180px"
                        :value="item.course_name"
                      ></st-overflow-text>
                    </div>
                    <div style="text-align:center">
                      <a @click="onRemove(item.course_id)">删除</a>
                    </div>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </st-form-table>
      </div>
    </div>
  </st-modal>
</template>
<script>
import { MessageService } from '@/services/message.service'
import { SelectCourseService } from './select-course.service'
import { cloneDeep, filter, remove } from 'lodash-es'
import { FIX_PACKAGE_LIMIT } from '@/constants/course/package'
import infiniteScroll from 'vue-infinite-scroll'
export default {
  name: 'SelectCourse',
  serviceInject() {
    return {
      messageService: MessageService,
      selectCourseService: SelectCourseService
    }
  },
  rxState() {
    return {
      addLoading: this.selectCourseService.loading$
    }
  },
  bem: {
    course: 'st-select-course'
  },
  directives: { infiniteScroll },
  props: {
    type: {
      type: String,
      default() {
        return 'team'
      }
    },
    platform: {
      type: String,
      default() {
        return ''
      }
    },
    useShopInfo: {
      type: Object,
      default: () => {}
    },
    courses: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * 是否限定选择课程数量，可传入限制数量（比如固定课程包限定选择10种）,0代表不限制
     */
    isLimit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      FIX_PACKAGE_LIMIT,
      show: false,
      courseTypeList: [],
      /**
       * 最多选择团课数量
       */
      titleList: {
        team: '选择团课',
        personal: '选择私教课'
      },
      searchData: {
        course_type: null,
        search: ''
      },
      TABEL_LOAD_TIME: 200,
      TABEL_LOAD_SIZE: 20,
      courseList: [],
      total: 0,
      busy: true,
      i: 10,
      selectCourseList: [],
      loadCourseList: []
    }
  },
  computed: {
    /**
     * 新增按钮是否可用
     */
    isAddDisabled() {
      return (
        !!this.isLimit &&
        (!this.courseList.length ||
          this.selectCourseList.length >= this.FIX_PACKAGE_LIMIT)
      )
    }
  },
  methods: {
    // loadMore(baseSize) {
    //   console.log(this.i)
    //   this.busy = false
    //   this.i += baseSize
    //   let start = this.i
    //   let end = this.TABEL_LOAD_SIZE + this.i
    //   if (baseSize < 0) {
    //     start = this.i + baseSize
    //     end = this.i
    //   }
    //   console.log(end)
    //   let timer = setTimeout(() => {
    //     this.busy = true
    //     this.loadCourseList = this.$set(this, 'loadCourseList', [
    //       ...this.courseList.slice(start, end)
    //     ])
    //     document.querySelector(
    //       '.st-select-course__scroll-content'
    //     ).scrollTop = 2
    //     if (this.i > this.total) {
    //       clearTimeout(timer)
    //     }
    //   }, this.TABEL_LOAD_TIME)
    // },
    onCourseTypeChange(data) {
      this.searchData.search = ''
      this.searchData.course_type = data
      this.getCourseList()
    },
    onAdd(id) {
      if (this.isAddDisabled) {
        return
      }
      let arr = filter(this.courseList, o => o.course_id === id)
      this.selectCourseList.push(...arr)
      this.filterCourse()
    },
    onAllAdd() {
      if (!this.validate()) {
        return
      }
      this.selectCourseList.push(...cloneDeep(this.courseList))
      this.courseList = []
    },
    /**
     * 判断新增课程数量是否超出上限
     */
    validate() {
      if (
        this.isLimit &&
        this.selectCourseList.length + this.courseList.length >
          FIX_PACKAGE_LIMIT
      ) {
        this.messageService.error({
          content: `最多新增${this.FIX_PACKAGE_LIMIT}种课程，新增失败`
        })
        return false
      }
      return true
    },
    onRemove(id) {
      let arr = cloneDeep(this.selectCourseList)
      remove(arr, o => o.course_id === id)
      this.selectCourseList = arr
      this.getCourseList()
    },
    onOk() {
      this.$emit('ok', { list: cloneDeep(this.selectCourseList) })
      this.show = false
    },
    // 根据已选课程，过滤可选课程
    filterCourse() {
      let arr = cloneDeep(this.courseList)
      this.selectCourseList.forEach(i => {
        remove(arr, o => o.course_id === i.course_id)
      })
      this.courseList = arr
    },
    getCourseType() {
      this.selectCourseService.getCourseTypeList().subscribe(res => {
        this.courseTypeList = cloneDeep(res.list)
        this.searchData.course_type = res.list[0].id
        this.getCourseList()
      })
    },
    // handleScroll() {
    //   let height = document.querySelector('.st-select-course__scroll-content')
    //     .clientHeight
    //   let liHeight = document.querySelector(
    //     '.st-select-course__scroll-content .table-item'
    //   ).clientHeight
    //   let scrollTop = document.querySelector(
    //     '.st-select-course__scroll-content'
    //   ).scrollTop
    //   //滚动条到底部的条件
    //   if (scrollTop === liHeight * this.TABEL_LOAD_SIZE - height) {
    //     console.log(
    //       '1-' +
    //         '距顶部' +
    //         scrollTop +
    //         '可视区高度' +
    //         height +
    //         'li总高度' +
    //         liHeight * this.TABEL_LOAD_SIZE
    //     )
    //     this.loadMore(10)
    //   } else {
    //     console.log('0-' + '距顶部' + scrollTop + '可视区高度' + height)
    //   }
    //   if (scrollTop === 0 && this.i >= 20) {
    //     this.loadMore(-10)
    //   }
    // },
    getCourseList() {
      let form = {
        platform: this.platform,
        type: this.type,
        search: this.searchData.search,
        course_type: this.searchData.course_type
      }
      if (this.platform === 'brand') {
        form = { ...form, ...this.useShopInfo }
      }
      this.selectCourseService.getCourseList(form).subscribe(res => {
        // TODO: 上线一定优化
        this.total = res.list.length
        this.courseList = cloneDeep(res.list)
        // this.loadCourseList = this.$set(this, 'loadCourseList', [
        //   this.courseList.slice(0, this.i)
        // ])
        this.filterCourse()
      })
    }
  },
  created() {
    this.getCourseType()
    this.selectCourseList.push(...this.courses)
  }
}
</script>
