<template>
  <st-form :form="form" class="page-create-container" labelWidth="130px">
    <a-row :gutter="8">
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item label="课程名称" required>
          <a-input
            placeholder="支持输入1~30个字的课程名称"
            maxlength="30"
            v-decorator="decorators.course_name"
            @change="onCourseNameChange"
          />
        </st-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item label="课程类型" required>
          <input type="hidden" v-decorator="decorators.category_id" />
          <st-select-course-category @change="onCourseTypeChange" />
        </st-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item label="训练目的" required>
          <input type="hidden" v-decorator="decorators.train_aim" />
          <st-select-training-aim @change="onTrainingAimChange" />
        </st-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item label="课程时长" required>
          <st-input-number v-decorator="decorators.duration">
            <template slot="addonAfter">
              分钟
            </template>
          </st-input-number>
        </st-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :lg="22" :xs="22" :offset="1">
        <st-form-item label="图片">
          <div class="page-upload-container">
            <st-image-upload
              :list="fileList"
              @change="onImgChange"
            ></st-image-upload>
            <input type="hidden" v-decorator="decorators.image" />
            <div class="page-course-photo-des mg-l16">
              <div class="page-course-item">
                <div class="page-course-item-tip">1.</div>
                <div class="page-course-item-cont">
                  图片格式必须为：png,bmp,
                  jpeg,jpg,gif,建议使用png格式图片，以保存最佳效果
                </div>
              </div>
              <div class="page-course-item">
                <div class="page-course-item-tip">2.</div>
                <div class="page-course-item-cont">
                  建议尺寸为750px * 422px， 不可大于2M
                </div>
              </div>
            </div>
          </div>
        </st-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :lg="22" :xs="22" :offset="1">
        <st-form-item label="课程介绍">
          <!-- TODO: textarea初始值与st-form校验初始值冲突 -->
          <st-textarea
            v-decorator="decorators.description"
            :autosize="{ minRows: 10, maxRows: 16 }"
            placeholder="填写点什么吧"
            maxlength="500"
          />
        </st-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item labelFix>
          <st-button type="primary" @click="save" :loading="loading.addCourse">
            保存，继续设置售卖门店
          </st-button>
        </st-form-item>
      </a-col>
    </a-row>
  </st-form>
</template>

<script>
import { AddService } from '../../add.service'
import { MessageService } from '@/services/message.service'
import { PatternService } from '@/services/pattern.service'
import StSelectCourseCategory from '@/views/fragments/course/select-course-category'
import StSelectTrainingAim from '@/views/fragments/course/select-training-aim'
import { ruleOptions } from '../create-personal-course.config'
import StImageUpload from '@/views/components/image-upload#/image-upload.vue'
export default {
  name: 'create-personal-course',
  serviceInject() {
    return {
      addService: AddService,
      pattern: PatternService,
      messageService: MessageService
    }
  },
  rxState() {
    return {
      loading: this.addService.loading$
    }
  },
  components: {
    StSelectCourseCategory,
    StSelectTrainingAim,
    StImageUpload
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      fileList: [],
      descriptionLength: 0
    }
  },
  methods: {
    save(e) {
      e.preventDefault()
      this.form.validate().then(() => {
        const data = this.form.getFieldsValue()
        this.addService.addCourse(data).subscribe(res => {
          this.messageService.success({
            content: '提交成功'
          })
          this.$emit('goNext', res.course_id)
        })
      })
    },
    onImgChange(fileList) {
      this.form.setFieldsValue({
        image: fileList[0]
      })
    },
    onCourseTypeChange(category_id) {
      this.form.setFieldsValue({
        category_id
      })
    },
    onTrainingAimChange(train_aim) {
      this.form.setFieldsValue({
        train_aim
      })
    },
    onCourseNameChange(e) {
      this.$emit('onCourseNameChange', e.target.value)
    },
    onDescriptionChange(e) {
      this.descriptionLength = e.target.value.length
    }
  }
}
</script>
