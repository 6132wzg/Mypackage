<template>
  <st-modal title="切换样式" v-model="show" @ok="save" @cancel="cancel">
    <div class="modal-brand-setting-mina-checkout-shopinfo-layout">
      <a-radio-group v-model="currentLayout" class="modal-container__radio">
        <a-radio v-for="i in 2" :value="i" :key="i" />
      </a-radio-group>
      <div
        class="modal-container modal-container__1"
        :class="{ 'activity-checked': currentLayout === 1 }"
        @click="currentLayout = 1"
      >
        <div class="modal-container__bg"></div>
        <div class="modal-container__name">场馆名称</div>
        <div class="modal-container__time">营业时间</div>
        <div class="modal-container__contact">
          <div class="modal-container__item"></div>
          <div class="modal-container__item"></div>
        </div>
        <div class="modal-container__logo"></div>
      </div>
      <div
        class="modal-container modal-container__2"
        :class="{ 'activity-checked': currentLayout === 2 }"
        @click="currentLayout = 2"
      >
        <div class="modal-container__bg"></div>
        <div class="modal-container__banner">
          <div class="modal-container__item"></div>
          <div class="modal-container__item"></div>
          <div class="modal-container__item modal-container__item3"></div>
        </div>
        <div class="modal-container__contact">
          <div class="modal-container__contact-item1"></div>
          <div class="modal-container__contact-item2"></div>
        </div>
        <div class="modal-container__logo-name">
          <div class="modal-container__logo"></div>
          <div class="modal-container__name-time">
            <div class="modal-container__name">场馆名称</div>
            <div class="modal-container__time">营业时间</div>
          </div>
        </div>
      </div>
    </div>
  </st-modal>
</template>
<script>
export default {
  props: {
    layout: {
      type: [String, Number],
      default: 1
    }
  },
  data() {
    return {
      show: false,
      currentLayout: 1
    }
  },
  watch: {
    layout: {
      handler(newV) {
        if (newV) {
          this.currentLayout = newV
        }
      },
      immediate: true
    }
  },
  methods: {
    cancel() {
      this.show = false
    },
    save() {
      this.show = false
      this.$emit('success', this.currentLayout)
    }
  }
}
</script>
