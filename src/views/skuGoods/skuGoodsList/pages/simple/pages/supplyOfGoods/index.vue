<template>
  <div>
    <!-- 采购信息 Start -->
    <div class="form-wrap">
      <div class="title">采购信息</div>
      <a-form-item label="采购参考价" name="purchase_ref_price">
        <a-input
          type="number"
          v-model:value="formState.purchase_ref_price"
          allow-clear
          placeholder="是指商品管理维护的基础参考价格。 采购下单单价和仓库清单初始化时单价都引用的采购参考价。"
        />
      </a-form-item>
    </div>
    <!-- 采购信息 End -->
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  export default defineComponent({
    props: ['formState'],
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
