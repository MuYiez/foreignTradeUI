<template>
  <div>
    <!-- 采购信息 Start -->
    <div class="form-wrap">
      <div class="title">采购信息</div>
      <div class="form-wrap">
        <div class="title">重量信息</div>
        <!-- 编辑变种表格信息 Start -->
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :pagination="false"
          rowKey="sku_goods_id"
        >
          <template #img="{ record }">
            <div style="width: 52px; height: 52px">
              <a-image v-if="record.img" :src="record.img" />
              <img v-else src="../../../../../../../assets/images/kong.png" />
            </div>
          </template>
          <template #purchase_ref_price="{ index }">
            <a-input
              type="number"
              v-model:value="dataSource[index].purchase_ref_price"
              placeholder="请输入"
            ></a-input>
          </template>
          <template #action="{ record }">
            <div class="editable-row-operations">
              <a @click="applyAll(record)">应用全部</a>
            </div>
          </template>
        </a-table>
        <!-- 编辑变种表格信息 End -->
      </div>
    </div>
    <!-- 采购信息 End -->
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, UnwrapRef } from 'vue';
  import { columns } from './data';
  export default defineComponent({
    props: ['formState'],
    setup() {
      const dataSource: UnwrapRef<any> = ref([]);

      onMounted(() => {});

      //应用全部
      const applyAll = (record: any) => {
        dataSource.value = dataSource.value.map((res) => {
          return {
            ...JSON.parse(JSON.stringify(record)),
            img: res.img,
            imgId: res.imgId,
            varietas_name: res.varietas_name,
            sku_goods_id: res.sku_goods_id,
          };
        });
      };

      //获取列表
      const getStrategicPassList = (data) => {
        if (data.isChange3) {
          //判断是否为第一次输入
          if (dataSource.value.length !== data.list.length) {
            dataSource.value = JSON.parse(JSON.stringify(data.list));
          } else {
            JSON.parse(JSON.stringify(data.list)).forEach((res, index) => {
              dataSource.value[index].img = res.img;
              dataSource.value[index].imgId = res.imgId;
              dataSource.value[index].sku_goods_id = res.sku_goods_id;
              dataSource.value[index].varietas_name = res.varietas_name;
            });
          }
        }
      };

      return {
        dataSource,
        columns,
        applyAll,
        getStrategicPassList,
      };
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
