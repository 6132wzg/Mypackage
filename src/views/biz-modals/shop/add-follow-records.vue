<template>
  <st-modal title="新增跟进记录" @ok="save" v-model="show" size="small">
    <st-form :form="form" labelWidth="90px">
      <a-row :gutter="8" class="mg-t8">
        <a-col :lg="24">
          <st-form-item label="跟进记录">
            <st-textarea
              :maxlength="200"
              placeholder="填写跟进方式"
              v-decorator="decorators.follow_content"
            />
          </st-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="8" class="mg-t8">
        <a-col :lg="24">
          <st-form-item label="跟进方式">
            <a-select
              placeholder="请选择跟进方式"
              v-decorator="decorators.follow_way"
            >
              <a-select-option :value="1">电话</a-select-option>
              <a-select-option :value="2">微信</a-select-option>
              <a-select-option :value="3">客户到访</a-select-option>
              <a-select-option :value="4">上门拜访</a-select-option>
            </a-select>
          </st-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="8" class="mg-t8">
        <a-col :lg="24">
          <st-form-item label="跟进状态">
            <a-select
              placeholder="请选择跟进状态"
              v-decorator="decorators.follow_status"
            >
              <a-select-option :value="1">已电话</a-select-option>
              <a-select-option :value="2">已邀约</a-select-option>
              <a-select-option :value="3">邀约成功</a-select-option>
              <a-select-option :value="4">实际到访</a-select-option>
              <a-select-option :value="5">已签约</a-select-option>
              <a-select-option :value="6">已购卡</a-select-option>
            </a-select>
          </st-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="8" class="mg-t8">
        <a-col :lg="24">
          <st-form-item label="下次跟进时间">
            <a-date-picker
              style="width:100%"
              placeholder="请选择下次跟进时间"
              format="YYYY-MM-DD HH:mm:ss"
              :disabledDate="disabledDate"
              :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
              v-decorator="decorators.follow_next_time"
            />
          </st-form-item>
        </a-col>
      </a-row>
    </st-form>
  </st-modal>
</template>
<script>
// TODO: 枚举值要从后端获取，等代码合并后修改
import { AddFollowRecordsService } from './add-follow-records.service'
import { ruleOptions } from './add-follow-records.config'
import moment from 'moment'
export default {
  serviceInject() {
    return {
      Service: AddFollowRecordsService
    }
  },
  name: 'addFollowRecords',
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false
    }
  },
  methods: {
    moment,
    range(start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },
    disabledDate(current) {
      // Can not select days before today and today
      return (
        current && current.format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')
      )
    },

    disabledDateTime() {
      return {
        disabledHours: () => this.range(0, 24).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56]
      }
    },
    getMemberFollowHistory(data) {
      let self = this
      self.Service.getMemberFollowHistory(self.$searchQuery.id, data).subscribe(
        state => {
          self.getData = state.info
          self.show = false
          self.$emit('done', true)
        }
      )
    },

    save(e) {
      e.preventDefault()
      this.form.validate().then(values => {
        this.getMemberFollowHistory(values)
      })
    }
  },

  watch: {}
}
</script>
