<template>
  <div class="gutter-example">
    <div class="form-wrap">
      <p class="title">商品查询</p>
      <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row :gutter="16">
          <a-col class="gutter-row" v-if="activeKey === '1'" :span="8">
            <a-form-item label="商品名称">
              <a-input v-model:value="formState.name_cn" placeholder="请输入商品名称" allow-clear />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <a-form-item label="商品spu">
              <a-input
                @dblclick="btndbClick('SPU')"
                v-model:value="formState.spu"
                placeholder="双击可批量搜索"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-if="activeKey === '1'" :span="8">
            <a-form-item label="商品sku">
              <a-input
                @dblclick="btndbClick('SKU')"
                v-model:value="formState.sku_goods_id"
                placeholder="双击可批量搜索"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <a-form-item label="产品分类">
              <a-tree-select
                v-model:value="formState.goods_classify"
                style="width: 100%"
                show-search
                allow-clear
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="classifyData"
                placeholder="选择分类"
                tree-default-expand-all
              />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <a-form-item label="开发人员">
              <a-select
                v-model:value="formState.developer"
                placeholder="请选择开发人员"
                allow-clear
              >
                <a-select-option v-for="item in allUserData" :key="item.id" :value="item.id">
                  {{ item.nickname }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="btn-wrap">
        <a-button type="primary" style="margin-right: 20px" @click="getData">查询</a-button>
        <a-dropdown>
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item key="1">
                <UserOutlined />
                添加单个SKU
              </a-menu-item>
              <a-menu-item key="2">
                <UserOutlined />
                添加多属性SKU
              </a-menu-item>
              <div style="border-bottom: 1px dashed #999"></div>
              <a-menu-item key="3">
                <a-upload
                  name="file"
                  :showUploadList="false"
                  accept=".xlsx,.xls"
                  :beforeUpload="beforeUpload"
                >
                  上传商品信息
                </a-upload>
              </a-menu-item>
              <a-menu-item key="4">
                <a-upload
                  name="file"
                  :showUploadList="false"
                  accept=".xlsx,.xls"
                  :beforeUpload="beforeWarehouseUpload"
                >
                  上传仓库信息
                </a-upload>
              </a-menu-item>
              <!-- <a-menu-item key="5">
                <a-upload
                  name="file"
                  :showUploadList="false"
                  accept=".xlsx,.xls"
                  :beforeUpload="beforeFirstUpload"
                >
                  初次上传信息
                </a-upload>
              </a-menu-item> -->
            </a-menu>
          </template>
          <a-button type="warning" style="margin-right: 20px" v-if="hasPermission(['02002'])">
            添加商品
            <DownOutlined />
          </a-button>
        </a-dropdown>
      </div>
    </div>
    <a-tabs class="tabs-wrap" type="card" v-model:activeKey="activeKey" @change="changeTabs">
      <a-tab-pane key="1" tab="全部">
        <simpleSkuGoods ref="simpleSkuGoods" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="多变种">
        <spuGoods ref="spuGoods" />
      </a-tab-pane>
    </a-tabs>

    <a-modal
      :visible="doubleSearchVisible"
      title="批量查询"
      @cancel="handleDoubleSearchCancel"
      @ok="handleDoubleSearchOk"
      bodyStyle="padding:20px"
      width="60%"
    >
      <div style="padding-bottom: 10px; color: #666"
        >每行1个{{ doubleSearchData.type }}，最好别整太多，查询会很慢的~</div
      >
      <a-textarea
        v-model:value="doubleSearchData.data"
        :placeholder="
          '请输入商品' + doubleSearchData.type + '，多个商品' + doubleSearchData.type + '请换行'
        "
        :rows="10"
      />
    </a-modal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted } from 'vue';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { ref } from 'vue';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { formState, FormState } from './data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { uploadExcel, uploadWarehouseExcel, uploadAllExcel } from '/@/api/skuGoods/goodsInfo';
  import simpleSkuGoods from './search/simpleSkuGoods/index.vue';
  import spuGoods from './search/spuGoods/index.vue';
  import { classifyInfoSearch } from '/@/api/skuGoods/classifyInfo';
  import { allUser } from '/@/api/sys/user';
  import { notification } from 'ant-design-vue';
  import { usePermission } from '/@/hooks/web/usePermission';

  export default defineComponent({
    name: 'SkuGoodsList',
    components: {
      DownOutlined,
      simpleSkuGoods,
      spuGoods,
    },
    setup() {
      const { hasPermission } = usePermission();
      const { createMessage } = useMessage();
      const go = useGo();
      const formRef = ref();
      const simpleSkuGoods = ref();
      const spuGoods = ref();
      const activeKey = ref('1');
      const classifyData = ref([]);
      const allUserData = ref(<any>[]);
      const doubleSearchData = ref({
        type: '',
        data: '',
      });
      const doubleSearchVisible = ref<boolean>(false);

      onMounted(() => {
        classifyInfoSearch({}).then((res) => {
          classifyData.value = res;
        });
        allUser({}).then((res) => {
          allUserData.value = res;
        });
        getData();
      });

      const handleMenuClick = (e: any) => {
        if (e.key === '1') {
          go('/skuGoods/skuGoodsList/addSimpleSkuGoods');
        } else if (e.key === '2') {
          go('/skuGoods/skuGoodsList/addComplexSkuGoods');
        }
      };

      const getData = () => {
        const searchData = {
          ...formState,
          goods_classify: formState.goods_classify ? formState.goods_classify.split('----')[0] : '',
        };
        formRef.value
          .validate()
          .then(() => {
            if (activeKey.value === '1') {
              simpleSkuGoods.value.getData(JSON.parse(JSON.stringify(searchData)));
            } else if (activeKey.value === '2') {
              spuGoods.value.getData(JSON.parse(JSON.stringify(searchData)));
            }
          })
          .catch((error: ValidateErrorEntity<FormState>) => {
            console.log('error', error);
          });
      };

      const changeTabs = () => {
        // getData();
      };

      const btndbClick = (type) => {
        doubleSearchData.value.type = type;
        doubleSearchData.value.data = '';
        doubleSearchVisible.value = true;
      };

      const handleDoubleSearchCancel = () => {
        doubleSearchVisible.value = false;
      };

      const handleDoubleSearchOk = () => {
        const list = doubleSearchData.value.data.split(/\n/);
        if (activeKey.value === '1') {
          if (doubleSearchData.value.type === 'SKU') {
            simpleSkuGoods.value.getData({ sku_list: list });
          } else {
            simpleSkuGoods.value.getData({ spu_list: list });
          }
        } else if (activeKey.value === '2') {
          if (doubleSearchData.value.type === 'SKU') {
            spuGoods.value.getData({ sku_list: list });
          } else {
            spuGoods.value.getData({ spu_list: list });
          }
        }
        doubleSearchVisible.value = false;
      };

      const beforeUpload = (file: any) => {
        const allowFormat =
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel';
        if (!allowFormat) {
          createMessage.error('只允许 xlsx/xls 文件!');
        }
        const fileSize = file.size / 1024 / 1024 < 2;
        if (!fileSize) {
          createMessage.error('图片大小不能超过2M');
        }
        if (!fileSize || !allowFormat) {
          return allowFormat && fileSize;
        }
        let formData = new FormData();
        formData.append('file', file);
        formData.append('developer', JSON.parse(localStorage.getItem('userInfo') ?? '').id);
        uploadExcel(formData).then((res: any) => {
          notification['success']({
            message: '导入通知',
            description: `${res.insert_num}条商品信息导入成功；${res.occupy_num}条商品信息导入失败`,
          });
          getData();
        });
        return false;
      };

      const beforeWarehouseUpload = (file: any) => {
        const allowFormat =
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel';
        if (!allowFormat) {
          createMessage.error('只允许 xlsx/xls 文件!');
        }
        const fileSize = file.size / 1024 / 1024 < 2;
        if (!fileSize) {
          createMessage.error('图片大小不能超过2M');
        }
        if (!fileSize || !allowFormat) {
          return allowFormat && fileSize;
        }
        let formData = new FormData();
        formData.append('file', file);
        uploadWarehouseExcel(formData).then((res: any) => {
          notification['success']({
            message: '导入通知',
            description: `${res.insert_num}条商品仓库信息导入成功；${res.occupy_num}条商品仓库信息导入失败`,
          });
          getData();
        });
        return false;
      };

      const beforeFirstUpload = (file: any) => {
        const allowFormat =
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel';
        if (!allowFormat) {
          createMessage.error('只允许 xlsx/xls 文件!');
        }
        const fileSize = file.size / 1024 / 1024 < 2;
        if (!fileSize) {
          createMessage.error('图片大小不能超过2M');
        }
        if (!fileSize || !allowFormat) {
          return allowFormat && fileSize;
        }
        let formData = new FormData();
        formData.append('file', file);
        uploadAllExcel(formData).then((res: any) => {
          notification['success']({
            message: '导入通知',
            description: `${res.insert_num}条商品信息导入成功；${res.occupy_num}条商品信息导入失败`,
          });
          getData();
        });
        return false;
      };

      return {
        formState,
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        formRef,
        activeKey,
        simpleSkuGoods,
        spuGoods,
        classifyData,
        allUserData,
        doubleSearchData,
        doubleSearchVisible,
        getData,
        handleMenuClick,
        changeTabs,
        btndbClick,
        handleDoubleSearchCancel,
        handleDoubleSearchOk,
        beforeUpload,
        beforeWarehouseUpload,
        beforeFirstUpload,
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
    padding: 20px;
    background-color: #fff;
  }
  .tabs-wrap {
    margin-top: 20px;
    :deep(.ant-tabs-bar) {
      margin: 0;
    }
  }
</style>
