<template>
  <div class="all-wrap">
    <p class="title">{{ title }}</p>
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="rules"
    >
      <a-form-item label="用户名" name="userName">
        <a-input v-model:value="formState.userName" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="formState.email" placeholder="请输入邮箱" />
      </a-form-item>
      <a-form-item label="标签" name="tagList">
        <a-select
          v-model:value="formState.tagList"
          show-search
          placeholder="请输入标签搜索"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          :options="data"
          mode="multiple"
          @search="handleSearch"
        ></a-select>
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
  import { tagList, addUser, editUser } from '/@/api/userTagManagement/userTagManagement';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useRoute } from 'vue-router';
  const { createMessage } = useMessage();
  import { useGo } from '/@/hooks/web/usePage';
  export default {
    setup() {
      const title = ref('新增用户');
      const formRef = ref();
      const go = useGo();
      let route = useRoute();
      const data = ref<any[]>([]);

      onMounted(() => {
        if (route.query.id) {
          title.value = '修改用户';

          //数据回显
          let queryData = JSON.parse(JSON.stringify(route.query));
          for (const key in queryData) {
            formState[key] = queryData[key];
          }
          formState.tagList = JSON.parse(queryData.tagList).map((res) => {
            data.value.push({
              value: res.tagId,
              label: res.tagName,
            });
            return res.tagId;
          });
        }
      });

      const handleSearch = (val: string) => {
        tagList({ tagName: val, pageSize: 50, pageNum: 1 }).then((res) => {
          data.value = res.list.map((item) => {
            return { value: item.tagId, label: item.tagName };
          });
        });
      };

      //提交菜单申请
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(() => {
            let sendData: any = {
              ...formState,
              tagList: formState.tagList.map((res) => {
                return { tagId: res };
              }),
            };
            if (route.query.id) {
              sendData.id = route.query.id;
              editUser(sendData).then(() => {
                createMessage.success('用户修改成功');
                (formState.userName = ''), (formState.email = ''), (formState.tagList = []);
                go('/userTagManagement/searchTagUser');
              });
            } else {
              addUser(sendData).then(() => {
                createMessage.success('用户新增成功');
                formRef.value.resetFields();
                go('/userTagManagement/searchTagUser');
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
        data,
        onSubmit,
        resetForm,
        handleSearch,
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
