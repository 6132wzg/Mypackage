<template>
  <st-modal
    title="解除门店关系"
    size="small"
    v-model="show"
    class="model-leave-store-container"
  >
    <staff-info :staff="staff"></staff-info>
    <template v-if="operate === LEAVE_CURRENT_SHOP.OPERATE_TYPE">
      <a-row :gutter="8" class="mg-t16">
        <a-col :lg="24">
          <p class="model-leave-store-container_tip">
            确认此员工不在{{ '门店名称' }}进行相关工作
          </p>
        </a-col>
      </a-row>
      <template slot="footer">
        <st-button class="mg-r8" @click="onCancel">取消</st-button>
        <st-button type="primary" @click="onSubmit">确认</st-button>
      </template>
    </template>
    <template v-else>
      <a-row :gutter="8" class="mg-t16" v-if="list.length !== 0">
        <a-col :lg="24">
          <div class="model-leave-store-container_info">
            <div class="model-leave-store-container_same mg-b8">
              该员工在本门店还有未完成的事项，无法解除
            </div>
            <template v-for="item in list">
              <div
                :key="item.type"
                class="model-leave-store-container_same mg-b8"
              >
                {{ item.num }}{{ item.name }}
              </div>
            </template>
          </div>
        </a-col>
      </a-row>
      <template slot="footer">
        <st-button type="primary" @click="onCancel">知道了</st-button>
      </template>
    </template>
  </st-modal>
</template>
<script>
import StaffInfo from './staff-info'
import { LeaveStoreService } from './leave-current-shop.service'
import { LEAVE_CURRENT_SHOP } from '@/constants/shop-staff/leave-current-shop'
export default {
  name: 'LeaveCurrentStore',
  serviceInject() {
    return {
      service: LeaveStoreService
    }
  },
  rxState() {
    return {
      list: this.service.list$,
      operate: this.service.operate$
    }
  },
  props: {
    staff: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      LEAVE_CURRENT_SHOP,
      show: false
    }
  },
  mounted() {
    this.service.getInfo(this.staff.id).subscribe()
  },
  components: {
    StaffInfo
  },
  methods: {
    onCancel() {
      this.show = false
    },
    onSubmit() {
      this.service.leaveStore(this.staff.id).subscribe(res => {
        this.show = false
      })
    }
  }
}
</script>
