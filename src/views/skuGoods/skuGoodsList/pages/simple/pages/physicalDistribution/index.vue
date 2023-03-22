<template>
  <div>
    <!-- 报关信息 Start -->
    <div class="form-wrap">
      <div class="title">报关信息</div>
      <a-form-item label="报关中文名" name="declare_cn">
        <a-input
          v-model:value="formState.declare_cn"
          :suffix="formState.declare_cn ? formState.declare_cn.length : 0 + '/50'"
          :maxlength="50"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="报关英文名" name="declare_en">
        <a-input
          v-model:value="formState.declare_en"
          :suffix="formState.declare_en ? formState.declare_en.length : 0 + '/50'"
          :maxlength="50"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="报关价格" name="declare_price">
        <a-input
          disabled
          type="number"
          v-model:value="formState.declare_price"
          suffix="USD"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="报关重量" name="declare_weight">
        <a-input
          disabled
          type="number"
          v-model:value="formState.declare_weight"
          suffix="g"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="材质" name="material_quality">
        <a-input v-model:value="formState.material_quality" allow-clear />
      </a-form-item>
      <a-form-item label="用途" name="purpose">
        <a-input v-model:value="formState.purpose" allow-clear />
      </a-form-item>
      <a-form-item label="海关编码" name="customs_id">
        <a-input v-model:value="formState.customs_id" allow-clear />
      </a-form-item>
      <a-form-item label="危险运输品" name="dangerous_goods">
        <a-radio-group name="dangerous_goods" v-model:value="formState.dangerous_goods">
          <a-radio value="D01">无</a-radio>
          <a-radio value="D02">含电(内电)</a-radio>
          <a-radio value="D03">纯电</a-radio>
          <a-radio value="D04">液体(特货)</a-radio>
          <a-radio value="D05">粉末(特货)</a-radio>
          <a-radio value="D06">膏体(特货)</a-radio>
          <a-radio value="D07">带磁(特货)</a-radio>
          <a-radio value="D08">含非液体化妆品</a-radio>
        </a-radio-group>
      </a-form-item>
    </div>
    <!-- 报关信息 End -->

    <!-- 包装信息 Start -->
    <!-- <div class="form-wrap">
      <div class="title">包装信息</div>
      <a-row>
        <div>
          <a-col :span="12"> </a-col>
          <a-col :span="12"> </a-col>
        </div>
      </a-row>
    </div> -->
    <!-- 包装信息 End -->
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  export default defineComponent({
    props: ['formState', 'sku_goods_id'],
    setup() {
      onMounted(() => {});

      return {};
    },
  });
</script>

<style lang="less" scoped>
  .form-wrap {
    background-color: #fff;
    padding: 10px;
    margin-bottom: 20px;
    .title {
      font-size: 16px;
      margin-bottom: 20px;
      font-weight: 900;
      padding-bottom: 10px;
      border-bottom: 1px solid #e5e7eb;
    }

    :deep(.ant-form-item) {
      margin-bottom: 20px;
    }
  }
  .clearfix {
    padding: 0 80px;
  }
</style>
