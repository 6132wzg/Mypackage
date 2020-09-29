<template>
  <div :class="b({ active: isActive, canDrag: !isEdit && !isAdd })">
    <a-tooltip :class="b('draggable')" placement="top">
      <template slot="title">
        <span>拖拽调整顺序</span>
      </template>
      <div>
        <st-icon size="16px" class="tooltip-draggable" type="tuozhuai" />
      </div>
    </a-tooltip>
    <div :class="b('info')" v-if="!isEdit && !isAdd">
      <div :class="b('info-left')">
        <div :class="b('info-base')">
          <span :class="b('info-base-free')">
            空闲{{ info.free_cabinet_count }}
          </span>
          <span :class="b('info-base-total')">/总数{{ info.cabinet_num }}</span>
        </div>
        <div :class="b('info-detail')">
          <div :class="b('info-detail-content')">
            {{ info.area_name }}
            <span v-if="auth.areaEdit" @click="onChangeEditStatus(true)">
              <st-icon size="12px" color="#9BACB9" type="edit"></st-icon>
            </span>
          </div>
        </div>
      </div>
      <div
        :class="b('info-right')"
        v-if="auth.areaDel && isActive"
        @click.stop="handleDelArea"
      >
        <st-icon size="14px" color="#FF5E41" type="delete" />
      </div>
    </div>
    <div :class="b('info')" v-else>
      <cabinet-edit
        :id="info.id"
        :name="info.area_name"
        :isEdit="!isAdd"
        @refresh="$listeners.refresh"
        @onChangeEditStatus="onChangeEditStatus"
      ></cabinet-edit>
    </div>
  </div>
</template>
<script>
import { MessageService } from '@/services/message.service'
import { PatternService } from '@/services/pattern.service'
import { AreaService } from '../area.service'
import CabinetEdit from './edit'
export default {
  name: 'EditCabinetArea',
  bem: {
    b: 'st-cabinet-area'
  },
  components: { CabinetEdit },
  serviceInject() {
    return {
      messageService: MessageService,
      cabinetService: AreaService,
      pattern: PatternService
    }
  },
  rxState() {
    return {
      auth: this.cabinetService.auth$
    }
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    isActive: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isEdit: false,
      canDrag: true,
      areaName: ''
    }
  },
  watch: {
    info: {
      handler(newV) {
        if (!newV.isEdit) {
          this.isEdit = false
        }
      },
      deep: true
    }
  },
  methods: {
    onChangeEditStatus(status) {
      if (this.isAdd) {
        this.$emit('onAddStatusChange', status)
        return false
      }
      if (status) {
        this.$emit('onEditStatusChange', {
          id: this.info.id
        })
      }
      this.isEdit = status
    },
    handleDelArea() {
      this.cabinetService.del(this.info.id).subscribe(res => {
        console.log('储物柜区域删除')
        this.$emit('refresh')
      })
    }
  }
}
</script>
