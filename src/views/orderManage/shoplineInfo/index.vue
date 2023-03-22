<template>
  <div class="gutter-example">
    <div class="form-wrap">
      <p class="title">店铺查询</p>
      <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="8">
            <a-form-item label="归属人">
              <a-select v-model:value="formState.user" placeholder="请选择归属人" allow-clear>
                <a-select-option v-for="item in allUserData" :key="item.id" :value="item.id">
                  {{ item.nickname }}
                </a-select-option>
              </a-select>
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
        <a-button @click="addShopFn">新增店铺</a-button>
      </div>
    </div>

    <div class="detail-wrap">
      <p class="title">店铺列表</p>
      <a-table
        :dataSource="shopDataSource"
        :columns="shopColumns"
        row-key="shopline_name"
        :pagination="pagination"
        :loading="loading"
      >
        <template #action="{ record }">
          <a @click="editShop(record)">编辑</a>
          <a-popconfirm title="是否确认删除？" @confirm="deleteShopFn(record)">
            <a style="margin-left: 10px">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>

    <!-- 输入值弹窗 Start -->
    <a-modal
      v-model:visible="visible"
      width="80%"
      bodyStyle="padding:20px"
      title="店铺信息"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form
        ref="formRefEdit"
        :model="formStateEdit"
        :label-col="labelColEdit"
        :wrapper-col="wrapperColEdit"
        :rules="rules"
      >
        <a-form-item label="店铺名称" name="shopline_name">
          <a-input
            :disabled="isEdit"
            v-model:value="formStateEdit.shopline_name"
            placeholder="请输入店铺名称"
          />
        </a-form-item>
        <a-form-item label="创建时间" name="createDate">
          <a-date-picker v-model:value="formStateEdit.createDate" style="width: 100%" />
        </a-form-item>
        <a-form-item label="App Key" name="appkey">
          <a-input v-model:value="formStateEdit.appkey" placeholder="请输入App Key" />
        </a-form-item>
        <a-form-item label="APP Secret" name="APPSecret">
          <a-input v-model:value="formStateEdit.APPSecret" placeholder="请输入APP Secret" />
        </a-form-item>
        <a-form-item label="后台 API 访问令牌" name="token">
          <a-input v-model:value="formStateEdit.token" placeholder="请输入后台 API 访问令牌" />
        </a-form-item>
        <a-form-item label="归属人" name="user">
          <a-select v-model:value="formStateEdit.user" placeholder="请选择归属人" allow-clear>
            <a-select-option v-for="item in allUserData" :key="item.id" :value="item.id">
              {{ item.nickname }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 输入值弹窗 End -->
  </div>
</template>

<script lang="ts">
  import { ref, reactive, onMounted, defineComponent } from 'vue';
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
  import { addShop, searchShop, deleteShop, updateShop } from '/@/api/orderManage/shoplineInfo';
  import { allUser } from '/@/api/sys/user';
  import moment from 'moment';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: 'ShoplineInfo',
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
      const allUserData = ref(<any>[]);
      const formRefEdit = ref();
      const isEdit = ref(false);
      
      onMounted(() => {
        allUser({}).then((res) => {
          allUserData.value = res;
        });
        getData();
        formStateEdit.user = JSON.parse(localStorage.getItem('userInfo') ?? '').id;
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
            searchShop(sendData).then((res) => {
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
        formStateEdit.shopline_name = '';
        formStateEdit.appkey = '';
        formStateEdit.APPSecret = '';
        formStateEdit.token = '';
        formStateEdit.user = JSON.parse(localStorage.getItem('userInfo') ?? '').id;
      };

      const handleOk = () => {
        formRefEdit.value
          .validate()
          .then(() => {
            const sendData = {
              ...formStateEdit,
              createDate: moment(formStateEdit.createDate).format('YYYY-MM-DD'),
            };
            if (isEdit.value) {
              updateShop(sendData).then(() => {
                createMessage.success('更新店铺成功');
                handleCancel();
                getData();
              });
            } else {
              addShop(sendData).then(() => {
                createMessage.success('新增店铺成功');
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
        isEdit.value = false;
      };

      const editShop = (record) => {
        for (const key in formStateEdit) {
          if (Object.prototype.hasOwnProperty.call(formStateEdit, key)) {
            formStateEdit[key] = record[key];
          }
        }
        visible.value = true;
        isEdit.value = true;
      };

      const deleteShopFn = (record) => {
        deleteShop({ shopline_name: record.shopline_name }).then(() => {
          createMessage.success('删除店铺成功');
          getData();
        });
      };

      return {
        columns,
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        allUserData,
        rules,
        visible,
        formRef,
        formState,
        pagination,
        loading,
        formRefEdit,
        shopColumns,
        labelColEdit: { span: 6 },
        wrapperColEdit: { span: 12 },
        formStateEdit,
        shopDataSource,
        editVisible,
        isEdit,
        getData,
        handleOk,
        handleCancel,
        addShopFn,
        deleteShopFn,
        editShop,
      };
    },
  });
</script>

<style lang="less">
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
</style>
