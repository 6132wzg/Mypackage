import SoldInternalNote from '@/views/biz-modals/sold/internal-note'
const useInternalNoteActions = () => {
  return {
    modals: {
      SoldInternalNote
    },
    methods: {
      onOpenModal(record) {
        this.$modalRouter.push({
          name: 'sold-internal-note',
          props: {
            id: record.id
          },
          on: {
            success: () => {}
          }
        })
      }
    }
  }
}
export default useInternalNoteActions
