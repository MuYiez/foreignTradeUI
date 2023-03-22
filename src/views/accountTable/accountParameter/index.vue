<template>
  <div class="all-wrap">
    <p class="title">参数设置</p>
    <div>
      <ul>
        <li style="padding: 20px 0" v-for="item in typeList" :key="item.type">
          <span>{{ item.label }}：</span>
          <template v-for="(tag, index) in item.tags" :key="tag">
            <a-tooltip v-if="tag.length > 20" :title="tag">
              <a-tag
                @click="handleEdit(item.type, tag)"
                closable
                @close="handleClose(item.type, tag)"
              >
                {{ `${(tag.label + ' - ' + tag.value).slice(0, 20)}...` }}
              </a-tag>
            </a-tooltip>
            <a-tag
              v-else
              closable
              @close="handleClose(item.type, tag)"
              @click="handleEdit(item.type, tag)"
            >
              {{ tag.label }} - {{ tag.value }}
            </a-tag>
          </template>
          <a-tag
            class="finger"
            @click="showInput(item.type)"
            style="background: #fff; border-style: dashed"
          >
            <plus-outlined />
            新增
          </a-tag>
        </li>
      </ul>
    </div>

    <!-- 输入值弹窗 Start -->
    <a-modal
      v-model:visible="visible"
      bodyStyle="padding:20px 0 0"
      :title="(isChange ? '编辑' : '添加') + title + '值'"
      @ok="handleOk"
    >
      <a-form
        ref="formRef"
        :model="formState"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="rules"
      >
        <a-form-item label="名称" name="label">
          <a-input style="width: 100%" v-model:value="formState.label" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="值" name="value">
          <a-input style="width: 100%" v-model:value="formState.value" placeholder="请输入值" />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 输入值弹窗 End -->
  </div>
</template>

<script lang="ts">
  import { ref,  onMounted, defineComponent } from 'vue';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { formState, FormState, rules, typeList } from './data';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import {
    parameterSearch,
    parameterAdd,
    parameterDel,
    parameterEdit,
  } from '/@/api/accountTable/account';
  export default defineComponent({
    name: 'AccountParameter',
    components: {
      PlusOutlined,
    },
    setup() {
      const formRef = ref();
      const visible = ref(false);
      let changeType = '';
      const title = ref('');
      const isChange = ref(false);
      let editId = '';

      onMounted(() => {
        getData();
      });

      const getData = () => {
        parameterSearch({}).then((res) => {
          res.forEach((element) => {
            const index = typeList.findIndex((res) => res.type === element.type);
            typeList[index].tags.push(element);
          });
        });
      };

      const handleClose = (type: string, removedTag) => {
        parameterDel({ id: removedTag.id }).then(() => {
          const index = typeList.findIndex((res) => res.type === type);
          const tags = typeList[index].tags.filter((tag) => tag !== removedTag);
          typeList[index].tags = tags;
        });
      };

      const showInput = (type) => {
        formState.label = '';
        formState.value = '';
        changeType = type;
        const list = typeList.find((res) => res.type === type);
        title.value = list ? list.label : '';
        visible.value = true;
        isChange.value = false;
      };

      const handleOk = () => {
        formRef.value
          .validate()
          .then(() => {
            let sendData = {
              type: changeType,
              ...formState,
            };
            if (isChange.value) {
              parameterEdit({ ...sendData, id: editId }).then((res) => {
                const index = typeList.findIndex((res) => res.type === changeType);
                const inputValue = {
                  type: changeType,
                  ...formState,
                  id: editId,
                };
                const listIndex = typeList[index].tags.findIndex((res) => res.id === editId);
                typeList[index].tags[listIndex] = inputValue;
                visible.value = false;
              });
            } else {
              parameterAdd(sendData).then((res) => {
                const index = typeList.findIndex((res) => res.type === changeType);
                const inputValue = {
                  type: changeType,
                  ...formState,
                  id: res.id,
                };
                let tags = typeList[index].tags;
                if (inputValue && tags.indexOf(inputValue) === -1) {
                  tags = [...tags, inputValue];
                }
                typeList[index].tags = tags;
                visible.value = false;
              });
            }
          })
          .catch((error: ValidateErrorEntity<FormState>) => {
            console.log('error', error);
          });
      };

      const handleEdit = (type, tags) => {
        formState.label = tags.label;
        formState.value = tags.value;
        editId = tags.id;
        changeType = type;
        const list = typeList.find((res) => res.type === type);
        title.value = list ? list.label : '';
        visible.value = true;
        isChange.value = true;
      };

      return {
        handleClose,
        showInput,
        handleOk,
        handleEdit,
        formRef,
        visible,
        rules,
        formState,
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        typeList,
        title,
        isChange,
      };
    },
  });
</script>

<style lang="less" scoped>
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
  .finger {
    cursor: pointer;
  }
</style>
