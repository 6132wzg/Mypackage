<template>
  <div class="member-info-entry-log__emtry-tip mg-t16">
    <span>{{ tip }}</span>
  </div>
</template>
<script>
export default {
  name: 'EntryDate',
  props: {
    tip: {
      type: String,
      default: ''
    }
  }
}
</script>
