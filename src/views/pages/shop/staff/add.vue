<template>
  <st-panel app>
    <a-row :class="bstep()" class="mg-b48 mg-t48" :gutter="8">
      <a-col offset="1" :span="stepsSpan">
        <a-steps :current="currentIndex">
          <a-step
            v-for="item in stepArr"
            :key="item.key"
            :title="item.title"
            class="cursor-pointer"
          />
        </a-steps>
      </a-col>
    </a-row>
    <staff-detail-basics
      v-if="currentIndex == 0"
      :codeList="codeList"
      :roleList="roleList"
      @addStep="addCoachInfo"
      @deletStep="deletStep"
    />
  </st-panel>
</template>

<script>
import StaffDetailBasics from './add#/add-detail-basicsInfo'
import { MessageService } from '@/services/message.service'
import { AddService } from './add.service'
export default {
  serviceInject() {
    return {
      messageService: MessageService,
      addService: AddService
    }
  },
  rxState() {
    return {
      codeList: this.addService.codeList$,
      roleList: this.addService.roleList$
    }
  },
  name: 'addDetail',
  components: {
    StaffDetailBasics
  },
  bem: {
    b: 'page-add-staff',
    bstep: 'page-add-staff-steps',
    bHeader: 'default-brand-header'
  },
  data() {
    return {
      stepsSpan: 12,
      currentIndex: 0,
      stepArr: [
        {
          title: '基础信息',
          key: 1
        },
        {
          title: '详细信息',
          key: 2
        }
      ]
    }
  },
  methods: {
    // 删除步骤轴
    deletStep(e) {
      this.stepsSpan = 12
      let index = this.stepArr.findIndex((value, index, arr) => {
        return value.title === `${this.$c('coach')}信息`
      })
      if (index === -1) return
      this.stepArr.pop()
    },
    // 新增步骤轴
    addCoachInfo(e) {
      this.stepsSpan = 18
      this.stepArr.push({
        title: `${this.$c('coach')}信息`,
        key: 3
      })
    },
    goNext(e) {
      // 切换提交信息
      let currentIndex = this.currentIndex
      console.log(currentIndex)
      this.currentIndex = currentIndex + 1
      if (this.currentIndex === 3) {
        this.currentIndex = 0
      }
    }
  }
}
</script>
