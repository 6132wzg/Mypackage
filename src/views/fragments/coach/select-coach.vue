<template>
  <div>
    <st-form-table>
      <thead>
        <tr>
          <th>{{ $c('coach') }}</th>
          <th>{{ $c('coach') }}等级</th>
          <th>工作性质</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="4" class="st-form-table__add">
            <st-button
              type="dashed"
              icon="add"
              block
              v-modal-link="{
                name: 'coach-table-select',
                props: {
                  max: 50,
                  isCoachFilter: false,
                  defaultSelectedRows: list,
                  defaultSelectedRowKeys: selected,
                  title: `选择${$c('coach')}`,
                  defalutQuery: {
                    coach_identity: 4,
                    shop_ids:
                      shopIds && shopIds.length ? shopIds.join(',') : undefined
                  }
                },
                on: {
                  complete: onSelectComplete
                }
              }"
            >
              新增{{ $c('coach') }}
            </st-button>
          </td>
        </tr>
        <tr v-for="(item, index) in list" :key="index">
          <td>{{ item.name }}</td>
          <td>{{ item.level }}</td>
          <td>{{ item.nature_work }}</td>
          <td>
            <a @click="delTableRecord(item.id)">删除</a>
          </td>
        </tr>
      </tbody>
    </st-form-table>
  </div>
</template>
<script>
import { SelectCoachService } from './select-coach.service'
import CoachTableSelect from '@/views/biz-modals/staff/coach-table-select'
export default {
  name: 'SelectCoach',
  serviceInject() {
    return {
      selectCoachService: SelectCoachService
    }
  },
  props: {
    coachIds: {
      type: Array,
      default() {
        return []
      }
    },
    shopIds: {
      type: Array,
      default() {
        return []
      }
    },
    type: {
      type: String,
      default: ''
    }
  },
  modals: {
    CoachTableSelect
  },
  data() {
    return {
      selected: [],
      list: []
    }
  },
  created() {
    this.selected = this.coachIds
    this.getSelectedList(this.coachIds)
  },
  methods: {
    onSelectComplete(res) {
      const { selected: coachIds } = res
      this.getSelectedList(coachIds)
      this.selected = coachIds
      this.$emit('change', coachIds)
    },
    getSelectedList(coachIds = []) {
      if (coachIds.length) {
        this.selectCoachService
          .getCoachBasic({
            coach_ids: coachIds
          })
          .subscribe(res => {
            this.list = res.coaches
          })
      }
    },
    delTableRecord(id) {
      const { list, selected } = this
      list.forEach((item, index) => {
        if (+item.id === +id) {
          list.splice(index, 1)
        }
      })
      selected.forEach((item, index) => {
        if (+item === +id) {
          selected.splice(index, 1)
        }
      })
      this.list = list
      this.selected = selected
      this.$emit('change', selected)
    }
  }
}
</script>
