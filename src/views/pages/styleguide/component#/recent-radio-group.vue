<template>
  <div>
    <p>报表筛选时常用, 默认状态</p>
    <st-recent-radio-group @change="onChange"></st-recent-radio-group>

    <st-search-panel class="mg-t16" @search="onSearch" @reset="onReset">
      <p>高级用法</p>
      <st-search-panel-item label="label">
        <st-input v-model="label" style="width: 120px"></st-input>
        <span style="margin-left: 15px">
          快捷按钮label自定义,其中$为按钮value占位，必须有
        </span>
      </st-search-panel-item>
      <st-search-panel-item label="type">
        <a-radio-group v-model="type" default-value="subtract">
          <a-radio-button value="add">往后推算</a-radio-button>
          <a-radio-button value="subtract">往前推算</a-radio-button>
        </a-radio-group>
        <span style="margin-left: 15px">日期推算规则</span>
      </st-search-panel-item>
      <st-search-panel-item label="unit">
        <a-radio-group
          v-model="unit"
          default-value="subtract"
          @change="onUnitChange"
        >
          <a-radio-button value="years">years</a-radio-button>
          <a-radio-button value="quarters">quarters</a-radio-button>
          <a-radio-button value="months">months</a-radio-button>
          <a-radio-button value="weeks">weeks</a-radio-button>
          <a-radio-button value="days">days</a-radio-button>
          <a-radio-button value="hours">hours</a-radio-button>
          <a-radio-button value="minutes">minutes</a-radio-button>
          <a-radio-button value="seconds">seconds</a-radio-button>
          <a-radio-button value="milliseconds">milliseconds</a-radio-button>
        </a-radio-group>
        <span style="margin-left: 15px">快捷按钮时间单位</span>
      </st-search-panel-item>
      <st-search-panel-item label="range">
        <st-input-number v-model="range" style="width: 120px">
          <div slot="addonAfter">天</div>
        </st-input-number>
        <span style="margin-left: 15px">时间范围限定</span>
      </st-search-panel-item>

      <st-search-panel-item label="disabledNow">
        <a-checkbox class="mg-l24" v-model="disabledNow">
          当天是否不可选择
        </a-checkbox>
      </st-search-panel-item>
      <st-search-panel-item label="showBtnRangeDate">
        <a-checkbox class="mg-l24" v-model="showBtnRangeDate">
          是否展示快捷按钮的时间范围
        </a-checkbox>
      </st-search-panel-item>
      <st-search-panel-item label="showRangePicker">
        <a-checkbox class="mg-l24" v-model="showRangePicker">
          是否展示自定义时间
        </a-checkbox>
      </st-search-panel-item>
      <p style="font-size: 12px">
        以上条件选择变更后 请手动点击时间选择组件
        更新组件状态（本人比较懒，懒得做自动刷新.....）
      </p>
      <st-recent-radio-group
        :label="label"
        :type="type"
        :unit="unit"
        :disabledNow="disabledNow"
        :showRangePicker="showRangePicker"
        :showBtnRangeDate="showBtnRangeDate"
        :range="range"
        @change="onChange"
      ></st-recent-radio-group>
      <div slot="button"></div>
    </st-search-panel>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // label: '近$天',
      type: 'subtract',
      unit: 'days',
      range: 180,
      showBtnRangeDate: false,
      showRangePicker: true,
      disabledNow: false,
      labelUnitMap: {
        years: '年',
        quarters: '季度',
        months: '月',
        weeks: '周',
        days: '天',
        hours: '小时',
        minutes: '分钟',
        seconds: '秒',
        milliseconds: '毫秒'
      },
      labelTypeMap: {
        add: '未来',
        subtract: '近'
      }
    }
  },
  computed: {
    label: {
      get() {
        return this.labelTypeMap[this.type] + '$' + this.labelUnitMap[this.unit]
      },
      set(val) {
        return val || '近$天'
      }
    }
  },
  methods: {
    onChange(model) {
      console.log(model)
    },
    onUnitChange() {}
  }
}
</script>
