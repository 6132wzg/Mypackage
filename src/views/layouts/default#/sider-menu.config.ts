export const extraMenuPatterns = () => {
  const mainAndSubCommon = {
    'brand-staff-department': /brand-staff-(department|add|edit|info)/,
    'shop-setting-shop-info': /shop-setting-shop/,
    'shop-product-course-manage-package': /shop-product-package/,
    'brand-product-package-list': /brand-product-package/,
    'shop-member-list': /shop-member-(list|add|edit|info)/
  }
  return {
    main: {
      'brand-app-center': /brand-app|brand-marketing/,
      'shop-staff-list': /shop-staff/,
      ...mainAndSubCommon
    },
    sub: {
      ...mainAndSubCommon
    }
  }
}
