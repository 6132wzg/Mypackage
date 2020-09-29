/**
 * 固定课程包限定课程上限
 */
export const FIX_PACKAGE_LIMIT = 10

// 门店范围
export enum SHOP_RANGE {
  /**
   * 全店
   */
  ALL_STORE = 3,
  /**
   * 指定门店
   */
  SPECIFIED_STORE = 2,
  /**
   * 单门店
   */
  SINGLE_STORE = 1
}

// 门店范围
export enum PRODUCT_CHANNEL {
  /**
   * 门店
   */
  SHOP = 2,
  /**
   * 品牌
   */
  BRAND = 1
}
// 门店范围
export enum SHELF_STATUS {
  /**
   * 未上架
   */
  NOT_UP = 0,
  /**
   * 上架
   */
  UP = 1,
  /**
   * 下架
   */
  DOWN = 2
}
