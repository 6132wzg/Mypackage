export const enum CODE_NUMBER {
  MEMBER_CARD = 1, // 会员卡
  COURSE = 2, // 私教课
  PACKAGE = 3, // 课程包
  CARD = 4, // 储值卡
  RELET = 5, // 租赁
  EARNEST = 6 // 定金
}

export const enum PRODUCT_TYPE {
  MEMBER_CARD = 1, // 会员卡
  DEPOSIT_CARD = 2, // 储值卡
  PERSONAL_COURSE = 3, // 私教课
  STORE = 4, // 云店
  PACKAGE = 5, // 课程包
  CABINET = 6, // 租赁柜
  SMALL_COURSE = 7 // 小班课
}

export const SOLD_DETAIL_PAGE_NAMES = {
  member: 'shop-sold-card-info-member-info-operation-record',
  deposit: 'shop-sold-card-info-deposit-info-operation-record',
  personal: 'shop-sold-course-info-personal-info-operation-record',
  package: 'shop-sold-course-info-package-info-operation-record',
  'small_course_order/detail':
    'shop-sold-course-info-small-course-info-operation-record'
}
