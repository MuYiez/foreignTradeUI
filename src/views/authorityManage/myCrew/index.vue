<template>
  <div class="gutter-example">
    <div class="form-wrap">
      <p class="title">成员查询</p>
      <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="8">
            <a-form-item label="成员">
              <a-cascader
                placeholder="请选择成员"
                v-model:value="formState.id"
                :options="user_options"
                change-on-select
              />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <a-form-item label="创建日期">
              <a-range-picker
                v-model:value="formState.createDate"
                placeholder="选择日期"
                style="width: 100%"
                allowClear
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="btn-wrap">
        <a-button type="primary" style="margin-right: 20px" @click="getData">查询</a-button>
        <a-button @click="addShopFn">新增成员</a-button>
        <a-button @click="sendMs">测试</a-button>
      </div>
    </div>

    <div class="detail-wrap">
      <p class="title">成员列表</p>
      <a-table
        :dataSource="shopDataSource"
        :columns="shopColumns"
        row-key="id"
        :pagination="pagination"
        :loading="loading"
      >
        <template #action="{ record }">
          <a @click="editShop(record)">编辑</a>
        </template>
      </a-table>
    </div>

    <!-- 输入值弹窗 Start -->
    <a-modal
      v-model:visible="visible"
      width="80%"
      bodyStyle="padding:20px"
      :title="title"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="member-wrap">
        <div class="form-item">
          <a-form
            ref="formRefEdit"
            :model="formStateEdit"
            :label-col="labelColEdit"
            :wrapper-col="wrapperColEdit"
            :rules="rules"
          >
            <a-form-item label="姓名" name="nickname">
              <a-input v-model:value="formStateEdit.nickname" placeholder="请输入姓名" />
            </a-form-item>
            <a-form-item label="邮箱" name="email">
              <a-input v-model:value="formStateEdit.email" placeholder="请输入邮箱" />
            </a-form-item>
            <a-form-item label="电话" name="phone">
              <a-input v-model:value="formStateEdit.phone" placeholder="请输入电话" />
            </a-form-item>
            <a-form-item label="账号" name="userName">
              <a-input v-model:value="formStateEdit.userName" placeholder="请输入账号" />
            </a-form-item>
            <a-form-item label="状态" name="status">
              <a-switch
                checked-children="启用"
                un-checked-children="停用"
                v-model:checked="formStateEdit.status"
              />
            </a-form-item>
            <a-form-item label="成员密码" name="password">
              <a-input
                :type="inputType"
                v-model:value="formStateEdit.password"
                placeholder="请输入成员密码"
                @click="onSetType"
              />
            </a-form-item>
            <a-form-item label="确认密码" name="repassword">
              <a-input
                :type="inputType"
                v-model:value="formStateEdit.repassword"
                placeholder="请输入确认密码"
                @click="onSetType"
              />
            </a-form-item>
            <a-form-item label="主页" name="home_page">
              <a-cascader
                placeholder="请选择主页"
                v-model:value="formStateEdit.home_page"
                :options="homePageData"
              />
            </a-form-item>
          </a-form>
        </div>
        <div class="auth-item">
          <p>权限菜单</p>
          <a-tree
            checkable
            :tree-data="treeData"
            v-model:checkedKeys="checkedKeys"
            v-model:expandedKeys="expandedKeys"
          ></a-tree>
        </div>
      </div>
    </a-modal>
    <!-- 输入值弹窗 End -->
  </div>
</template>

<script lang="ts">
  import { ref, reactive, onMounted, defineComponent, watch } from 'vue';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import {
    columns,
    formState,
    shopColumns,
    FormState,
    rules,
    formStateEdit,
    EditFormState,
  } from './data';
  import { PlusOutlined, PlusSquareTwoTone } from '@ant-design/icons-vue';
  import {
    search,
    getMyCrew,
    getMenu,
    getCrewMenu,
    editCrew,
    addCrew,
    getHomePage,
    complexity
  } from '/@/api/authorityManage/crewInfo';
  import moment from 'moment';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { TreeDataItem } from 'ant-design-vue/es/tree/Tree';
  export default defineComponent({
    name: 'MyCrew',
    components: {
      PlusOutlined,
      PlusSquareTwoTone,
    },
    setup() {
      const { createMessage } = useMessage();
      const visible = ref(false);
      const editVisible = ref(false);
      const loading = ref(false);
      const formRef = ref();
      const shopDataSource = ref(<any>[]);
      const pagination = reactive({
        pageNo: 1,
        pageSize: 10, // 默认每页显示数量
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
        showTotal: (total) => `共 ${total} 条`, // 显示总数
        onShowSizeChange: (current, pageSize) => onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page) => onPageChange(page), //点击页码事件
        total: 0, //总条数
      });
      const user_options = ref(<any>[]);
      const formRefEdit = ref();
      const title = ref('新增成员');
      const isEdit = ref(false);
      const inputType = ref('text');
      const treeData = ref(<TreeDataItem>[]);
      const homePageData = ref(<any>[]);
      const checkedKeys = ref<string[]>([]);
      const expandedKeys = ref<string[]>([]);
      let id = '';

      onMounted(() => {
        getMyCrew({}).then((res) => {
          user_options.value = res;
        });
        getMenu({}).then((res) => {
          treeData.value = res.menu;
        });
        getHomePage({}).then((res) => {
          homePageData.value = res;
        });
        getData();
      });

      const onSizeChange = (current, pageSize) => {
        pagination.pageNo = 1;
        pagination.pageSize = pageSize;
        getData();
      };
      const onPageChange = (page) => {
        pagination.pageNo = page;
        getData();
      };

      const getData = () => {
        formRef.value
          .validate()
          .then(() => {
            let createDate = <any>[];
            if (
              formState.createDate.length !== 0 &&
              formState.createDate[0] &&
              formState.createDate[1]
            ) {
              createDate = [
                moment(formState.createDate[0]).format('YYYY-MM-DD'),
                moment(formState.createDate[1]).format('YYYY-MM-DD'),
              ];
            }
            let sendData = {
              ...formState,
              pageSize: pagination.pageSize,
              pageNum: pagination.pageNo,
              createDate,
            };
            loading.value = true;
            search(sendData).then((res) => {
              shopDataSource.value = res.list;
              pagination.total = parseInt(res.total);
              pagination.showTotal = (total) => `共 ${total} 条`;
              loading.value = false;
            });
          })
          .catch((error: ValidateErrorEntity<FormState>) => {
            console.log('error', error);
          });
      };

      const handleCancel = () => {
        visible.value = false;
        formStateEdit.nickname = '';
        formStateEdit.email = '';
        formStateEdit.phone = '';
        formStateEdit.userName = '';
        formStateEdit.password = '';
        formStateEdit.repassword = '';
        formStateEdit.status = true;
        formStateEdit.home_page = []
        checkedKeys.value = [];
        expandedKeys.value = [];
      };

      const handleOk = () => {
        formRefEdit.value
          .validate()
          .then(() => {
            const sendData = <any>{
              ...formStateEdit,
              status: formStateEdit.status ? 1 : 0,
              menu: checkedKeys.value,
              home_page: formStateEdit.home_page[0] + '/' + formStateEdit.home_page[1],
            };
            if (formStateEdit.password) {
              if (formStateEdit.password.length < 8) {
                createMessage.error('至少8位密码');
                return;
              }
              if (formStateEdit.password !== formStateEdit.repassword) {
                createMessage.error('密码不一致');
                return;
              }
            }
            if (!checkedKeys.value.length) {
              createMessage.error('请选择菜单权限');
              return;
            }
            if (isEdit.value) {
              sendData.id = id;
              editCrew(sendData).then(() => {
                createMessage.success('更新成员信息成功');
                handleCancel();
                getData();
              });
            } else {
              if (!formStateEdit.password) {
                createMessage.error('请输入密码');
                return;
              }
              addCrew(sendData).then(() => {
                createMessage.success('新增成员信息成功');
                handleCancel();
                getData();
              });
            }
          })
          .catch((error: ValidateErrorEntity<EditFormState>) => {
            console.log('error', error);
          });
      };

      const addShopFn = () => {
        visible.value = true;
        title.value = '新增成员';
        isEdit.value = false;
      };

      const editShop = (record) => {
        for (const key in formStateEdit) {
          if (Object.prototype.hasOwnProperty.call(formStateEdit, key)) {
            formStateEdit[key] = record[key];
          }
          formStateEdit.status = record.status ? true : false;
          const home_page = record.home_page.split('/');
          formStateEdit.home_page = ['/' + home_page[1], home_page[2]];
        }
        getCrewMenu({ id: record.id }).then((res) => {
          id = record.id;
          checkedKeys.value = res;
          expandedKeys.value = res;
          visible.value = true;
          title.value = '编辑成员';
          isEdit.value = true;
        });
      };

      const onSetType = () => {
        inputType.value = 'password';
      };

      const sendMs = () => {
        complexity({ prompt: 'I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with \"Unknown\".\n\nQ: What is human life expectancy in the United States?\nA: Human life expectancy in the United States is 78 years.\n\nQ: Who was president of the United States in 1955?\nA: Dwight D. Eisenhower was president of the United States in 1955.\n\nQ: Which party did he belong to?\nA: He belonged to the Republican Party.\n\nQ: What is the square root of banana?\nA: Unknown\n\nQ: How does a telescope work?\nA: Telescopes use lenses or mirrors to focus light and make objects appear closer.\n\nQ: Where were the 1992 Olympics held?\nA: The 1992 Olympics were held in Barcelona, Spain.\n\nQ: How many squigs are in a bonk?\nA: Unknown\n\nQ: Where is the Valley of Kings?\nA:' }).then((res) => {
          console.log(res)
        });
      };

      return {
        columns,
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        title,
        rules,
        visible,
        formRef,
        formState,
        pagination,
        loading,
        formRefEdit,
        shopColumns,
        labelColEdit: { span: 6 },
        wrapperColEdit: { span: 16 },
        treeData,
        inputType,
        user_options,
        formStateEdit,
        shopDataSource,
        editVisible,
        isEdit,
        getData,
        handleOk,
        handleCancel,
        addShopFn,
        editShop,
        onSetType,
        checkedKeys,
        expandedKeys,
        homePageData,
        sendMs
      };
    },
  });
</script>

<style lang="less" scoped>
  .gutter-example {
    background: transparent;
    border: 0;
    padding: 20px;
  }
  .form-wrap {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
  }
  .btn-wrap {
    text-align: center;
  }
  .title {
    font-size: 20px;
    font-weight: 900;
    padding-bottom: 10px;
    border-bottom: 1px solid #e5e7eb;
  }
  .detail-wrap {
    margin-top: 20px;
    padding: 20px;
    background-color: #fff;
  }
  .gutter-box {
    background-color: #fff;
    border-radius: 5px;
    padding: 10px;
    .gutter-top {
      font-size: 12px;
      padding: 5px 0;
    }
    .gutter-mid {
      font-size: 16px;
      font-weight: 500;
    }
    .gutter-bottom {
      font-size: 12px;
      color: #999;
      height: 20px;
    }
  }
  .member-wrap {
    display: flex;
    .form-item {
      width: 61.8%;
    }
    .auth-item {
      width: 38.2%;
    }
  }
</style>
