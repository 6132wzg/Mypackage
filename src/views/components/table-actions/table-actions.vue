<script>
const intercept = (arr, insert) => {
  const _res = []
  if (arr.length) {
    arr.forEach((item, idx) => {
      _res.push(item)
      if (idx < arr.length - 1) {
        _res.push(insert)
      }
    })
  }
  return _res
}

const MAX = 3

export default {
  name: 'StTableActions',
  render(h) {
    const usefulSlotNodes = this.$slots.default
      ? this.$slots.default.filter(item => item.tag)
      : []
    let outerSlotNodes = []
    /**
     * 等于3个的时候使用最小宽度
     */
    const useMax = usefulSlotNodes.length === MAX
    if (usefulSlotNodes.length <= MAX) {
      outerSlotNodes = usefulSlotNodes.splice(0, MAX)
    } else {
      outerSlotNodes = usefulSlotNodes.splice(0, 2)
    }
    const outerActions = intercept(
      outerSlotNodes,
      h('a-divider', {
        class: 'st-table-actions__divider',
        props: { type: 'vertical' }
      })
    )

    const innerActions = usefulSlotNodes

    const popoverVnode = h(
      'a-popover',
      {
        props: {
          overlayClassName: 'st-table-actions__popover',
          placement: 'bottomRight'
        },
        scopedSlots: {
          content: props => innerActions
        }
      },
      [
        h('a-divider', {
          class: 'st-table-actions__divider',
          props: { type: 'vertical' }
        }),
        h('a', { class: 'st-table-actions__trigger' }, [
          h('a', '更多'),
          h('st-icon', {
            props: {
              type: 'anticon:caret-down',
              color: '#3f66f6',
              size: '13px'
            }
          })
        ])
      ]
    )

    const childnodes = outerActions
    if (innerActions.length > 0) {
      childnodes.push(popoverVnode)
    }

    if (childnodes.length === 0) {
      childnodes.push(
        h(
          'span',
          {
            class: 'st-table-actions__empty'
          },
          ['--']
        )
      )
    }
    const result = h(
      'div',
      {
        class: `st-table-actions ${useMax ? 'st-table-actions--use-max' : ''}`
      },
      childnodes
    )

    return result
  }
}
</script>
