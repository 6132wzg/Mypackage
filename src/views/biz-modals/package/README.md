### selectCourse 组件

品牌门店课程包创建编辑业务组件
### Properties
    - title
      - 模态窗的标题
    - initDataSource
      - 已被选中的课程，主要用于表格多选框的初始化，已选的课程默认勾选
    - courseType
      - 是团课还是私教课
    - userShopList
      - 当选择多门店的时候，传门店id数组
    - useRange
      - 1 单门店 2 多门店（只有多门店类型的时候userShopList才需要数据） 3 全部门店
### Methods
    - onChange 课程类型搜索 瑜伽  核心力锻炼
    - onSearch 课程名称模糊搜索
    - onOk 确认提交
### Inherit
    - table-mixin
    - 继承模态窗
### Attribute（自生属性）
  - title
      - 模态窗的标题
  - init-data-source
      - 已被选中的课程，主要用于表格多选框的初始化，已选的课程默认勾选
  - courseType
      - 是团课还是私教课
### Config & State
    - columns 团课或者私教
### Event
    - change
      - 确认时提交数据给调用组件
### Children
  st-table
  a-select
  st-search
### 示例

```js
this.$modalRouter.push({
    name: 'select-course',
    props: {
      initDataSource: dataSource,
      title: '选择支持预约的团体课',
      courseType: 'team'
    }
    on: {
      done: (courseList) => {
        this.courseList = courseList
      }
    }
  })
```
