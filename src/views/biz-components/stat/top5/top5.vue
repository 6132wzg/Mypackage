<script>
import { merge, omit, map, forEach } from 'lodash-es'
export default {
  name: 'InfoPane',
  components: {},
  bem: {
    b: 'st-top5'
  },
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      restProps: { ...this.$attr }
    }
  },
  computed: {
    locale() {
      return {
        emptyText: <st-no-data />
      }
    }
  },
  methods: {
    renderChildren() {
      return map(this.$slots, (vnode, slot) => (
        <template slot={slot}>{vnode}</template>
      ))
    }
  },
  render(h) {
    let props = {
      locale: this.locale,
      pagination: false,
      columns: this.columns,
      dataSource: this.dataSource,
      ...this.$attrs
    }
    const ce = h('div', { class: 'st-top5' }, [
      h('div', { class: 'st-top5-header' }, [
        h(
          'div',
          {
            class: 'st-top5-title',
            scopedSlots: {
              top5: props => h('div', ['销量Top5'])
            }
          },
          [this.$slots.top5]
        ),
        h(
          'div',
          {
            class: 'st-top5-more',
            scopedSlots: {
              action: props => h('a', ['更多'])
            }
          },
          [this.$slots.action]
        )
      ]),
      h(
        'a-table',
        {
          props,
          scopedSlots: this.$scopedSlots,
          slot: this.$slots
        },
        this.renderChildren()
      )
    ])
    return ce
  }
}
</script>
