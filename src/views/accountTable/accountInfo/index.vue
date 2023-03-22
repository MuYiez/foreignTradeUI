<template>
  <div class="gutter-example">
    <div class="form-wrap">
      <p class="title">账单查询</p>
      <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="8">
            <a-form-item label="查询日期">
              <a-range-picker
                v-model:value="formState.date"
                placeholder="选择日期"
                style="width: 100%"
                allowClear
                showTime
              />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <a-form-item label="类型">
              <a-select ref="select" v-model:value="formState.type" style="width: 100%" allowClear>
                <a-select-option v-for="item in optionList.type" :key="item.id" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <a-form-item label="付款方式">
              <a-select
                ref="select"
                v-model:value="formState.paymentMethod"
                style="width: 100%"
                allowClear
              >
                <a-select-option
                  v-for="item in optionList.paymentMethod"
                  :key="item.id"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <a-form-item label="付款情况">
              <a-select
                ref="select"
                v-model:value="formState.paymentReady"
                style="width: 100%"
                allowClear
              >
                <a-select-option
                  v-for="item in optionList.paymentReady"
                  :key="item.id"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="btn-wrap">
        <a-button type="primary" style="margin-right: 20px" @click="getData">查询</a-button>
        <a-button v-if="hasPermission(['05002'])" @click="addAccount">记账</a-button>
      </div>
    </div>

    <div style="padding-top: 20px">
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="6">
          <div class="gutter-box">
            <div class="gutter-top">支出金额</div>
            <div class="gutter-bottom" style="color: green"
              >￥{{ formatAmt(accountTotalData.expand) }}</div
            >
          </div>
        </a-col>
        <a-col class="gutter-row" :span="6">
          <div class="gutter-box">
            <div class="gutter-top">收入金额</div>
            <div class="gutter-bottom" style="color: red"
              >￥{{ formatAmt(accountTotalData.income) }}</div
            >
          </div>
        </a-col>
        <a-col class="gutter-row" :span="6">
          <div class="gutter-box">
            <div class="gutter-top">总金额</div>
            <div class="gutter-bottom">￥{{ formatAmt(accountTotalData.amount) }}</div>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="6">
          <div class="gutter-box">
            <div class="gutter-top">账单数</div>
            <div class="gutter-bottom">{{ accountTotalData.total }}</div>
          </div>
        </a-col>
      </a-row>
    </div>

    <div class="detail-wrap">
      <p class="title">账单列表</p>
      <a-table
        :dataSource="accountDataSource"
        :columns="accountColumns"
        row-key="id"
        :pagination="pagination"
        :loading="loading"
      >
        <template #type="{ text }">
          {{ optionList.type.find((res) => res.value == text)?.label }}
        </template>
        <template #paymentMethod="{ text }">
          {{ optionList.paymentMethod.find((res) => res.value == text)?.label }}
        </template>
        <template #paymentReady="{ record }">
          <a-select
            v-if="hasPermission(['05002'])"
            ref="select"
            v-model:value="record.paymentReady"
            style="width: 100%"
            @change="changePaymentReadyFn(record)"
          >
            <a-select-option
              v-for="item in optionList.paymentReady"
              :key="item.id"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <div v-else>
            {{ optionList.paymentReady.find((i) => i.id === record.paymentReady)?.label }}</div
          >
        </template>
        <template #action="{ record }">
          <a v-if="hasPermission(['05002'])" @click="editAccount(record)">编辑</a>
          <a-popconfirm title="是否确认删除？" @confirm="deleteAccount(record)">
            <a v-if="hasPermission(['05003'])" style="margin-left: 10px">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>

    <!-- 输入值弹窗 Start -->
    <a-modal
      v-model:visible="visible"
      width="80%"
      bodyStyle="padding:20px"
      title="账单信息"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="false"
        :rowKey="(record, index) => index"
        bordered
        size="small"
      >
        <template #date="{ record }">
          <a-date-picker
            style="width: 100%"
            v-model:value="record.date"
            placeholder="请选择日期"
            showTime
          />
        </template>
        <template #expand="{ record }">
          <a-input
            type="number"
            style="width: 100%"
            v-model:value="record.expand"
            placeholder="请输入支出金额"
          />
        </template>
        <template #income="{ record }">
          <a-input
            type="number"
            style="width: 100%"
            v-model:value="record.income"
            placeholder="请输入收入金额"
          />
        </template>
        <template #type="{ record }">
          <a-select ref="select" v-model:value="record.type" style="width: 100%">
            <a-select-option v-for="item in optionList.type" :key="item.id" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </template>
        <template #paymentMethod="{ record }">
          <a-select ref="select" v-model:value="record.paymentMethod" style="width: 100%">
            <a-select-option
              v-for="item in optionList.paymentMethod"
              :key="item.id"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </template>
        <template #paymentReady="{ record }">
          <a-select ref="select" v-model:value="record.paymentReady" style="width: 100%">
            <a-select-option
              v-for="item in optionList.paymentReady"
              :key="item.id"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </template>
        <template #origin="{ record }">
          <a-textarea v-model:value="record.origin" placeholder="请输入事由" :rows="2" />
        </template>
        <template #action="{ index }">
          <a @click="removeTable(index)">移除</a>
        </template>
      </a-table>
      <div style="text-align: center; padding-top: 10px">
        <PlusSquareTwoTone style="font-size: 30px; margin: auto 0" @click="addTable" />
      </div>
    </a-modal>
    <!-- 输入值弹窗 End -->

    <!-- 修改账单弹窗 Start -->
    <a-modal
      v-model:visible="editVisible"
      width="60%"
      bodyStyle="padding:20px"
      title="账单信息"
      @ok="handleEditOk"
    >
      <a-form
        ref="editFormRef"
        :model="editFormState"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="rules"
      >
        <a-form-item label="日期" name="date">
          <a-date-picker
            style="width: 100%"
            v-model:value="editFormState.date"
            placeholder="请选择日期"
            showTime
          />
        </a-form-item>
        <a-form-item label="支出(CNY)" name="expand">
          <a-input
            type="number"
            style="width: 100%"
            v-model:value="editFormState.expand"
            placeholder="请输入支出金额"
          />
        </a-form-item>
        <a-form-item label="收入(CNY)" name="income">
          <a-input
            type="number"
            style="width: 100%"
            v-model:value="editFormState.income"
            placeholder="请输入收入金额"
          />
        </a-form-item>
        <a-form-item label="类型" name="type">
          <a-select ref="select" v-model:value="editFormState.type" style="width: 100%">
            <a-select-option v-for="item in optionList.type" :key="item.id" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="付款方式" name="paymentMethod">
          <a-select ref="select" v-model:value="editFormState.paymentMethod" style="width: 100%">
            <a-select-option
              v-for="item in optionList.paymentMethod"
              :key="item.id"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="付款情况" name="paymentReady">
          <a-select ref="select" v-model:value="editFormState.paymentReady" style="width: 100%">
            <a-select-option
              v-for="item in optionList.paymentReady"
              :key="item.id"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="事由" name="origin">
          <a-textarea v-model:value="editFormState.origin" placeholder="请输入事由" :rows="2" />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 修改账单弹窗 Start -->
  </div>
</template>

<script lang="ts">
  import { ref, reactive, onMounted, defineComponent } from 'vue';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import {
    columns,
    formState,
    editFormState,
    FormState,
    rules,
    accountColumns,
    EditFormState,
  } from './data';
  import { PlusOutlined, PlusSquareTwoTone } from '@ant-design/icons-vue';
  import {
    parameterSearch,
    accountAdd,
    accountSearch,
    accountEdit,
    accountDelete,
    changePaymentReady,
  } from '/@/api/accountTable/account';
  import moment from 'moment';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { formatAmt } from '/@/utils/commom/format';
  import { usePermission } from '/@/hooks/web/usePermission';
  export default defineComponent({
    name: 'AccountInfo',
    components: {
      PlusOutlined,
      PlusSquareTwoTone,
    },
    setup() {
      const { hasPermission } = usePermission();
      const { createMessage } = useMessage();
      const optionList = reactive({
        type: <any>[],
        paymentMethod: <any>[],
        paymentReady: <any>[],
      });
      const visible = ref(false);
      const editVisible = ref(false);
      const loading = ref(false);
      const formRef = ref();
      const dataSource = ref(<any>[]);
      const accountDataSource = ref(<any>[]);
      const dataSourceItem = {
        date: moment(new Date()),
        expand: 0,
        income: 0,
        type: '',
        paymentMethod: '',
        paymentReady: '',
        origin: '',
      };
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
      let id = '';
      const editFormRef = ref();
      const accountTotalData = ref(<any>{});

      onMounted(() => {
        searchOption();
      });

      const searchOption = () => {
        parameterSearch({}).then((res) => {
          res.forEach((list) => {
            optionList[list.type].push(list);
          });
          getData();
        });
      };

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
            let date = <any>[];
            if (formState.date.length !== 0 && formState.date[0] && formState.date[1]) {
              date = [
                moment(formState.date[0]).format('YYYY-MM-DD HH:mm:ss'),
                moment(formState.date[1]).format('YYYY-MM-DD HH:mm:ss'),
              ];
            }
            let sendData = {
              ...formState,
              pageSize: pagination.pageSize,
              pageNum: pagination.pageNo,
              date,
            };
            loading.value = true;
            accountSearch(sendData).then((res) => {
              accountDataSource.value = res.list;
              accountTotalData.value = res.sum;
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
        dataSource.value = [];
      };

      const handleOk = () => {
        //检查输入是否完整
        let isFull = true;
        const list = <any>[];
        dataSource.value.forEach((res) => {
          if (!res.date || !res.type || !res.paymentMethod) {
            createMessage.error('请填写完整');
            isFull = false;
          }
          if (res.expand == 0 && res.income == 0) {
            createMessage.error('支出金额和收入金额不能同时为0');
            isFull = false;
          }
          list.push({
            ...res,
            date: moment(res.date).format('YYYY-MM-DD HH:mm:ss'),
          });
        });
        if (!isFull) {
          return;
        }
        accountAdd({ list }).then(() => {
          handleCancel();
          getData();
          createMessage.success('新增账单成功');
        });
      };

      const addAccount = () => {
        dataSource.value.push(
          JSON.parse(JSON.stringify({ ...dataSourceItem, date: moment(new Date()) })),
        );
        visible.value = true;
      };

      const addTable = () => {
        dataSource.value.push(
          JSON.parse(JSON.stringify({ ...dataSourceItem, date: moment(new Date()) })),
        );
      };

      const removeTable = (index) => {
        dataSource.value.splice(index, 1);
      };

      const editAccount = (record) => {
        for (const key in editFormState) {
          if (Object.prototype.hasOwnProperty.call(editFormState, key)) {
            editFormState[key] = record[key];
          }
        }
        editVisible.value = true;
        id = record.id;
      };

      const handleEditOk = () => {
        editFormRef.value
          .validate()
          .then(() => {
            const sendData = {
              ...editFormState,
              date: moment(editFormState.date).format('YYYY-MM-DD HH:mm:ss'),
              id,
            };
            accountEdit(sendData).then(() => {
              editVisible.value = false;
              createMessage.success('修改账单成功');
              getData();
            });
          })
          .catch((error: ValidateErrorEntity<EditFormState>) => {
            console.log('error', error);
          });
      };

      const deleteAccount = (record) => {
        accountDelete({ id: record.id }).then(() => {
          createMessage.success('删除账单成功');
          getData();
        });
      };

      const changePaymentReadyFn = (record) => {
        changePaymentReady({ id: record.id, paymentReady: record.paymentReady });
      };

      return {
        columns,
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        optionList,
        rules,
        visible,
        formRef,
        dataSource,
        formState,
        pagination,
        loading,
        accountColumns,
        accountDataSource,
        editVisible,
        editFormState,
        editFormRef,
        accountTotalData,
        getData,
        handleOk,
        handleCancel,
        addAccount,
        addTable,
        removeTable,
        deleteAccount,
        editAccount,
        handleEditOk,
        changePaymentReadyFn,
        formatAmt,
        hasPermission,
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
      font-size: 18px;
      padding: 5px 0;
    }
    .gutter-mid {
      font-size: 16px;
      font-weight: 500;
    }
    .gutter-bottom {
      font-size: 18px;
      font-weight: 500;
      color: #999;
      height: 30px;
    }
  }
</style>
