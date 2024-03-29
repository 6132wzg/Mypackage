<template>
  <st-form :form="form" class="page-create-container" labelWidth="130px">
    <a-row :gutter="8">
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item label="课程名称" required class="mg-t40">
          <a-input
            placeholder="支持输入1~30个字的课程名称"
            maxlength="30"
            v-decorator="decorators.course_name"
            @change="onCourseNameChange"
            :disabled="$searchQuery.id"
          />
        </st-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item label="课程类型" required>
          <input type="hidden" v-decorator="decorators.category_id" />
          <st-select-course-category
            :value="info.category_id"
            @change="onCourseTypeChange"
          />
        </st-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item label="训练目的" required>
          <input type="hidden" v-decorator="decorators.train_aim" />
          <st-select-training-aim
            :value="info.train_aim"
            @change="onTrainingAimChange"
          />
        </st-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item label="强度" required>
          <a-rate v-decorator="decorators.strength_level" />
        </st-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item label="消耗卡路里">
          <st-input-number
            float
            :min="0"
            :max="99999"
            v-decorator="decorators.calories"
          >
            <template slot="addonAfter">Kcal/节</template>
          </st-input-number>
        </st-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item label="时长" required>
          <st-input-number v-decorator="decorators.duration">
            <template slot="addonAfter">分钟</template>
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
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item label="课程介绍">
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
        <st-form-item labelFix v-if="from === 'brand'">
          <st-button
            @click="save"
            :loading="activeBtn === 'save' && loading.setCourse"
            data-name="save"
          >
            保存
          </st-button>
          <st-button
            type="primary"
            @click="saveAndGoNext"
            :loading="activeBtn === 'go' && loading.setCourse"
            class="mg-l12"
            data-name="go"
          >
            保存，继续设置上课门店
          </st-button>
        </st-form-item>
        <st-form-item labelFix v-if="from === 'shop'">
          <st-button type="primary" @click="save" :loading="loading.setCourse">
            保存
          </st-button>
        </st-form-item>
      </a-col>
    </a-row>
  </st-form>
</template>

<script>
import { MessageService } from '@/services/message.service'
import StImageUpload from '@/views/components/image-upload#/image-upload.vue'
import StSelectCourseCategory from '@/views/fragments/course/select-course-category'
import StSelectTrainingAim from '@/views/fragments/course/select-training-aim'
import { PatternService } from '@/services/pattern.service'
import { SetBrandTeamCourseService } from './set-brand-team-course.service'
import { SetShopTeamCourseService } from './set-shop-team-course.service'
import { ruleOptions } from './set-team-course.config'
export default {
  name: 'SetTeamCourse',
  serviceInject() {
    let CourseService
    const pageName = this.$route.name
    if (/^brand/.test(pageName)) {
      CourseService = SetBrandTeamCourseService
    } else {
      CourseService = SetShopTeamCourseService
    }
    return {
      pattern: PatternService,
      messageService: MessageService,
      courseService: CourseService
    }
  },
  rxState() {
    return {
      loading: this.courseService.loading$
    }
  },
  components: {
    StSelectCourseCategory,
    StSelectTrainingAim,
    StImageUpload
  },
  props: {
    from: {
      type: String,
      default: 'shop'
    },
    info: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      fileList: [],
      activeBtn: 'save',
      courseId: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setFieldsValue()
    })
  },
  methods: {
    save(e) {
      this.activeBtn = e.target.dataset.name
      e.preventDefault()
      this.doSave(this.onSubmitSuccess)
    },
    doSave(callback) {
      this.form.validate().then(() => {
        const data = this.getData()
        this.courseService.setCourse(data).subscribe(res => {
          this.courseId = res.course_id
          callback()
        })
      })
    },
    saveAndGoNext(e) {
      this.activeBtn = e.target.dataset.name
      this.doSave(() => {
        this.messageService.success({
          content: '保存成功'
        })
        this.$emit('goNext', this.courseId)
      })
    },
    onSubmitSuccess() {
      this.messageService.success({
        content: '保存成功'
      })
      const name = this.getParentListName()
      this.$router.push({
        name
      })
    },
    getParentListName() {
      /**
       * 品牌团课与门店团课保存后跳到对应的列表
       */
      return {
        shop: 'shop-product-course-manage-team-list',
        brand: 'brand-product-course-team-list-brand'
      }[this.from]
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
    setFieldsValue() {
      const info = this.info
      this.form.setFieldsValue({
        course_name: info.course_name,
        category_id: info.category_id,
        train_aim: info.train_aim,
        strength_level: info.strength_level,
        calories: info.calories,
        duration: info.duration,
        price: info.price,
        image: info.image,
        description: info.description
      })
      if (info.image && info.image.image_key) {
        this.fileList = [info.image]
      }
    },
    getData() {
      const data = this.form.getFieldsValue()
      const { id } = this.$searchQuery
      if (id) {
        data.course_id = +id
      }
      data.price = +data.price
      return data
    }
  }
}
</script>
