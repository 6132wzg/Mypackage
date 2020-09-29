<template>
  <div :class="bPos()">
    <!-- pos机 -->
    <a-row :gutter="24" style="width: 100%">
      <a-col
        :xxl="6"
        :xl="8"
        :md="8"
        :xs="8"
        v-for="device in devices"
        :key="device.id"
      >
        <div :class="bPos('item')">
          <div :class="bPos('info')">
            <!-- 上部 -->
            <div :class="bPos('info-base')">
              <img src="~@/assets/img/brand/app/pos-icon.png" alt="" />
              <div :class="bPos('info-base-sub')">
                <div :class="bPos('info-base-sub-device-name')">
                  {{ device.terminal_name }}
                </div>
                <div :class="bPos('info-base-sub-device-id')">
                  {{ device.terminal_no }}
                </div>
              </div>
            </div>
            <!-- 下部 -->
            <div :class="bPos('info-detail')">
              <div :class="bPos('info-detail-item')">
                <div :class="bPos('info-detail-item-label')">
                  所属门店
                </div>
                <div :class="bPos('info-detail-item-value')">
                  {{ device.shop_name }}
                </div>
              </div>
              <div :class="bPos('info-detail-item')">
                <div :class="bPos('info-detail-item-label')">
                  添加时间
                </div>
                <div :class="bPos('info-detail-item-value')">
                  {{ device.add_time }}
                </div>
              </div>
            </div>
          </div>
          <!-- 下部 -->
          <div :class="bPos('action')">
            <div :class="bPos('action-item')" @click="handleEditPos(device)">
              更改基础信息
            </div>
          </div>
        </div>
      </a-col>
      <a-col :xxl="6" :xl="8" :md="8" :xs="8">
        <div
          :class="bPos('item')"
          class="brand-app-pos-device__item-add"
          @click="handleAddPos"
        >
          <div class="brand-app-pos-device__item-add__tip">
            <st-icon type="add"></st-icon>
            &nbsp;
            <span>添加POS机</span>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import BrandAppPosAddPos from '@/views/biz-modals/brand/app/pos/add-pos'
import BrandAppPosEditPos from '@/views/biz-modals/brand/app/pos/edit-base-info'
import { DeviceService } from './device.service'
import { MessageService } from '@/services/message.service'
export default {
  name: '',

  bem: {
    bPos: 'brand-app-pos-device'
  },

  serviceInject() {
    return {
      messageService: MessageService,
      service: DeviceService
    }
  },

  rxState() {
    return {
      devices: this.service.list$
    }
  },

  components: {},

  modals: { BrandAppPosAddPos, BrandAppPosEditPos },

  props: {},

  data() {
    return {}
  },

  computed: {},

  async: {},

  mounted() {},

  methods: {
    handleEditPos(pos) {
      this.$modalRouter.push({
        name: 'brand-app-pos-edit-pos',
        props: {
          terminal_id: pos.id
        },
        on: {
          success: () => {
            this.messageService.success({ content: 'pos机信息编辑成功' })
            this.$router.reload()
            console.log('success')
          }
        }
      })
    },
    handleAddPos() {
      this.$modalRouter.push({
        name: 'brand-app-pos-add-pos',
        props: {},
        on: {
          success: () => {
            this.messageService.success({ content: 'pos机添加成功' })
            this.$router.reload()
            console.log('success')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
