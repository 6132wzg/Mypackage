<template>
  <st-modal v-model="show" @cancel="cancel" :footer="null">
    <div class="st-modal-shop-app-venue-view-image">
      <img :src="url" alt="" />
    </div>
  </st-modal>
</template>
<script>
export default {
  data() {
    return {
      show: false
    }
  },
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  methods: {
    cancel() {
      this.show = false
    }
  }
}
</script>
