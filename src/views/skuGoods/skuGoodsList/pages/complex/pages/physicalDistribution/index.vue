<template>
  <div>
    <!-- 报关信息 Start -->
    <div class="form-wrap">
      <div class="title">报关信息</div>
      <!-- 编辑变种表格信息 Start -->
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="false"
        rowKey="sku_goods_id"
      >
        <!-- 表头图标插槽 Start -->
        <template #filterDropdown="{ column }">
          <div style="padding: 8px">
            <a-button size="small" style="width: 90px" @click="applyAll(column)">
              应用全部
            </a-button>
          </div>
        </template>
        <template #filterIcon="filtered">
          <EditTwoTone :style="{ color: filtered ? '#108ee9' : undefined }" />
        </template>
        <!-- 表头图标插槽 End -->

        <template #img="{ record }">
          <div style="width: 52px; height: 52px">
            <a-image v-if="record.img" :src="record.img" />
            <img v-else src="../../../../../../../assets/images/kong.png" />
          </div>
        </template>
        <template #declare_cn="{ index }">
          <a-textarea v-model:value="dataSource[index].declare_cn" placeholder="请输入" :rows="2" />
        </template>
        <template #declare_en="{ index }">
          <a-textarea v-model:value="dataSource[index].declare_en" placeholder="请输入" :rows="2" />
        </template>
        <template #declare_price="{ index }">
          <a-input
            type="number"
            v-model:value="dataSource[index].declare_price"
            placeholder="请输入"
            disabled
          ></a-input>
        </template>
        <template #declare_weight="{ index }">
          <a-input
            type="number"
            v-model:value="dataSource[index].declare_weight"
            placeholder="请输入"
            disabled
          ></a-input>
        </template>
        <template #material_quality="{ index }">
          <a-input
            v-model:value="dataSource[index].material_quality"
            placeholder="请输入"
          ></a-input>
        </template>
        <template #purpose="{ index }">
          <a-input v-model:value="dataSource[index].purpose" placeholder="请输入"></a-input>
        </template>
        <template #customs_id="{ index }">
          <a-input v-model:value="dataSource[index].customs_id" placeholder="请输入"></a-input>
        </template>
        <template #dangerous_goods="{ index }">
          <a-select
            style="width: 100%"
            name="dangerous_goods"
            v-model:value="dataSource[index].dangerous_goods"
          >
            <a-select-option value="D01">无</a-select-option>
            <a-select-option value="D02">含电(内电)</a-select-option>
            <a-select-option value="D03">纯电</a-select-option>
            <a-select-option value="D04">液体(特货)</a-select-option>
            <a-select-option value="D05">粉末(特货)</a-select-option>
            <a-select-option value="D06">膏体(特货)</a-select-option>
            <a-select-option value="D07">带磁(特货)</a-select-option>
            <a-select-option value="D08">含非液体化妆品</a-select-option>
          </a-select>
        </template>
        <template #action="{ record }">
          <div class="editable-row-operations">
            <a @click="applyAll(record)">应用全部</a>
          </div>
        </template>
      </a-table>
      <!-- 编辑变种表格信息 End -->
    </div>
    <!-- 报关信息 End -->

    <!-- 应用全部输入框 Start -->
    <a-modal
      :visible="applyVisible"
      :title="'修改' + applyAllData.title"
      @cancel="handleApplyCancel"
      bodyStyle="padding:20px"
    >
      <div v-if="applyAllData.key === 'dangerous_goods'">
        <a-select style="width: 100%" v-model:value="applyInputData">
          <a-select-option value="D01">无</a-select-option>
          <a-select-option value="D02">含电(内电)</a-select-option>
          <a-select-option value="D03">纯电</a-select-option>
          <a-select-option value="D04">液体(特货)</a-select-option>
          <a-select-option value="D05">粉末(特货)</a-select-option>
          <a-select-option value="D06">膏体(特货)</a-select-option>
          <a-select-option value="D07">带磁(特货)</a-select-option>
          <a-select-option value="D08">含非液体化妆品</a-select-option>
        </a-select>
      </div>
      <div v-else>
        <a-textarea
          :rows="4"
          v-model:value="applyInputData"
          :placeholder="'请填写' + applyAllData.title"
        />
      </div>
      <template #footer>
        <a-button key="back" @click="handleApplyCancel">关闭</a-button>
        <a-button key="submit" type="primary" @click="handleApplyOk">确认</a-button>
      </template>
    </a-modal>
    <!-- 应用全部输入框 End -->
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, UnwrapRef } from 'vue';
  import { columns, weightColumns } from './data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { EditTwoTone } from '@ant-design/icons-vue';

  export default defineComponent({
    props: {
      formState: {
        type: Object,
        default: () => {},
      },
      strategicPassList: {
        type: Array,
        default: () => [],
      },
    },
    components: {
      EditTwoTone,
    },
    setup() {
      const { createMessage } = useMessage();
      const dataSource: UnwrapRef<any> = ref([]);
      const weightDataSource: UnwrapRef<any> = ref([]);
      const applyAllData = ref(<any>{});
      const applyInputData = ref('');
      const applyVisible = ref<boolean>(false);

      onMounted(() => {});

      //应用全部
      const applyAll = (column) => {
        if (dataSource.value.length === 0) {
          createMessage.error('没有商品信息，请先创建商品');
          applyVisible.value = false;
          return;
        }
        applyAllData.value = column;
        applyVisible.value = true;
      };

      //获取列表
      const getStrategicPassList = (data) => {
        //判断是否修改过
        if (data.isChange2) {
          //判断是否为第一次输入
          dataSource.value = data.list;
        }
      };

      const handleApplyCancel = () => {
        applyInputData.value = '';
        applyVisible.value = false;
      };

      const handleApplyOk = () => {
        dataSource.value = dataSource.value.map((element) => {
          element[applyAllData.value.key] = applyInputData.value;
          return element;
        });
        applyInputData.value = '';
        applyVisible.value = false;
      };

      return {
        columns,
        dataSource,
        weightColumns,
        weightDataSource,
        applyInputData,
        applyVisible,
        applyAllData,
        applyAll,
        getStrategicPassList,
        handleApplyCancel,
        handleApplyOk,
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
