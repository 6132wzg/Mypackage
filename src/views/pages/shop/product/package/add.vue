<template>
  <BizPackageForm @save="onSave" @shelf="onShelf">
    <slot></slot>
  </BizPackageForm>
</template>

<script>
import BizPackageForm from '@/views/biz-components/package/form/form.vue'
import { AddService } from './add.service'
export default {
  name: 'BlockTitleTest',
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
      this.$router.push({ name: 'shop-product-course-manage-package-list' })
    }
  }
}
</script>
