import SoldCardMemberUpdateRights from '@/views/biz-modals/sold/card/member/update-rights'

const soldMemberCardActions = vm => {
  return {
    modals: {
      SoldCardMemberUpdateRights
    },
    methods: {
      /**
       * 扣次
       * @param {number} id
       */
      onUpdateRights(id, params = {}) {
        this.$modalRouter.push({
          name: 'sold-card-member-update-rights',
          props: {
            id,
            isSync: params.isSync,
            isShowLink: params.isShowLink
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

export default soldMemberCardActions
