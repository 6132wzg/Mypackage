<template>
  <div>
    <p>
      下拉选择，设置 defaultLabel 可扩展额外选择项，值默认为
      -1（如：defaultLabel = 全部）其余属性和 a-select 一致
    </p>
    <st-select
      defaultLabel="全部"
      :options="list1"
      v-model="list1Value"
      @change="onChange"
    ></st-select>
    <p>
      可及联的下拉选择，只需在 query 里面设置及联条件即可，
      及联条件变化会触发refresh事件
    </p>
    <st-select
      defaultLabel="全部门店"
      :options="list2"
      v-model="list2Value"
      @change="onChange"
    ></st-select>
    <st-select
      class="mg-l12"
      defaultLabel="全部教练"
      :query="{
        value: list2Value
      }"
      :options="list3"
      v-model="list3Value"
      @change="onChange"
      @refresh="onRefresh"
    ></st-select>
  </div>
</template>

<script>
export default {
  title: '下拉选择',
  data() {
    return {
      model: 0,
      list1Value: -1,
      list1: [
        { label: '普通券', value: 1 },
        { label: '优惠券2', value: 2 },
        { label: '优惠券3', value: 3 },
        { label: '优惠券4', value: 4 },
        { label: '优惠券5', value: 5 },
        { label: '优惠券6', value: 6 },
        { label: '优惠券7', value: 7 },
        { label: '优惠券8', value: 8 },
        { label: '优惠券9', value: 9 }
      ],
      list2Value: -1,
      list2: [
        { label: '门店1', value: 1 },
        { label: '门店2', value: 2 },
        { label: '门店3', value: 3 },
        { label: '门店4', value: 4 }
      ],
      list3Value: -1,
      list3: [
        { label: '张三', value: 1 },
        { label: '李四', value: 2 },
        { label: '老王', value: 3 },
        { label: '二大爷', value: 4 }
      ]
    }
  },
  methods: {
    onRefresh(e) {
      console.log('refresh', e)
      this.list3Value = -1
    },
    onChange(e) {
      console.log('change', e)
    }
  }
}
</script>
