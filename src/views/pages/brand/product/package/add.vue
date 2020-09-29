<template>
  <BizPackageForm @save="onSave" @shelf="onShelf">
    <slot></slot>
  </BizPackageForm>
</template>
<script>
import BizPackageForm from '@/views/biz-components/package/form/form.vue'
import { AddService } from './add.service'
export default {
  name: 'PagePackageAdd',
  serviceInject() {
    return {
      service: AddService
    }
  },
  components: {
    BizPackageForm
  },
  methods: {
    onSave(form) {
      this.service.addPackageInfo(form).subscribe(this.success)
    },
    onShelf(form) {
      this.service.shelfPackage(form).subscribe(this.success)
    },
    success() {
      this.$router.push({ name: 'brand-product-package-list' })
    }
  }
}
</script>
