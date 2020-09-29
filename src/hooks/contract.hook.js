import ContractEditDescription from '@/views/biz-modals/contract/edit-description'

const contractActions = vm => {
  return {
    modals: {
      ContractEditDescription
    },
    methods: {
      editDescription(props = {}) {
        this.$modalRouter.push({
          name: 'contract-edit-description',
          props,
          on: {
            success() {
              vm.$router.reload()
            }
          }
        })
      }
    }
  }
}

export default contractActions
