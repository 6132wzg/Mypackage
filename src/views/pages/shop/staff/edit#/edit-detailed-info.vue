<template>
  <st-form :form="form" class="page-edit-container">
    <a-row :gutter="8">
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item label="毕业院校">
          <a-input
            placeholder="支持中英文、数字,不超过100个字"
            v-decorator="decorators.graduated_school"
          />
        </st-form-item>
        <st-form-item label="学历">
          <a-select placeholder="请选择" v-decorator="decorators.education">
            <a-select-option
              v-for="(item, index) in educations"
              :value="+item.value"
              :key="index"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </st-form-item>
        <st-form-item label="生日">
          <a-date-picker style="width:100%" v-decorator="decorators.birthday" />
        </st-form-item>
        <st-form-item label="婚姻状况">
          <a-select placeholder="请选择" v-decorator="decorators.marry_status">
            <a-select-option
              v-for="(item, index) in marry_status"
              :value="+item.value"
              :key="index"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </st-form-item>
      </a-col>
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item label="毕业时间">
          <a-date-picker
            style="width:100%"
            v-decorator="decorators.graduation_time"
          />
        </st-form-item>
        <st-form-item label="专业">
          <a-input
            placeholder="请输入专业名称"
            v-decorator="decorators.profession"
          />
        </st-form-item>
        <st-form-item label="籍贯">
          <a-input
            placeholder="请输入籍贯"
            v-decorator="decorators.native_place"
          />
        </st-form-item>
        <st-form-item label="子女状态">
          <a-select
            placeholder="请选择"
            v-decorator="decorators.children_status"
          >
            <a-select-option
              v-for="(item, index) in children_status"
              :value="+item.value"
              :key="index"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </st-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="8" class="mg-t48">
      <a-col :lg="10" :xs="22" :offset="1">
        <st-form-item label="家庭住址">
          <a-cascader
            :options="regions"
            :fieldNames="fieldNames"
            v-decorator="decorators.provinces"
            changeOnSelect
            placeholder="请选择"
          />
        </st-form-item>
        <st-form-item label="详细住址">
          <a-input
            placeholder="填写点什么吧"
            v-decorator="decorators.address"
          />
        </st-form-item>
        <st-form-item label="备注">
          <st-textarea
            :maxlength="500"
            :rows="10"
            v-decorator="decorators.description"
            placeholder="填写点什么吧"
          />
        </st-form-item>
        <st-form-item label="对外展示" v-if="isShowCoach">
          <st-checkbox v-decorator="decorators.is_show">
            展示在小程序
          </st-checkbox>
        </st-form-item>
      </a-col>
      <a-col :lg="10" :xs="22" :offset="2"></a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :offset="1">
        <st-form-item labelFix>
          <st-button
            type="primary"
            class="mg-r16"
            ghost
            :loading="loading.updateDetailedInfo"
            @click="onClickBack"
          >
            上一步
          </st-button>
          <st-button
            class="mg-l16"
            @click="goNext"
            :loading="loading.updateDetailedInfo"
            type="primary"
          >
            {{ !isPrivateCoach ? '保存' : '保存，继续填写' }}
          </st-button>
        </st-form-item>
      </a-col>
    </a-row>
  </st-form>
</template>

<script>
import { RegionService } from '@/services/region.service'
import { EditService } from '../edit.service'
import { MessageService } from '@/services/message.service'
import { get } from 'lodash-es'
import { PatternService } from '@/services/pattern.service'
import { ruleOptions } from '../staff-form.config.ts'
import { UserService } from '@/services/user.service'
export default {
  name: 'EditDetailedInfo',
  serviceInject() {
    return {
      pattern: PatternService,
      region: RegionService,
      service: EditService,
      message: MessageService,
      userService: UserService
    }
  },
  rxState() {
    return {
      children_status: this.userService.getOptions$('staff.children_status'),
      marry_status: this.userService.getOptions$('staff.marry_status'),
      educations: this.userService.getOptions$('staff.education'),
      loading: this.service.loading$
    }
  },
  props: {
    isPrivateCoach: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    isShowCoach: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      regions: [],
      fieldNames: { label: 'name', value: 'id', children: 'children' }
    }
  },
  mounted() {
    this.setData(this.data)
    this.region.regionApi.getRegions().subscribe(v => {
      this.regions = v
    })
  },
  methods: {
    onClickBack() {
      this.$emit('back', 1)
    },
    setData(obj) {
      this.form.setFieldsValue({
        graduated_school: obj.graduated_school,
        graduation_time: obj.graduation_time
          ? moment(obj.graduation_time)
          : undefined,
        education: obj.education || undefined,
        profession: obj.profession,
        birthday: obj.birthday ? moment(obj.birthday) : undefined,
        native_place: obj.native_place,
        marry_status: obj.marry_status || undefined,
        children_status: obj.children_status || undefined,
        address: obj.address,
        description: obj.description,
        provinces: [obj.province_id, obj.city_id, obj.district_id],
        is_show: obj.is_show
      })
    },
    goNext(e) {
      e.preventDefault()
      this.form.validate().then(values => {
        this.submit(values, 1)
      })
    },
    submit(data, saveOrgoNext) {
      data.province_id = get(data, 'provinces.0')
      data.city_id = get(data, 'provinces.1')
      data.district_id = get(data, 'provinces.2')
      data.birthday && (data.birthday = data.birthday.format('YYYY-MM-DD'))
      data.birthday &&
        (data.graduation_time = data.graduation_time.format('YYYY-MM-DD'))
      if (!this.isShowCoach) delete data.is_show
      this.service
        .updateDetailedInfo(this.data.staff_id, data)
        .subscribe(() => {
          if (!this.isPrivateCoach) {
            this.$router.push({ name: 'shop-staff-list' })
          } else {
            this.$emit('gonext')
            this.$emit('updateStaffInfo')
          }
        })
    }
  }
}
</script>
