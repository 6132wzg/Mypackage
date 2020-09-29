import SoldCardDepositUpdateRights from '@/views/biz-modals/sold/card/deposit/update-rights'

const soldDepositCardActions = vm => {
  return {
    modals: {
      SoldCardDepositUpdateRights
    },
    methods: {
      /**
       * 扣次
       * @param {number} id
       */
      onUpdateRights(id) {
        this.$modalRouter.push({
          name: 'sold-card-deposit-update-rights',
          props: {
            id
          },
          on: {
            success: () => {
              this.$router.reload()
            }
          }
        })
      }
    }
  }
}

export default soldDepositCardActions
