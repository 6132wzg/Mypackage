import OnSales from '@/views/biz-modals/package/onSales'
import OffSales from '@/views/biz-modals/package/offSales'
import { PRODUCT_CHANNEL } from '@/constants/course/package.ts'
const userPackageActions = vm => {
  return {
    modals: {
      OnSales,
      OffSales
    },
    methods: {
      onUpShelf({ id, channel, pageType }) {
        this.$modalRouter.push({
          name: 'on-sales',
          props: {
            id,
            pageType,
            channel: channel === PRODUCT_CHANNEL.SHOP ? 'shop' : 'brand'
          },
          on: {
            success: () => {
              vm.$router.reload()
            }
          }
        })
      },
      deletePackage(id, name, callback) {
        return new Promise((resolve, reject) => {
          this.$confirm({
            title: '提示',
            content: ` 删除后不影响已购买的用户，一旦删除则无法恢复，确认删除${name}？`,
            onOk: () => {
              callback(id).subscribe(res => {
                return resolve('delete success')
              })
            },
            onCancel() {}
          })
        })
      },
      onEdit({ pageType, id }) {
        vm.$router.push({
          name: `${pageType}-product-package-edit`,
          query: { id }
        })
      },
      onDownShelf({ id, pageType, shopPackageName }) {
        this.$modalRouter.push({
          name: 'off-sales',
          props: {
            id,
            pageType,
            shopPackageName
          },
          on: {
            success: () => {
              vm.$router.reload()
            }
          }
        })
      }
    }
  }
}
export default userPackageActions
