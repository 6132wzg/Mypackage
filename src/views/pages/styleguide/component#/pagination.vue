<template>
  <div>
    <st-pagination :page="page" @change="onChange" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      page: {
        current_page: 1,
        size: 20,
        total_counts: 100,
        total_pages: 5
      }
    }
  },
  methods: {
    onChange(pagination) {
      console.log('page changed:', pagination)
    }
  }
}
</script>
