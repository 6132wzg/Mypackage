<template>
  <a-select
    :mode="mode"
    :placeholder="placeholder || '请选择教练'"
    :value="cValue"
    :style="{ width }"
    :defaultValue="defaultValue"
    :disabled="disabled"
    @change="onChange"
    :options="shopOptions"
  />
</template>

<script>
import { isEqual } from 'lodash-es'
import { UserService } from '@/services/user.service'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  name: 'StaffSelect',
  serviceInject() {
    return {
      userService: UserService
    }
  },
  rxState() {
    return {
      staffList$: this.userService.staffList$
    }
  },
  computed: {
    cValue: {
      set(newValue, oldValue) {
        if (isEqual(newValue, oldValue)) return
        this.$emit('change', newValue)
      },
      get() {
        return this.value || this.defaultValue
      }
    },
    defaultOption() {
      return this.defaultLabel ? [{ title: this.defaultLabel, value: -1 }] : []
    },
    shopOptions() {
      return [
        ...this.defaultOption,
        ...this.staffList$.map(item => {
          return {
            label: item.nickname,
            value: item.id
          }
        })
      ]
    }
  },
  props: {
    mode: {
      type: String
    },
    placeholder: {
      type: String
    },
    type: {
      type: String
    },
    width: {
      type: String,
      default: '150px'
    },
    value: {
      type: [Number, String, Array]
    },
    query: {
      type: Object,
      default: () => {}
    },
    defaultValue: Number,
    defaultLabel: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    query: {
      deep: true,
      handler(newValue, oldValue) {
        if (isEqual(newValue, oldValue)) return
        this.cValue = this.defaultOption.length
          ? this.defaultOption[0].value
          : ''
        this.userService.fetchStaffList({ ...newValue }).subscribe()
      }
    }
  },
  methods: {
    onChange(value) {
      this.$emit('change', value)
    }
  },
  created() {
    this.userService.fetchStaffList(this.query).subscribe()
  }
}
</script>
