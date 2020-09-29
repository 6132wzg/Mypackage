<template>
  <BizPackageForm @save="onSave" :initInfo="info$" isEdit>
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
  methods: {
    onSave(form) {
      const { id } = this.info$
      this.service.editPackageInfo({ id, ...form }).subscribe(this.success)
    },
    success() {
      this.$router.push({ name: 'brand-product-package-list' })
    }
  },
  components: {
    BizPackageForm
  }
}
</script>
