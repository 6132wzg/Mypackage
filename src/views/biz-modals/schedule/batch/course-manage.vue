<template>
  <st-modal
    :title="`${type === 'small' ? '私教小' : ''}团课周课表管理`"
    @ok="save"
    okText="确定"
    v-model="show"
    width="894px"
    wrapClassName="modal-schedule-batch-course-manage"
  >
    <div class="border-box">
      <st-form-table hoverable :isEmpty="false">
        <thead>
          <tr>
            <th>创建时间</th>
            <th>课表名称</th>
            <th>团课类型</th>
            <th>最大排课节数</th>
            <th v-if="type !== 'small'">预约高级设置</th>
            <th>创建人</th>
            <th style="width:120px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              :colspan="type === 'small' ? '6' : '7'"
              class="st-form-table__add"
            >
              <st-button type="dashed" icon="add" block @click="addCourse">
                新增
              </st-button>
            </td>
          </tr>
          <template v-for="(item, index) in teamTemplateList">
            <tr :key="index">
              <td>{{ item.created_time }}</td>
              <td>{{ item.template_name }}</td>
              <td>{{ item.course_type_name }}</td>
              <td>{{ item.max_number ? item.max_number : '--' }}</td>
              <td v-if="type !== 'small'">{{ item.reserve_setting_text }}</td>
              <td>{{ item.operator_name }}</td>
              <td>
                <template>
                  <a class="mg-r16" @click="editRow(item.id)">
                    编辑
                  </a>
                  <!-- 仅删除本地数据 -->
                  <a @click="delRow(item.id, index)">
                    删除
                  </a>
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </st-form-table>
    </div>
  </st-modal>
</template>
<script>
export default {
  name: 'courseManageService',
  props: {
    teamTemplateList: {
      type: Array,
      default: () => {
        return []
      }
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false,
      idArr: []
    }
  },
  methods: {
    // 新增课表
    addCourse() {
      this.$emit('add')
      this.show = false
    },
    // 编辑课表
    editRow(id) {
      this.$emit('edit', id)
      this.show = false
    },
    // 点击删除，暂存删除id
    delRow(id, index) {
      this.teamTemplateList.splice(index, 1)
      this.idArr.push(id)
    },
    // 确定删除
    save() {
      this.$emit('save', this.idArr)
      this.show = false
    }
  }
}
</script>
