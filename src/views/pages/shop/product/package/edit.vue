<template>
  <BizPackageForm :initInfo="info$" @save="onSave" isEdit>
    <slot></slot>
  </BizPackageForm>
</template>

<script>
import BizPackageForm from '@/views/biz-components/package/form/form.vue'
import { EditService } from './edit.service'
export default {
  name: 'PagePackageEdit',
  serviceInject() {
    return {
      service: EditService
    }
  },
  rxState() {
    const { info$ } = this.service
    return {
      info$
    }
  },
  components: {
    BizPackageForm
  },
  methods: {
    onSave(form) {
      const { id } = this.info$
      this.service.editPackageInfo({ id, ...form }).subscribe(this.success)
    },
    success() {
      this.$router.push({ name: 'shop-product-course-manage-package-list' })
    }
  }
}
</script>
