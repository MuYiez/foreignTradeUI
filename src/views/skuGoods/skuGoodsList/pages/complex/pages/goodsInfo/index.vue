<template>
  <div>
    <!-- 基础信息 Start -->
    <div class="form-wrap">
      <div class="title">基础信息</div>
      <a-form-item label="产品分类" name="goods_classify">
        <a-tree-select
          v-model:value="formState.goods_classify"
          style="width: 100%"
          show-search
          allow-clear
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="classifyData"
          placeholder="选择分类"
          tree-default-expand-all
          @change="creatSpu"
        />
      </a-form-item>
      <a-form-item label="商品SPU" name="spu">
        <span>{{ formState.spu }}</span>
      </a-form-item>
      <a-form-item label="销售方式" name="sales_method">
        <a-checkbox-group name="sales_method" v-model:value="formState.sales_method">
          <a-checkbox value="goods">商品</a-checkbox>
          <a-checkbox value="gifts">赠品</a-checkbox>
          <a-checkbox value="package">包材</a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item label="商品图片">
        <div style="width: 98px; height: 98px; margin: 10px 0">
          <a-image v-if="imgUrl" :src="imgUrl" />
          <img v-else src="../../../../../../../assets/images/kong.png" />
        </div>

        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1">
                <a-upload
                  name="file"
                  v-model:file-list="fileList"
                  :showUploadList="false"
                  :multiple="true"
                  accept=".jpg,.png"
                  :beforeUpload="beforeUpload"
                  :handleChange="handleChange"
                >
                  本地图片
                </a-upload>
              </a-menu-item>
              <a-menu-item key="2" @click="openNetworkModal(1)"> 网络图片 </a-menu-item>
            </a-menu>
          </template>
          <a-button type="primary">
            选择图片
            <DownOutlined />
          </a-button>
        </a-dropdown>
      </a-form-item>
    </div>
    <!-- 基础信息 End -->

    <!-- SKU信息 Start -->
    <div class="form-wrap">
      <div class="title">SKU信息</div>
      <div style="padding: 0 20px">
        <a-divider style="color: #e8e8e8" dashed orientation="left">
          <span style="color: #000; font-size: 14px">生成变种</span>
        </a-divider>
        <ul style="padding: 0 70px">
          <li style="padding: 10px 0" v-for="(item, index) in varietasList" :key="index">
            <a-input
              v-model:value="item.name"
              style="width: 20%; margin-right: 10px"
              placeholder="属性名称，如：Color"
              allowClear
              @blur="checkVarietasValue(index)"
            ></a-input>
            <a-select
              v-model:value="item.value"
              mode="tags"
              style="width: 60%"
              :token-separators="[',']"
              placeholder="属性值，如：Red,Blue，按下回车即可生成属性值"
              :open="false"
              allowClear
              @change="checkVarietasValue(index)"
            ></a-select>
            <MinusCircleTwoTone
              style="font-size: 20px; margin-left: 10px; cursor: pointer"
              @click="deleteVarietas(index)"
            />
          </li>
        </ul>
        <a @click="addVarietas" style="margin-left: 70px"><PlusCircleTwoTone /> 添加新属性</a>
        <a-divider style="color: #e8e8e8" dashed orientation="left">
          <span style="color: #000; font-size: 14px">编辑变种</span>
        </a-divider>

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

          <template #img="{ record, index }">
            <div style="width: 52px; height: 52px">
              <a-popover placement="topLeft">
                <template #content>
                  <a-menu>
                    <a-menu-item key="1">
                      <a-upload
                        name="file"
                        :showUploadList="false"
                        accept=".jpg,.png"
                        :beforeUpload="
                          (e) => {
                            beforeUploadSKUimg(e, record, index);
                            return false;
                          }
                        "
                      >
                        本地图片
                      </a-upload>
                    </a-menu-item>
                    <a-menu-item key="2" @click="openNetworkModal(2, record, index)">
                      网络图片
                    </a-menu-item>
                  </a-menu>
                </template>
                <div>
                  <a-image v-if="dataSource[index].img" :src="dataSource[index].img" />
                  <img v-else src="../../../../../../../assets/images/kong.png" />
                </div>
              </a-popover>
            </div>
          </template>
          <template #name_cn="{ index }">
            <a-textarea v-model:value="dataSource[index].name_cn" placeholder="请输入" :rows="2" />
          </template>
          <template #name_en="{ index }">
            <a-textarea v-model:value="dataSource[index].name_en" placeholder="请输入" :rows="2" />
          </template>
          <template #source_url="{ index }">
            <a-textarea
              v-model:value="dataSource[index].source_url"
              placeholder="多个来源URL以“,”分隔"
              :rows="2"
            />
          </template>
          <template #Identification_code="{ index }">
            <a-textarea
              v-model:value="dataSource[index].Identification_code"
              placeholder="仅支持字母、数字和-_"
              :rows="2"
            />
          </template>
        </a-table>
        <!-- 编辑变种表格信息 End -->
      </div>
    </div>
    <!-- SKU信息 End -->

    <!-- 重量信息 Start -->
    <div class="form-wrap">
      <div class="title">重量信息</div>
      <!-- 编辑变种表格信息 Start -->
      <a-table
        :columns="weightColumns"
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
        <template #purchase_ref_price="{ index }">
          <a-input
            type="number"
            v-model:value="dataSource[index].purchase_ref_price"
            placeholder="请输入"
            @blur="changeDeclare(index)"
          ></a-input>
        </template>
        <template #weight="{ index }">
          <a-input
            type="number"
            v-model:value="dataSource[index].weight"
            placeholder="请输入"
            @blur="changeDeclare(index)"
          ></a-input>
        </template>
        <template #weighting_error="{ index }">
          <a-input
            type="number"
            v-model:value="dataSource[index].weighting_error"
            placeholder="请输入"
          ></a-input>
        </template>
        <template #size="{ index }">
          <a-input
            type="number"
            v-model:value="dataSource[index].length"
            placeholder="长"
            style="width: 25%; margin-right: 5%"
          ></a-input>
          <a-input
            type="number"
            v-model:value="dataSource[index].wide"
            placeholder="宽"
            style="width: 25%; margin-right: 5%"
          ></a-input>
          <a-input
            type="number"
            v-model:value="dataSource[index].height"
            placeholder="高"
            style="width: 25%"
          ></a-input>
        </template>
      </a-table>
      <!-- 编辑变种表格信息 End -->
    </div>
    <!-- 重量信息 End -->

    <!-- 人员信息 Start -->
    <div class="form-wrap">
      <div class="title">人员信息</div>
      <a-form-item label="开发员" name="developer">
        <a-select v-model:value="formState.developer" placeholder="请选择开发员">
          <a-select-option v-for="item in allUserData" :key="item.id" :value="item.id">
            {{ item.nickname }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="采购员" name="purchaser">
        <a-select v-model:value="formState.purchaser" placeholder="请选择采购员">
          <a-select-option v-for="item in allUserData" :key="item.id" :value="item.id">
            {{ item.nickname }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </div>
    <!-- 人员信息 End -->

    <!-- 选择仓库 Start -->
    <div class="form-wrap">
      <div class="title">商品保存成功，并放入以下仓库清单</div>
      <div>
        <a-form-item label="仓库" name="warehouse_location">
          <a-checkbox-group name="warehouse_location" v-model:value="formState.warehouse_location">
            <a-checkbox value="W01">默认仓库</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </div>
    </div>
    <!-- 选择仓库 End -->

    <a-modal
      :visible="networkVisible"
      title="从网络地址(URL)选择图片"
      @cancel="handleNetworkCancel"
      @ok="handleNetworkOk"
      bodyStyle="padding:20px"
      :zIndex="3000"
    >
      <a-input v-model:value="networkUrl" placeholder="请填写图片URL地址" />
    </a-modal>

    <!-- 应用全部输入框 Start -->
    <a-modal
      :visible="applyVisible"
      :title="'修改' + applyAllData.title"
      @cancel="handleApplyCancel"
      bodyStyle="padding:20px"
      :zIndex="2000"
    >
      <div v-if="applyAllData.key === 'size'">
        <a-input
          type="number"
          v-model:value="applySizeData.length"
          placeholder="长"
          style="width: 25%; margin-right: 5%"
        ></a-input>
        <a-input
          type="number"
          v-model:value="applySizeData.wide"
          placeholder="宽"
          style="width: 25%; margin-right: 5%"
        ></a-input>
        <a-input
          type="number"
          v-model:value="applySizeData.height"
          placeholder="高"
          style="width: 25%"
        ></a-input>
      </div>
      <ul v-else-if="applyAllData.key === 'img'">
        <li style="padding-bottom: 10px">
          <a-button>
            <a-upload
              name="file"
              :showUploadList="false"
              accept=".jpg,.png"
              :beforeUpload="
                (e) => {
                  beforeUploadSKUimg(e, {}, 0,'all');
                  return false;
                }
              "
            >
              本地图片
            </a-upload>
          </a-button>
        </li>
        <li>
          <a-button @click="openNetworkModal(3, {}, 0)">网络图片</a-button>
        </li>
      </ul>
      <div v-else>
        <a-textarea
          :rows="4"
          v-model:value="applyInputData"
          :placeholder="'请填写' + applyAllData.title"
        />
      </div>
      <template #footer>
        <a-button key="back" @click="handleApplyCancel">关闭</a-button>
        <a-button
          v-if="applyAllData.key !== 'img'"
          key="submit"
          type="primary"
          @click="handleApplyOk"
          >确认</a-button
        >
      </template>
    </a-modal>
    <!-- 应用全部输入框 End -->
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, UnwrapRef } from 'vue';
  import { classifyInfoSearch } from '/@/api/skuGoods/classifyInfo';
  import {
    DownOutlined,
    MinusCircleTwoTone,
    PlusCircleTwoTone,
    EditTwoTone,
  } from '@ant-design/icons-vue';
  import { allUser } from '/@/api/sys/user';
  import { addPictrue, addNetPictrue, getSpuCode } from '/@/api/skuGoods/goodsInfo';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columns, weightColumns } from './data';
  import { search } from '/@/api/grossProfitTable/parameter';

  export default defineComponent({
    props: {
      formState: {
        type: Object,
        default: () => {},
      },
      getStrategicPassList: {
        type: Function,
        default: () => {},
      },
      insertImg: {
        type: Function,
        default: () => {},
      },
    },
    components: {
      DownOutlined,
      MinusCircleTwoTone,
      PlusCircleTwoTone,
      EditTwoTone,
    },
    setup(props) {
      const { createMessage } = useMessage();
      const classifyData = ref([]);
      const allUserData = ref(<any>[]);
      const imgUrl = ref('');
      const fileList = ref(<any>[]);
      const picture_url = ref('');
      const networkVisible = ref<boolean>(false);
      const applyVisible = ref<boolean>(false);
      const networkUrl = ref('');
      const applyInputData = ref('');
      const applySizeData = ref({ length: '', wide: '', height: '' });
      const varietasList = ref(<any>[{ name: '', value: <string[]>[] }]);
      const dataSource: UnwrapRef<any> = ref([]);
      let lastClassify = '';
      let networkData = <any>{};
      let exchangeRate = 1;
      const applyAllData = ref(<any>{});

      onMounted(() => {
        classifyInfoSearch({}).then((res) => {
          classifyData.value = res;
        });
        allUser({}).then((res) => {
          allUserData.value = res;
        });
        search({}).then((res) => {
          exchangeRate = Number(res.exchangeRate);
        });
      });

      const creatSpu = (e, label) => {
        if (lastClassify === e) return;
        getSpuCode({
          classifyType: label[0].split(' - ')[1] ?? 'ALL',
          department: JSON.parse(localStorage.getItem('userInfo') ?? '').department,
        }).then((res) => {
          props.formState.spu = res.spu;
          lastClassify = e;
        });
      };

      // 上传文件改变时的状态
      const handleChange = (info: any) => {
        fileList.value = info.fileList;
      };

      const beforeUpload = (file: any) => {
        const allowFormat = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!allowFormat) {
          createMessage.error('只允许 JPG/PNG 文件!');
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
        formData.append('spu', props.formState.spu);
        addPictrue(formData).then((res: any) => {
          picture_url.value = res.id;
          imgUrl.value = res.url;
        });
        return false;
      };

      const beforeUploadSKUimg = (file: any, record = <any>{}, index = 0, type = 'normall') => {
        const allowFormat = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!allowFormat) {
          createMessage.error('只允许 JPG/PNG 文件!');
        }
        const fileSize = file.size / 1024 / 1024 < 2;
        if (!fileSize) {
          createMessage.error('图片大小不能超过2M');
        }
        if (!fileSize || !allowFormat) {
          return allowFormat && fileSize;
        }
        let formData = new FormData();
        if (type === 'normall') {
          formData.append('file', file);
          formData.append('sku_goods_id', record.sku_goods_id);
          addPictrue(formData).then((res: any) => {
            dataSource.value[index].img = res.url;
            dataSource.value[index].imgId = res.id;
            insertImg();
          });
        } else if (type === 'all') {
          formData.append('file', file);
          formData.append('sku_goods_id', dataSource.value[0].sku_goods_id);
          addPictrue(formData).then((res: any) => {
            dataSource.value = dataSource.value.map((element) => {
              element.img = res.url;
              element.imgId = res.id;
              return element;
            });
            insertImg();
            handleApplyCancel()
          });
        }

        return false;
      };

      const openNetworkModal = (type, record?: object, index?: any) => {
        networkData = {
          type,
          record,
          index,
        };
        networkVisible.value = true;
      };

      const handleNetworkCancel = () => {
        networkUrl.value = '';
        networkVisible.value = false;
      };

      const handleApplyCancel = () => {
        applyInputData.value = '';
        applyVisible.value = false;
      };

      const handleApplyOk = () => {
        if (applyAllData.value.key === 'size') {
          dataSource.value = dataSource.value.map((element, index) => {
            element.length = applySizeData.value.length;
            element.wide = applySizeData.value.wide;
            element.height = applySizeData.value.height;
            return element;
          });
        } else {
          dataSource.value = dataSource.value.map((element, index) => {
            element[applyAllData.value.key] = applyInputData.value;
            changeDeclare(index);
            return element;
          });
          applyInputData.value = '';
        }
        applyVisible.value = false;
      };

      const handleNetworkOk = () => {
        if (!networkUrl.value) {
          createMessage.error('请输入图片地址');
          return;
        }
        const urlList = networkUrl.value.split(/\n/);
        if (networkData.type === 1) {
          //若为应用到spu商品
          addNetPictrue({ spu: props.formState.spu, list: [networkUrl.value] }).then((res) => {
            urlList.forEach((res, index) => {
              let url = {
                uid: Date.now() + 'order' + index,
                name: Date.now() + 'order' + index + '.png',
                status: 'done',
                url: res,
              };
              fileList.value.push(url);
              imgUrl.value = res;
            });
            picture_url.value = res.list[0];
            handleNetworkCancel();
          });
        } else if(networkData.type === 2) {
          //若为应用到sku商品信息
          addNetPictrue({
            sku_goods_id: networkData.record.sku_goods_id,
            list: [networkUrl.value],
          }).then((res) => {
            dataSource.value[networkData.index].img = networkUrl.value;
            dataSource.value[networkData.index].imgId = res.list[0];
            insertImg();
            handleNetworkCancel();
          });
        }else if(networkData.type === 3){
          //若为应用到全部商品
          addNetPictrue({
            sku_goods_id: dataSource.value[0].sku_goods_id,
            list: [networkUrl.value],
          }).then((res) => {
            dataSource.value = dataSource.value.map((element) => {
              element.img = networkUrl.value;
              element.imgId = res.list[0];
              return element;
            });
            insertImg();
            handleNetworkCancel();
            handleApplyCancel()
          });
        }
      };

      //检查变种列
      const checkVarietasValue = (index) => {
        if (!varietasList.value[index].name) {
          createMessage.error('变种名称为空，请先填写变种名称！');
          varietasList.value[index].value = [];
        }
        //若所有的列已经输入完毕
        if (varietasList.value[index].name && varietasList.value[index].value.length !== 0) {
          creatTable();
        }
      };

      //生成变种表
      const creatTable = () => {
        let tableList = <any[]>[];
        //共有多少列
        varietasList.value.forEach((res, i) => {
          if (i === 0) {
            //循环遍历列内属性
            res.value.forEach((element) => {
              tableList.push({
                sku_goods_id: props.formState.spu + '-' + element,
                varietas_name: element,
              });
            });
          } else {
            let moment_list = <any[]>[];
            tableList.forEach((item) => {
              res.value.forEach((element) => {
                moment_list.push({
                  sku_goods_id: item.sku_goods_id + element,
                  varietas_name: item.varietas_name + '*' + element,
                });
              });
            });
            tableList = moment_list;
          }
        });
        dataSource.value = tableList;
        props.getStrategicPassList({
          isChange2: true,
          isChange3: true,
          // list: JSON.parse(JSON.stringify(tableList)),
          list: tableList,
        });
      };

      //删除变种列
      const deleteVarietas = (index) => {
        varietasList.value.splice(index, 1);
        creatTable();
      };

      //添加变种列
      const addVarietas = () => {
        varietasList.value.push({ name: '', value: <string[]>[] });
      };

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

      //插入图片
      const insertImg = () => {
        // props.insertImg(JSON.parse(JSON.stringify(dataSource.value)));
        props.insertImg(dataSource.value);
      };

      const changeDeclare = (index) => {
        if (dataSource.value[index].purchase_ref_price) {
          dataSource.value[index].declare_price = (
            Number(dataSource.value[index].purchase_ref_price) / exchangeRate
          ).toFixed(2);
        }
        dataSource.value[index].declare_weight = dataSource.value[index].weight;
        props.getStrategicPassList({
          isChange2: true,
          isChange3: true,
          // list: JSON.parse(JSON.stringify(dataSource.value)),
          list: dataSource.value,
        });
      };

      return {
        classifyData,
        allUserData,
        imgUrl,
        fileList,
        networkVisible,
        networkUrl,
        varietasList,
        columns,
        weightColumns,
        dataSource,
        picture_url,
        applyVisible,
        applyAllData,
        applyInputData,
        applySizeData,
        handleChange,
        beforeUpload,
        beforeUploadSKUimg,
        openNetworkModal,
        handleNetworkCancel,
        handleNetworkOk,
        deleteVarietas,
        checkVarietasValue,
        addVarietas,
        applyAll,
        creatTable,
        creatSpu,
        changeDeclare,
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
