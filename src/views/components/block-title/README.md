# 分组标题

如果有较复杂的表单会分组让用户填写信息，这时候需要标题分隔开，更利于表单的填写。
也用于详情展示，同样更有利于详情展示。
### Properties
    - titleName
### Methods
    - 无
### Inherit
    - 无
### Attribute（自生属性）
    - title-name
### Config & State
    - 无
### Event
    - 无
### Children
    - slot 可以自定义标题内容
### 示例
结合 st-panel使用 需要initial属性 去除padding
```JS
<st-panel app initial>
  <block-title title-name="基本信息"></block-title>
</st-panel>
```
