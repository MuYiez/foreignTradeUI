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
      <a-form-item label="日期" name="date">
        <a-date-picker
          v-model:value="formState.date"
          placeholder="选择日期"
          style="width: 100%"
          @change="selectDate"
          :disabled-date="disabledDate"
        />
      </a-form-item>
      <a-form-item label="操作费A(CNY)" name="operatingCost">
        <a-input
          style="width: 100%"
          v-model:value="formState.operatingCost"
          placeholder="请输入操作费A(CNY)"
          type="number"
        />
      </a-form-item>
      <a-form-item label="预估比例" name="estimatedProportion">
        <a-input
          style="width: 100%"
          v-model:value="formState.estimatedProportion"
          placeholder="请输入预估比例"
          type="number"
          suffix="%"
        />
      </a-form-item>
      <a-form-item label="汇率E" name="exchangeRate">
        <a-input
          style="width: 100%"
          v-model:value="formState.exchangeRate"
          placeholder="请输入汇率E"
          type="number"
        />
      </a-form-item>
      <a-form-item label="PayPal提现费(USD)" name="paypalWithdrawDeposit">
        <a-input
          style="width: 100%"
          v-model:value="formState.paypalWithdrawDeposit"
          placeholder="请输入PayPal提现费(USD)"
          type="number"
        />
      </a-form-item>
      <a-form-item label="克重单价(CNY)">
        <a-form
          ref="formRef"
          :model="formState"
          :label-col="{ span: 12 }"
          :wrapper-col="{ span: 10 }"
          :rules="rules"
        >
          <a-row>
            <a-col class="gutter-row" :span="8">
              <a-form-item label="无" name="D01">
                <a-input
                  style="width: 100%"
                  v-model:value="formState.D01"
                  placeholder="请输入克重单价"
                  type="number"
                />
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-form-item label="含电(内电)" name="D02">
                <a-input
                  style="width: 100%"
                  v-model:value="formState.D02"
                  placeholder="请输入克重单价"
                  type="number"
                />
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-form-item label="纯电" name="D03">
                <a-input
                  style="width: 100%"
                  v-model:value="formState.D03"
                  placeholder="请输入克重单价"
                  type="number"
                />
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-form-item label="液体(特货)" name="D04">
                <a-input
                  style="width: 100%"
                  v-model:value="formState.D04"
                  placeholder="请输入克重单价"
                  type="number"
                />
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-form-item label="粉末(特货)" name="D05">
                <a-input
                  style="width: 100%"
                  v-model:value="formState.D05"
                  placeholder="请输入克重单价"
                  type="number"
                />
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-form-item label="膏体(特货)" name="D06">
                <a-input
                  style="width: 100%"
                  v-model:value="formState.D06"
                  placeholder="请输入克重单价"
                  type="number"
                />
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-form-item label="带磁(特货)" name="D07">
                <a-input
                  style="width: 100%"
                  v-model:value="formState.D07"
                  placeholder="请输入克重单价"
                  type="number"
                />
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-form-item label="含非液体化妆品" name="D08">
                <a-input
                  style="width: 100%"
                  v-model:value="formState.D08"
                  placeholder="请输入克重单价"
                  type="number"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button v-if="hasPermission(['04002'])" type="primary" @click="onSubmit">保存</a-button>
        <!-- <a-button style="margin-left: 10px" @click="resetForm">重置</a-button> -->
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
  import { onMounted, ref } from 'vue';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { formState, rules, FormState } from './data';
  import { search, change } from '/@/api/grossProfitTable/parameter';
  import { useMessage } from '/@/hooks/web/useMessage';
  import moment, { Moment } from 'moment';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { createMessage } = useMessage();
  export default {
    setup() {
      const { hasPermission } = usePermission();
      const title = ref('参数设置');
      const formRef = ref();

      onMounted(() => {
        let sendData = {
          date: moment(new Date()).format('YYYY-MM-DD'),
        };
        getData(sendData);
      });

      const disabledDate = (current: Moment) => {
        return current > moment().endOf('day');
      };

      const selectDate = () => {
        const sendData = {
          date: moment(formState.date).format('YYYY-MM-DD'),
        };
        getData(sendData);
      };

      const getData = (sendData) => {
        //数据回显
        search(sendData).then((res) => {
          for (const key in res) {
            formState[key] = JSON.stringify(res[key]);
          }
        });
      };

      //提交
      const onSubmit = () => {
        formRef.value
          .validate()
          .then(() => {
            let sendData: any = {
              ...formState,
              date: moment(formState.date).format('YYYY-MM-DD'),
            };
            change(sendData).then(() => {
              createMessage.success('保存成功');
            });
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
        disabledDate,
        onSubmit,
        resetForm,
        selectDate,
        hasPermission
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
