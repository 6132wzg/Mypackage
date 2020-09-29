# 支持售卖时间表单组件
用于售卖模块，支持售卖时间表单的填写
### Properties
    - decorators: 用于表单组件校验和初始值赋值
    - labelWidth: label的宽度 默认88px
### Methods
    - onChange: 改变单选框的值选择限时则时间选择组件显示
### Inherit
    - 继承form组件
### Attribute（自生属性）
    - title-name
### Config & State
    - FOREVER: 1: 永久售卖
    - RANGE_TINE: 2, 限时售卖
    - dateFormat: 'YYYY-MM-DD', 时间格式化
    - isForever: false 是否是永久售卖
### Event
    - 无
### Children
    - 无
### 示例
结合 表单组件一起使用 将decorators传进去
```JS
<buy-time v-decorator="decorators.transfer_rate" />
```
