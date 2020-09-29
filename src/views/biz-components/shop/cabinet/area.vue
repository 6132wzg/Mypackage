<template>
  <div :class="b()">
    <div :class="b('title')">
      <div :class="b('title-main')">
        <div :class="b('title-main-desc')">
          区域
        </div>
        <st-button v-if="auth.areaAdd" type="primary" @click="onAddArea">
          新增区域
        </st-button>
      </div>
      <div :class="b('title-sub')">支持拖动排序</div>
    </div>
    <a-spin :spinning="loading.getList">
      <div v-if="isAdd">
        <cabinet-module
          :info="addItem"
          :isActive="false"
          isAdd
          @refresh="onRefresh"
          @onAddStatusChange="onAddStatusChange"
        ></cabinet-module>
      </div>
      <st-draggable
        v-model="list"
        :animation="200"
        @change="onAreaSortChange"
        handle=".st-cabinet-area--canDrag"
      >
        <div
          v-for="item in list"
          :key="item.id"
          @click="onAreaChange(item.id)"
          @mouseMove="onMouseMove"
        >
          <cabinet-module
            :info="item"
            :isActive="item.id === areaId"
            @refresh="onRefresh"
            @onEditStatusChange="onEditStatusChange"
          ></cabinet-module>
        </div>
      </st-draggable>
    </a-spin>
  </div>
</template>

<script>
import { MessageService } from '@/services/message.service'
import { PatternService } from '@/services/pattern.service'
import { AreaService } from './area.service'
import CabinetModule from './components#/module'

import { isEqual } from 'lodash-es'
export default {
  name: '',

  bem: {
    b: 'cabinet-area'
  },

  serviceInject() {
    return {
      messageService: MessageService,
      pattern: PatternService,
      cabinetService: AreaService
    }
  },
  rxState() {
    return {
      auth: this.cabinetService.auth$,
      list: this.cabinetService.list$,
      loading: this.cabinetService.loading$
    }
  },

  components: {
    CabinetModule
  },

  props: {
    value: {
      type: [Number, String],
      default: 0
    }
  },

  data() {
    return {
      isAdd: false,
      addItem: {
        id: 0,
        area_name: ''
      }
    }
  },

  computed: {
    areaId: {
      set(newValue, oldValue) {
        if (isEqual(newValue, oldValue)) return
        this.$emit('change', newValue)
        this.$emit('input', newValue)
      },
      get() {
        return this.value
      }
    }
  },
  watch: {
    value(newV) {
      if (!newV && this.list && this.list.length) {
        this.init()
      }
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init(tag) {
      this.cabinetService.getList().subscribe(res => {
        let list = res.list
        let currentArea
        if (+this.areaId) {
          currentArea = list.filter(item => item.id === +this.areaId)[0]
        } else {
          currentArea = list.length ? list[0] : {}
        }
        if (tag) {
          this.$emit('onlyChangeCurrentArea', currentArea)
        } else {
          this.$emit('changeCurrentArea', currentArea)
        }
      })
    },
    onEditStatusChange(params) {
      console.log('params', params)
      let list = this.list.map(item => {
        if (item.id === params.id) {
          item.isEdit = true
        } else {
          item.isEdit = false
        }
        return item
      })
      this.cabinetService.SET_LIST(list)
    },
    onAreaSortChange() {
      let list = this.list.map((item, index) => {
        let area = {
          id: item.id,
          sorted: index
        }
        return area
      })
      this.cabinetService
        .sort({
          list
        })
        .subscribe()
    },
    onAreaChange(id) {
      if (this.areaId === id) return false
      if (this.isAdd) {
        this.isAdd = false
      }
      this.areaId = id
      let currentArea = this.list.filter(item => item.id === id)[0]
      this.$emit('changeCurrentArea', currentArea)
    },
    onMouseMove(status) {},
    onRefresh() {
      this.init()
    },
    onAddStatusChange(status) {
      console.log('onAddStatusChange', status)
      this.isAdd = status
    },
    onAddArea() {
      this.isAdd = true
    }
  }
}
</script>
