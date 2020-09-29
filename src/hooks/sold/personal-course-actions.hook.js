import SoldCoursePersonalDeduct from '@/views/biz-modals/sold/course/personal/deduct'
import SoldCoursePersonalUpdateRights from '@/views/biz-modals/sold/course/personal/update-rights'

const soldPersonalCourseActions = vm => {
  return {
    modals: {
      SoldCoursePersonalDeduct,
      SoldCoursePersonalUpdateRights
    },
    methods: {
      /**
       * 扣次
       * @param {number} id
       */
      onDeduct(id) {
        this.$modalRouter.push({
          name: 'sold-course-personal-deduct',
          props: {
            id
          },
          on: {
            success: () => {
              this.$router.reload()
            }
          }
        })
      },
      /**
       * 修改售出权益
       * @param {number} id
       */
      onUpdateRights(id) {
        this.$modalRouter.push({
          name: 'sold-course-personal-update-rights',
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

export default soldPersonalCourseActions
