
## form.mixin.js 组成
  可以快速实现父子组件 表单数据收集、数据同步、数据校验
  赋予组件公用的数据源 和 数据校验状态，
  集成了收集数据、对表单校验、提交做了统一处理，

  支持form表单的嵌套，父子表单的调用方式都一样
  使用方式如下：
```ts
  <discount-form
    v-model="formValue"
    :formCheck="formCheck"
    :decorators="decorators"
    :form="form"
    :isSubmit="isSubmit"
    @change="onChange"
    @submit="onSubmit"
  ></discount-form>
```

  * 接收属性 --- 数据源上下公用（上接父组件的formValue，下传formValue到子组件）
    1. formValue 表单数据
    2. formCheck 表单校验结果
    3. isSubmit  提交操作标识，从最上层点击保存按钮变更，传递到下级
    4. isEdit    是否是编辑状态
  * 方法
    - 校验、提交方法
    1. onSubmit submit事件专用方法，承接子组件的submit事件，输出自己的submit事件
    2. messageError 自定义校验message抛错 公共方法
    3. validate 需要自己定义，定义自己组件校验方法，可以是 promise 返回校验状态

    4. formValueChange 使用 v-decorator表单的change方法可以绑定本方法 同步表单数据 到 formValue
    5. setFieldsValue 同步 formValue 到 使用 v-decorator 的表单中
    6. setValue 更新组件属性值 支持 this.setValue('formValue.product_type', 2) 和 this.setValue('{'formValue.product_type': 2, formValue.product_id: 1}) 两种调用方式


