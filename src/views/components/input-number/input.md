## API

### input-number

| 参数    | 说明                         | 类型    | 默认值 |
| ------- | ---------------------------- | ------- | ------ |
| v-model | 双向绑定的值                 | array   | []     |
| float   | 是否支持小数                 | boolean | []     |
| type    | 输出类型定义(text 或 number) | string  | text   |

### input-number event

| 参数   | 说明           | 类型     | 默认值 |
| ------ | -------------- | -------- | ------ |
| change | 参数为输入的值 | function |        |

> 此 input 只能输入 12 位。仅支持 addonAfter 插槽（不支持属性形式）。同时为了允许输入'\.',所以返回值为 string 类型。此 input 组件适用输入 date price 表单。
> 单独设置 type=number 可输出 number 类型的值
