<template>
  <div class="detail-wrap">
    <a-table
      :dataSource="data.dataSource"
      :columns="columns"
      row-key="sku_goods_id"
      :pagination="pagination"
      :loading="loading"
    >
      <template #img="{ record }">
        <div style="height: 68px; width: 68px;overflow: hidden;">
          <a-image v-if="record.img_url" :width="68" :height="68" :src="record.img_url" />
          <img v-else src="../../../../../assets/images/kong.png" />
        </div>
      </template>
      <template #goodsInfo="{ record }">
        <div style="color: #428bca">{{ record.sku_goods_id }}</div>
        <div>{{ record.name_cn }}</div>
        <div style="color: #a0a3a6"
          >[{{ record.spu }}] [{{ record.classifyName }} - {{ record.classifyType }}]</div
        >
      </template>
      <template #size="{ record }">
        <div>{{ record.length }}*{{ record.wide }}*{{ record.height }}</div>
      </template>
      <template #status="{ record }">
        <a-select
          ref="select"
          v-model:value="record.status"
          style="width: 120px"
          @change="changeGoodsStatuFn(record)"
        >
          <a-select-option value="A01">在售</a-select-option>
          <a-select-option value="A02">热销</a-select-option>
          <a-select-option value="A03">新品</a-select-option>
          <a-select-option value="A04">清仓</a-select-option>
          <a-select-option value="A05">停售</a-select-option>
        </a-select>
      </template>
      <template #time="{ record }">
        <div>
          <span>创建：</span>
          <br />
          <span>{{ record.insert_time }}</span>
        </div>
        <div>
          <span>更新：</span>
          <br />
          <span>{{ record.update_time }}</span>
        </div>
      </template>
      <template #action="{ record }">
        <div> <a @click="editWarehouseFn(record)" v-if="hasPermission(['02005'])">编辑仓库</a></div>
        <div>
          <a @click="editGoods(record)" v-if="hasPermission(['02003'])"> 编辑 </a>
        </div>
        <div>
          <a-popconfirm title="是否确认删除？" @confirm="deleteGoods(record)">
            <a v-if="hasPermission(['02004'])">删除</a>
          </a-popconfirm>
        </div>
      </template>
    </a-table>

    <!-- 仓库信息弹窗 Start -->
    <a-modal
      v-model:visible="visible"
      width="80%"
      bodyStyle="padding:20px"
      title="编辑仓库信息"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-table
        :dataSource="warehouseData"
        :columns="warehouseColumns"
        row-key="sku_goods_id"
        :pagination="false"
      >
        <template #img="{ record }">
          <div style="height: 68px; width: 68px">
            <a-image v-if="record.img_url" :width="68" :height="68" :src="record.img_url" />
            <img v-else src="../../../../../assets/images/kong.png" />
          </div>
        </template>
        <template #goodsInfo="{ record }">
          <div style="color: #428bca">{{ record.sku_goods_id }}</div>
          <div>{{ record.name_cn }}</div>
        </template>
        <template #weight="{ record }">
          <a-input type="number" v-model:value="record.weight" placeholder="请输入"></a-input>
        </template>
        <template #size="{ record }">
          长：
          <a-input
            type="number"
            v-model:value="record.length"
            placeholder="长"
            style="width: 100px; margin-right: 5px"
            min="0"
          ></a-input>
          宽：
          <a-input
            type="number"
            v-model:value="record.wide"
            placeholder="宽"
            style="width: 100px; margin-right: 5px"
            min="0"
          ></a-input>
          高：
          <a-input
            type="number"
            v-model:value="record.height"
            placeholder="高"
            style="width: 100px"
            min="0"
          ></a-input>
        </template>
      </a-table>
    </a-modal>
    <!-- 仓库信息弹窗 End -->
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, onMounted, ref } from 'vue';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { data, columns, warehouseColumns } from './data';
  import {
    goodsInfoSearch,
    goodsInfoDelete,
    changeGoodsStatus,
    editWarehouse,
  } from '/@/api/skuGoods/goodsInfo';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  import { usePermission } from '/@/hooks/web/usePermission';

  export default defineComponent({
    components: {
      DownOutlined,
    },
    setup() {
      const { hasPermission } = usePermission();
      const go = useGo();
      const loading = ref(false);
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
      const formStateData = ref(<any>{});
      const warehouseData = ref(<any>[]);
      const visible = ref(false);

      onMounted(() => {
        getData({});
      });

      const getData = (formState: any) => {
        formStateData.value = JSON.parse(JSON.stringify(formState));
        let sendData = {
          ...formState,
          pageSize: pagination.pageSize,
          pageNum: pagination.pageNo,
        };
        loading.value = true;
        goodsInfoSearch(sendData)
          .then((res) => {
            data.dataSource = res.list;
            pagination.total = parseInt(res.total);
            pagination.showTotal = (total) => `共 ${total} 条`;
            loading.value = false;
          })
          .catch(() => {
            loading.value = false;
          });
      };

      const onSizeChange = (current, pageSize) => {
        pagination.pageNo = 1;
        pagination.pageSize = pageSize;
        getData(formStateData.value);
      };
      const onPageChange = (page) => {
        pagination.pageNo = page;
        getData(formStateData.value);
      };

      const editGoods = (record) => {
        go('/skuGoods/skuGoodsList/editSimpleSkuGoods?sku_goods_id=' + record.sku_goods_id);
      };

      const deleteGoods = (record) => {
        goodsInfoDelete({ sku_goods_id: record.sku_goods_id, spu: record.spu }).then(() => {
          createMessage.success('商品信息删除成功！');
          getData(formStateData.value);
        });
      };

      const changeGoodsStatuFn = (record) => {
        const { status, sku_goods_id } = record;
        changeGoodsStatus({ status, sku_goods_id }).then(() => {
          createMessage.success('商品状态修改成功！');
        });
      };

      const editWarehouseFn = (record) => {
        warehouseData.value = [record];
        visible.value = true;
      };

      const handleOk = () => {
        editWarehouse({ list: warehouseData.value }).then(() => {
          getData(formStateData.value);
          createMessage.success('仓库信息修改成功！');
          visible.value = false;
        });
      };

      const handleCancel = () => {
        visible.value = false;
      };

      return {
        data,
        columns,
        loading,
        pagination,
        visible,
        warehouseData,
        warehouseColumns,
        deleteGoods,
        editGoods,
        getData,
        changeGoodsStatuFn,
        hasPermission,
        editWarehouseFn,
        handleOk,
        handleCancel,
      };
    },
  });
</script>

<style lang="less"></style>
