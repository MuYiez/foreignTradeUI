<template>
  <div class="all-wrap">
    <p class="title">毛利计算</p>
    <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="计算日期">
        <a-date-picker v-model:value="formState.calculateDate" @change="selectCalculateDate" />
      </a-form-item>
      <a-form-item label="币种">
        <a-switch
          checked-children="￥"
          un-checked-children="$"
          v-model:checked="formState.currency"
          @change="changeCurrency"
        />
        {{ formState.currency ? ' 人民币' : ' 美元' }}
      </a-form-item>
      <a-form-item label="操作费A(CNY)" name="operatingCost">
        <a-input
          v-model:value="formState.operatingCost"
          placeholder="请输入操作费A(CNY)"
          disabled
        />
      </a-form-item>
      <a-form-item label="预估比例" name="estimatedProportion">
        <a-input
          v-model:value="formState.estimatedProportion"
          placeholder="请输入预估比例"
          suffix="%"
          disabled
        />
      </a-form-item>
      <a-form-item label="汇率E" name="exchangeRate">
        <a-input v-model:value="formState.exchangeRate" placeholder="请输入汇率E" disabled />
      </a-form-item>
      <a-form-item label="PayPal提现费(USD)" name="paypalWithdrawDeposit">
        <a-input
          v-model:value="formState.paypalWithdrawDeposit"
          placeholder="请输入PayPal提现费(USD)"
          disabled
        />
      </a-form-item>
      <a-form-item label="毛利表">
        <div style="text-align: right; line-height: 40px; height: 40px">
          <a-popover title="毛利表栏位" trigger="click" placement="topRight">
            <template #content>
              <a-tree
                checkable
                draggable
                v-model:checkedKeys="checkedKeys"
                :tree-data="gData"
                @dragstart="onDragEnter"
                @drop="onDrop"
                @check="editColumnsSort"
              ></a-tree>
            </template>
            <a>编辑栏位</a>
          </a-popover>
        </div>
        <a-table
          :columns="localColumns"
          :data-source="dataSource"
          :pagination="false"
          rowKey="dataSourceKey"
          bordered
          tableLayout="fixed"
          :scroll="{ x: localColumnsLength }"
          size="small"
        >
          <template #sku_goods_id="{ record, index }">
            <a-auto-complete
              v-model:value="dataSource[index].sku_goods_id"
              @select="
                (e) => {
                  onSkuIdSelect(e, record.dataSourceKey);
                }
              "
              @search="onSkuIdSearch"
              allowClear
            >
              <template #options>
                <a-select-option v-for="item in skuIdOptions" :key="item.sku_goods_id">
                  {{ item.name_cn }}
                </a-select-option>
              </template>
            </a-auto-complete>
          </template>
          <template #name_cn="{ record, index }">
            <a-auto-complete
              v-model:value="dataSource[index].name_cn"
              @select="
                (e) => {
                  onSkuNameSelect(e, record.dataSourceKey);
                }
              "
              @search="onSkuNameSearch"
              allowClear
            >
              <template #options>
                <a-select-option v-for="item in skuNameOptions" :key="item.sku_goods_id">
                  {{ item.name_cn }}
                </a-select-option>
              </template>
            </a-auto-complete>
          </template>
          <template #size="{ record }">
            <div style="width: 50px">
              <div> 长：{{ record.length }} </div>
              <div> 宽：{{ record.wide }} </div>
              <div> 高：{{ record.height }} </div>
            </div>
          </template>
          <template #action="{ record }">
            <div class="editable-row-operations">
              <a @click="deleteFn(record.dataSourceKey)">删除</a>
              <a style="margin-left: 10px" @click="editFn(record)">编辑</a>
            </div>
          </template>
        </a-table>
        <div style="text-align: center; padding-top: 10px">
          <PlusSquareTwoTone style="font-size: 30px; margin: auto 0" @click="addTable" />
        </div>
      </a-form-item>

      <a-form-item label="总数">
        <!-- 总数展示 Start -->
        <a-descriptions bordered>
          <a-descriptions-item v-for="item in total_columns" :key="item.key" :label="item.title">{{
            totalDateSource[item.key]
          }}</a-descriptions-item>
        </a-descriptions>
        <!-- 总数展示 End -->
      </a-form-item>
    </a-form>

    <div style="text-align: center">
      <a-button type="primary" @click="saveResults">保存</a-button>
    </div>

    <!-- 编辑框 Start -->
    <a-modal
      width="60%"
      :destroyOnClose="true"
      bodyStyle="padding:20px"
      v-model:visible="visible"
      title="编辑"
      @ok="handleOk"
      @canplay="handleCancle"
    >
      <a-form
        ref="formRefEdit"
        :model="formStateEdit"
        :label-col="labelColEdit"
        :wrapper-col="wrapperColEdit"
        :rules="rules"
      >
        <a-form-item
          v-for="item in editColumns"
          :key="item.key"
          :label="item.label + (item.prefix ? '($)' : '')"
          :name="item.key"
        >
          <a-input
            v-if="item.type === 'input'"
            :readOnly="item.disabled"
            v-model:value="formStateEdit[item.key]"
            :placeholder="'请输入' + item.label"
          />
          <a-input
            v-if="item.type === 'inputNumber'"
            type="number"
            min="0"
            :readOnly="item.disabled"
            v-model:value="formStateEdit[item.key]"
            :placeholder="'请输入' + item.label"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 编辑框 End -->
  </div>
</template>

<script lang="ts">
  import { ref, UnwrapRef, reactive, onMounted, defineComponent } from 'vue';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import {
    formState,
    FormState,
    columns,
    rules,
    editColumns,
    formStateEdit,
    total_columns,
    treeData,
  } from './data';
  import {
    autosearch,
    addDailyTable,
    editDailyTable,
    getTableDetail,
    searchDangerousGoods,
    editGrossColumns,
    getGrossColumns,
  } from '/@/api/grossProfitTable/skuCalculate';
  import { search } from '/@/api/grossProfitTable/parameter';
  import { PlusSquareTwoTone } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    calculateCurrency,
    calculateTotal,
    transformCurrency,
  } from '/@/utils/commom/calculateGross/calculate';
  import { calculateGrossProfit } from '/@/utils/commom/calculateGross/calculateGrossProfit';
  import moment from 'moment';
  import { TreeDataItem, TreeDragEvent, DropEvent } from 'ant-design-vue/es/tree/Tree';
  const { createMessage } = useMessage();
  export default defineComponent({
    name: 'SkuCalculate',
    components: {
      PlusSquareTwoTone,
    },
    setup() {
      const title = ref('参数设置');
      const formRef = ref();
      const formRefEdit = ref();
      let dataSource: UnwrapRef<any> = reactive([]);
      const skuIdOptions = ref<any[]>([]);
      const skuNameOptions = ref<any[]>([]);
      const visible = ref<boolean>(false);
      let dataSourceKey = 0;
      let currentDataSourceKey = 0;
      let cnyDataSource = <any>[]; //转化后的人民币数据
      let usdDataSource = <any>[]; //转化后的美元数据
      let originalDataSource = <any>[]; //原始数据
      let cnyDataSourceTotal = {};
      let usdDataSourceTotal = <any>{};
      const totalDateSource = ref({});
      const localColumnsLength = ref(1050);
      const detailData = ref<any>({});
      let isNew = true;
      let parameter = {};
      let selectNode: any = {};
      const gData = ref<TreeDataItem[]>(treeData);
      const parentKeys: Array<any> = treeData.map((item) => item.key);
      const checkedKeys = ref<any[]>([]);
      const localColumns = ref<any>(columns);

      onMounted(() => {
        selectCalculateDate();
        getGrossColumnsFn();
      });

      const getGrossColumnsFn = () => {
        getGrossColumns({}).then((res) => {
          gData.value = treeData
            .map((item) => {
              const { title, key } = item;
              const cor_item = res.find((t) => t.column_key === key);
              if (cor_item.is_show === '1') checkedKeys.value.push(key);
              const disabled_columns = ['estimatedProfit', 'sku_goods_id', 'name_cn'];
              return {
                title,
                key,
                index: cor_item.req,
                disabled: disabled_columns.includes(key),
              };
            })
            .sort((a, b) => {
              return a.index - b.index;
            });
          changeLocalColumns();
        });
      };

      const onSkuIdSelect = (searchText: string, key: string) => {
        const list = skuIdOptions.value.find((res) => res.sku_goods_id === searchText);
        recalculate({ ...list, dataSourceKey: key });
      };

      const onSkuIdSearch = (value: string) => {
        autosearch({ sku_goods_id: value }).then((res) => {
          skuIdOptions.value = res;
        });
      };

      const onSkuNameSelect = (searchText: string, key: string) => {
        const list = skuNameOptions.value.find((res) => res.sku_goods_id === searchText);
        recalculate({ ...list, dataSourceKey: key });
      };

      const onSkuNameSearch = (value: string) => {
        autosearch({ name_cn: value }).then((res) => {
          skuNameOptions.value = res;
        });
      };

      //将选择的数据填入
      const recalculate = (list: any) => {
        const key = list.dataSourceKey;
        const index = dataSource.findIndex((res) => res.dataSourceKey === key);
        originalDataSource[index] = JSON.parse(JSON.stringify(list));
        cnyDataSource[index] = JSON.parse(JSON.stringify(list));
        usdDataSource[index] = {
          ...list,
          purchase_ref_price: transformCurrency(
            false,
            list.purchase_ref_price,
            formState.exchangeRate,
          ),
        };
        changeCurrency(formState.currency);
      };

      //转化币种
      const changeCurrency = (type: boolean) => {
        if (type) {
          //美元转化为人民币
          cnyDataSource.forEach((item, index) => {
            dataSource[index] = item;
          });
          totalDateSource.value = cnyDataSourceTotal;
        } else {
          //人民币转化为美元
          usdDataSource.forEach((item, index) => {
            dataSource[index] = item;
          });
          totalDateSource.value = usdDataSourceTotal;
        }
      };

      //删除
      const deleteFn = (key: any) => {
        const index = dataSource.findIndex((res) => res.dataSourceKey === key);
        dataSource.splice(index, 1);
        usdDataSource.splice(index, 1);
        cnyDataSource.splice(index, 1);
        originalDataSource.splice(index, 1);
        // calculateTotal();
        changeCurrency(formState.currency);
      };

      //编辑
      const editFn = (record: any) => {
        const index = dataSource.findIndex((res) => res.dataSourceKey === record.dataSourceKey);
        if (!record.sku_goods_id) {
          createMessage.error('请选择sku');
          return;
        }
        //查询是否带电
        searchDangerousGoods({
          sku_goods_id: record.sku_goods_id.split('+')[0].split('*')[0],
        }).then((res) => {
          let gramPrice = res.dangerous_goods ? parameter[res.dangerous_goods] : parameter['D01'];
          const initData = [
            {
              key: 'gramPrice',
              value: Number(gramPrice),
            },
            {
              key: 'salesVolume',
              value: 0,
            },
            {
              key: 'orderQuantity',
              value: 0,
            },
            {
              key: 'businessVolume',
              value: 0,
            },
            {
              key: 'adRate',
              value: 0,
            },
          ];
          editColumns.forEach((res) => {
            const item = initData.find((item) => item.key === res.key);
            if (item) {
              if (res.key === 'gramPrice') {
                formStateEdit[res.key] = JSON.stringify(
                  parseFloat(cnyDataSource[index][res.key] ?? item.value),
                );
              } else {
                formStateEdit[res.key] = JSON.stringify(
                  parseFloat(usdDataSource[index][res.key] ?? item.value),
                );
              }
            } else {
              formStateEdit[res.key] = usdDataSource[index][res.key];
            }
          });
          currentDataSourceKey = record.dataSourceKey;
          showModal();
        });
      };

      const showModal = () => {
        visible.value = true;
      };

      //添加
      const addTable = () => {
        const key = dataSourceKey++;
        dataSource.push({
          dataSourceKey: key,
          sku_goods_id: '',
          name_cn: '',
        });
        cnyDataSource.push({
          dataSourceKey: key,
          sku_goods_id: '',
          name_cn: '',
        });
        originalDataSource.push({
          dataSourceKey: key,
          sku_goods_id: '',
          name_cn: '',
        });
        usdDataSource.push({
          dataSourceKey: key,
          sku_goods_id: '',
          name_cn: '',
        });
      };

      //重置所有数据
      const reset = () => {
        dataSource.splice(0, dataSource.length);
        dataSourceKey = 0;
        currentDataSourceKey = 0;
        search({ date: moment(new Date()).format('YYYY-MM-DD') }).then((res) => {
          formState.estimatedProportion = res.estimatedProportion;
          formState.exchangeRate = res.exchangeRate;
          formState.operatingCost = res.operatingCost;
          formState.paypalWithdrawDeposit = res.paypalWithdrawDeposit;
          parameter = res;
        });
        originalDataSource = [];
        cnyDataSource = [];
        usdDataSource = [];
        cnyDataSourceTotal = {};
        usdDataSourceTotal = {};
        totalDateSource.value = {};
      };

      const selectCalculateDate = () => {
        reset();
        getTableDetail({
          calculate_date: moment(formState.calculateDate).format('YYYY-MM-DD'),
          user_id: JSON.parse(localStorage.getItem('userInfo') ?? '').id,
        }).then((res) => {
          if (!res.user_id) {
            isNew = true;
            return;
          }
          isNew = false;
          //获取毛利表信息
          detailData.value = res;
          const list = JSON.parse(JSON.stringify(res.list)).map((item) => {
            item.dataSourceKey = dataSourceKey++;
            return item;
          });
          search({ date: res.date }).then((res) => {
            formState.estimatedProportion = res.estimatedProportion;
            formState.exchangeRate = res.exchangeRate;
            formState.operatingCost = res.operatingCost;
            formState.paypalWithdrawDeposit = res.paypalWithdrawDeposit;
            parameter = res;

            originalDataSource = list;
            calculateList();
          });
        });
      };

      const calculateList = () => {
        //将原始数据通过calculateGrossProfit方法一一计算出来
        originalDataSource = originalDataSource.map((res) => {
          return calculateGrossProfit(formState, res);
        });
        //分别计算人民币数据和美元数据
        const calculateCurrencyData = calculateCurrency(originalDataSource, formState.exchangeRate);
        cnyDataSource = calculateCurrencyData.cnyList;
        usdDataSource = calculateCurrencyData.usdList;
        //计算总额
        const calculateTotalData = calculateTotal(cnyDataSource, usdDataSource);
        cnyDataSourceTotal = calculateTotalData.cnyData;
        usdDataSourceTotal = calculateTotalData.usdData;
        changeCurrency(formState.currency);
      };

      const handleOk = () => {
        formRefEdit.value.validate().then(() => {
          let index = dataSource.findIndex((res) => res.dataSourceKey === currentDataSourceKey);
          originalDataSource[index] = {
            ...originalDataSource[index],
            ...formStateEdit,
          };
          calculateList();
          handleCancle();
        });
      };

      const handleCancle = () => {
        visible.value = false;
      };

      const saveResults = () => {
        formRef.value
          .validate()
          .then(() => {
            let sendData: any = {
              ...formState,
              calculate_date: moment(formState.calculateDate).format('YYYY-MM-DD'),
              list: originalDataSource,
              user_id: JSON.parse(localStorage.getItem('userInfo') ?? '').id,
              total: originalDataSource.length,
            };
            console.log(originalDataSource);
            if (isNew) {
              addDailyTable(sendData).then(() => {
                createMessage.success('保存毛利信息成功！');
                isNew = false;
              });
            } else {
              editDailyTable(sendData).then(() => {
                createMessage.success('保存毛利信息成功！');
                isNew = false;
              });
            }
          })
          .catch((error: ValidateErrorEntity<FormState>) => {
            console.log('error', error);
          });
      };

      const editColumnsSort = () => {
        const list = gData.value.map((res, index) => {
          const { title, key } = res;
          return {
            column_key: key,
            title,
            req: index,
            is_show: checkedKeys.value.includes(key) ? '1' : '0',
          };
        });
        editGrossColumns({ list }).then(() => {
          changeLocalColumns();
        });
      };

      const changeLocalColumns = () => {
        localColumns.value = [];
        gData.value.forEach((item) => {
          const { key } = item;
          const columns_item = columns.find((item) => item.dataIndex === key);
          if (checkedKeys.value.includes(key)) {
            localColumns.value.push(columns_item);
          }
        });
        const action_column = columns.find((item) => item.dataIndex === 'action');
        localColumns.value.push(action_column);

        localColumnsLength.value = (localColumns.value.length-10)>0?(localColumns.value.length-10)*120+1050:1050
      };

      const onDragEnter = (info: TreeDragEvent) => {
        //获取到被拖动的节点
        selectNode = info;
      };

      /**
       *
       * @param info
       * dropToGap：boolean类型，true代表拖拽到节点之间的缝隙中，false代表拖拽到节点上，即节点的内容区。
       * dropPosition：拖拽的时候，针对一个节点有三种情况，即拖拽到节点之上，拖拽到节点上，拖拽到节点之下。
       * 三种情况其值有所不同。antd 依赖了 rc-tree，在 rc-tree 里 dropPosition 是一个相对地址。
       * 如果拖到了目标节点的上面则当前元素 -1，下面则是 1（* rc-tree这块不确定具体情况*）。
       * antd 里则是相对于目标节点的 index针对拖动情况计算出来。
       * 拖拽到节点之上： 该节点的 index-1
       * 拖拽到节点上：dropPosition 就是该节点的 index。
       * 拖拽到节点之下：该节点的 index+1
       */
      const onDrop = (info: DropEvent) => {
        const dropKey = info.node.eventKey;
        const dragKey = info.dragNode.eventKey;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        const loop = (data: TreeDataItem[], key: string, callback: any) => {
          data.forEach((item, index, arr) => {
            if (item.key === key) {
              return callback(item, index, arr);
            }
            if (item.children) {
              return loop(item.children, key, callback);
            }
          });
        };
        const data = [...JSON.parse(JSON.stringify(gData.value))];

        // Find dragObject
        let dragObj: TreeDataItem = {};
        loop(data, dragKey, (item: TreeDataItem, index: number, arr: TreeDataItem[]) => {
          arr.splice(index, 1);
          dragObj = item;
        });

        //获取到被拖动的节点
        let selectNodeKey = selectNode.node.eventKey;
        let infoNodeKey = info.node.eventKey;

        //是否允许更改节点
        let isAllow: boolean = true;
        if (parentKeys.includes(selectNodeKey) && parentKeys.includes(infoNodeKey)) {
          //若被拖动的节点跟到达的节点同级，只能进行上下移动
          if (info.dropToGap) {
            // 不加入到内容内
            let ar: TreeDataItem[] = [];
            let i = 0;
            loop(data, dropKey, (item: TreeDataItem, index: number, arr: TreeDataItem[]) => {
              ar = arr;
              i = index;
            });
            if (i == 0 || i == 1 || i >= 19) {
              isAllow = false;
            }
            if (dropPosition === -1) {
              ar.splice(i, 0, dragObj);
            } else {
              ar.splice(i + 1, 0, dragObj);
            }
          } else {
            isAllow = false;
          }
        } else {
          isAllow = false;
        }

        //若允许更改则赋值
        if (isAllow) {
          gData.value = data;
          editColumnsSort();
        }
      };

      return {
        title,
        labelCol: { span: 2 },
        labelColEdit: { span: 6 },
        wrapperCol: { span: 20 },
        wrapperColEdit: { span: 12 },
        formState,
        formRef,
        columns,
        dataSource,
        skuIdOptions,
        skuNameOptions,
        visible,
        rules,
        formStateEdit,
        formRefEdit,
        editColumns,
        total_columns,
        totalDateSource,
        detailData,
        gData,
        checkedKeys,
        localColumns,
        localColumnsLength,
        onSkuIdSelect,
        onSkuIdSearch,
        onSkuNameSelect,
        onSkuNameSearch,
        changeCurrency,
        deleteFn,
        editFn,
        addTable,
        saveResults,
        handleOk,
        handleCancle,
        selectCalculateDate,
        onDragEnter,
        onDrop,
        editColumnsSort,
      };
    },
  });
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
