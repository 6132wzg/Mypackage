<template>
  <div :class="module()">
    <div :class="module('title')">预约类型</div>
    <div :class="module('desc')">
      拖动模块进行排序，至少选择一项
    </div>

    <div :class="module('list')">
      <st-draggable
        v-model="list"
        :animation="200"
        :class="module('box-wrap')"
        @change="draggChange"
        handle=".canDrag"
      >
        <div
          v-for="(li, index) in list"
          :key="li.default_title"
          :class="{ canDrag: canDrag }"
        >
          <div :class="module('box')">
            <div :class="module('box-title')">
              <span>{{ li.default_title }}</span>
              <st-checkbox
                :class="module('checked')"
                :value="Number(li.is_display)"
                @change="onClick(index)"
              ></st-checkbox>
            </div>
            <div :class="module('content')">
              显示名称：
              <st-input
                v-model="li.title"
                :class="module('input')"
                :placeholder="li.default_title"
                :maxLength="5"
                width="64%"
                @click="changeData"
                @mousemove="canDrag = false"
                @mouseleave="canDrag = true"
              ></st-input>
            </div>
          </div>
        </div>
      </st-draggable>
    </div>
  </div>
</template>
<script>
export default {
  name: 'h5FormReserveinfoComponent',
  bem: {
    module: 'h5-form-reserveinfo-component'
  },
  components: {},
  props: {
    moduleDatas: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  watch: {
    moduleDatas: {
      handler(newVal) {
        if (newVal.length === 0) return
        this.list = newVal[0].content.list
        console.log(14666, this.list)
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      list: [],
      canDrag: true
    }
  },
  methods: {
    onClick(index) {
      console.log('----', this.list, index)
      let displayTotal = 0
      this.list.forEach(val => {
        if (val.is_display) {
          displayTotal++
        }
      })
      if (displayTotal === 1 && this.list[index].is_display) {
        return
      }
      this.list[index].is_display = +!this.list[index].is_display
      this.changeData()
    },
    draggChange() {
      this.$emit('draggChange', this.list)
    },
    changeData() {
      this.$emit('change')
    }
  }
}
</script>
