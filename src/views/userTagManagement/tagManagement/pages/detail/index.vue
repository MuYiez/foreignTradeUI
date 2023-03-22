<template>
  <div class="all-wrap">
    <p class="title">{{ title }}</p>
    <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
      <a-form-item label="标签名称" name="tagName">
        <a-input v-model:value="formState.tagName" placeholder="请输入标签名称" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSubmit">创建</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
  import { onMounted, ref } from 'vue';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { formState, rules, FormState } from './data';
  import { addTag,editTag } from '/@/api/userTagManagement/userTagManagement';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useRoute } from 'vue-router';
  const { createMessage } = useMessage();
  import { useGo } from '/@/hooks/web/usePage';
  export default {
    setup() {
      const title = ref('新增标签');
      const formRef = ref();
      const go = useGo();
      let route = useRoute();

      onMounted(()=>{
        if (route.query.tagId) {
          title.value = '修改标签';

          //数据回显
          let queryData = JSON.parse(JSON.stringify(route.query));
          for (const key in queryData) {
            formState[key] = queryData[key];
          }
        }
      })

      //提交菜单申请
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(() => {
            let sendData: any = {
              ...formState
            };
            if (route.query.tagId) {
              sendData.tagId = route.query.tagId;
              editTag(sendData).then(() => {
                createMessage.success('标签修改成功');
                go('/userTagManagement/tagManagement');
              });
            } else {
              addTag(sendData).then(() => {
                createMessage.success('标签新增成功');
                go('/userTagManagement/tagManagement');
              });
            }
          })
          .catch((error: ValidateErrorEntity<FormState>) => {
            console.log('error', error);
          });
      };

      //重置
      const resetForm = () => {
        formRef.value.resetFields();
      };

      return {
        title,
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        formState,
        formRef,
        rules,
        onSubmit,
        resetForm,
      };
    },
  };
</script>

<style lang="less">
  .all-wrap {
    background-color: #fff;
    margin: 20px;
    border-radius: 10px;
    padding: 20px;
  }
  .title {
    font-size: 20px;
    font-weight: 900;
    padding-bottom: 10px;
    border-bottom: 1px solid #e5e7eb;
  }
</style>
