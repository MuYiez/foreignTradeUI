<template>
  <div class="all-wrap">
    <p class="title">修改毛利信息</p>
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="editRules"
    >
      <a-form-item label="计算日期">
        {{ formState.calculate_date }}
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
          @blur="changeParameter"
        />
      </a-form-item>
      <a-form-item label="克重单价C(CNY)" name="gramPrice">
        <a-input
          v-model:value="formState.gramPrice"
          placeholder="请输入克重单价C(CNY)"
          @blur="changeParameter"
        />
      </a-form-item>
      <a-form-item label="汇率E" name="exchangeRate">
        <a-input
          v-model:value="formState.exchangeRate"
          placeholder="请输入汇率E"
          @blur="changeParameter"
        />
      </a-form-item>
      <a-form-item label="毛利表">
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :pagination="false"
          rowKey="dataSourceKey"
          bordered
          :scroll="{ x: 2000 }"
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
      <a-button style="margin-left: 20px" @click="back">返回</a-button>
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
  import { ref, UnwrapRef, reactive, onMounted } from 'vue';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import {
    formState,
    FormState,
    columns,
    rules,
    editColumns,
    formStateEdit,
    total_columns,
    editRules,
  } from './data';
  import { autosearch, editDailyTable } from '/@/api/grossProfitTable/skuCalculate';
  import { getTableDetail } from '/@/api/grossProfitTable/skuCalculate';
  import { PlusSquareTwoTone } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { calculateGrossMargin } from '/@/utils/commom/calculateGross/calculate';
  import { useRouter } from 'vue-router';
  const { createMessage } = useMessage();
  import { useGo } from '/@/hooks/web/usePage';
  export default {
    components: {
      PlusSquareTwoTone,
    },
    setup() {
      const exchangeRate = ref('');
      const formRef = ref();
      const formRefEdit = ref();
      let dataSource: UnwrapRef<any> = reactive([]);
      const skuIdOptions = ref<any[]>([]);
      const skuNameOptions = ref<any[]>([]);
      const visible = ref<boolean>(false);
      let dataSourceKey = 0;
      let currentDataSourceKey = 0;
      let cnyDataSource = <any>[];
      let usdDataSource = <any>[];
      let cnyDataSourceTotal = {};
      let usdDataSourceTotal = <any>{};
      const totalDateSource = ref({});
      const $router = useRouter();
      const detailData = ref<any>({});
      const go = useGo();

      onMounted(() => {
        getTableDetail({ calculate_date: $router.currentRoute.value.query.calculate_date }).then(
          (res) => {
            //获取毛利表信息
            detailData.value = res;
            const list = JSON.parse(JSON.stringify(res.list)).map(item=>{
              item.dataSourceKey = dataSourceKey++
              return item
            })
            exchangeRate.value = res.exchangeRate;
            for (const key in formState) {
              if (Object.prototype.hasOwnProperty.call(formState, key)) {
                const element = res[key];
                formState[key] = element;
              }
            }
            formState.currency = false;
            //将数据区分为人民币跟美元
            calculateCurrency(list);
            calculateTotal();
            changeCurrency(formState.currency);
          },
        );
      });

      const calculateCurrency = (list) => {
        list.forEach((element) => {
          const cnyList = {
            ...element,
            businessVolume: (
              Number(element.businessVolume) * Number(detailData.value.exchangeRate)
            ).toFixed(2), //营业额
            adRate: (Number(element.adRate) * Number(detailData.value.exchangeRate)).toFixed(2), //广告费
          };
          cnyDataSource.push(cnyList);
          const usdList = {
            ...element,
            freight: (Number(element.freight) / Number(detailData.value.exchangeRate)).toFixed(2), //运费
            procurementCost: (
              Number(element.procurementCost) / Number(detailData.value.exchangeRate)
            ).toFixed(2), //采购成本
            serviceCharge: (
              Number(element.serviceCharge) / Number(detailData.value.exchangeRate)
            ).toFixed(2), //手续费
            perCustomerTransaction: (
              Number(element.perCustomerTransaction) / Number(detailData.value.exchangeRate)
            ).toFixed(2), //客单价
            estimatedProfit: (
              Number(element.estimatedProfit) / Number(detailData.value.exchangeRate)
            ).toFixed(2), //预估毛利
          };
          usdDataSource.push(usdList);
        });
      };

      /**
       * 币种切换
       * @param list 被修改的列表数据
       * @param isFirst 是否为选择sku商品
       */
      const recalculate = (list: any) => {
        const key = list.dataSourceKey;
        const numArray = [
          'purchase_ref_price',
          // 'businessVolume',
          // 'adRate',
          'estimatedProfit',
          'perCustomerTransaction',
          'freight',
          'procurementCost',
          'serviceCharge',
        ]; //需要进行币种转化的字段
        const rate = Number(formState.exchangeRate); //美元兑人民币汇率
        const index = dataSource.findIndex((res) => res.dataSourceKey === key);
        //若当前币种为人民币
        cnyDataSource[index] = list;
        //将美元表格内容填充转化
        let usdList = JSON.parse(JSON.stringify(list));
        numArray.forEach((name) => {
          if (usdList[name]) {
            usdList[name] = (Number(usdList[name]) / rate).toFixed(2);
          }
        });
        //不修改原本填入的广告费跟营业额
        usdDataSource[index] = {
          ...usdList,
          businessVolume: usdDataSource[index].businessVolume,
          adRate: usdDataSource[index].adRate,
        };
        //计算总额
        calculateTotal();
        //将计算后的值显示在当前表格上
        changeCurrency(formState.currency);
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

      //删除
      const deleteFn = (key: any) => {
        const index = dataSource.findIndex((res) => res.dataSourceKey === key);
        dataSource.splice(index, 1);
        usdDataSource.splice(index, 1);
        cnyDataSource.splice(index, 1);
        calculateTotal();
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

      //编辑
      const editFn = (record: any) => {
        const index = dataSource.findIndex((res) => res.dataSourceKey === record.dataSourceKey);
        if (!record.sku_goods_id || !record.purchase_ref_price) {
          createMessage.error('请选择sku');
          return;
        }
        const array = ['estimatedProportion', 'salesVolume', 'orderQuantity','businessVolume','adRate'];
        editColumns.forEach((res) => {
          if (array.includes(res.key)) {
            formStateEdit[res.key] = JSON.stringify(parseFloat(usdDataSource[index][res.key]));
          } else {
            formStateEdit[res.key] = usdDataSource[index][res.key];
          }
        });
        currentDataSourceKey = record.dataSourceKey;
        showModal();
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
        usdDataSource.push({
          dataSourceKey: key,
          sku_goods_id: '',
          name_cn: '',
        });
      };

      const showModal = () => {
        visible.value = true;
      };

      const handleOk = () => {
        formRefEdit.value
          .validate()
          .then(() => {
            let index = dataSource.findIndex((res) => res.dataSourceKey === currentDataSourceKey);
            usdDataSource[index] = {
              ...usdDataSource[index],
              ...formStateEdit,
            };
            //将广告费跟营业额转化为人民币
            const list = {
              ...cnyDataSource[index],
              ...formStateEdit,
              businessVolume: (
                Number(formStateEdit.businessVolume) * Number(formState.exchangeRate)
              ).toFixed(2),
              adRate: (Number(formStateEdit.adRate) * Number(formState.exchangeRate)).toFixed(2),
            };
            recalculate({
              ...list, //当前编辑栏填写的人民币内容
              ...calculateGrossMargin(
                'CNY',
                {
                  exchangeRate: formState.exchangeRate,
                  operatingCost: formState.operatingCost,
                  gramPrice: formState.gramPrice,
                  // gram: formState.gram,
                  // unitPrice: formState.unitPrice,
                },
                list,
              ), //计算人民币为基准下的其他数据
            });
            visible.value = false;
          })
          .catch((error: ValidateErrorEntity<FormState>) => {
            console.log('error', error);
          });
      };

      //计算数组总额
      const sum = (arr, key) => {
        let num = 0;
        arr.forEach((res) => {
          num = num + Number(res[key] ?? 0);
        });
        return num.toFixed(2);
      };

      //计算人民币跟美元总额
      const calculateTotal = () => {
        cnyDataSourceTotal = {
          total: cnyDataSource.length,
          salesVolumeTotal: sum(cnyDataSource, 'salesVolume'),
          orderQuantityTotal: sum(cnyDataSource, 'orderQuantity'),
          adRateTotal: sum(cnyDataSource, 'adRate'),
          businessVolumeTotal: sum(cnyDataSource, 'businessVolume'),
          freightTotal: sum(cnyDataSource, 'freight'),
          procurementCostTotal: sum(cnyDataSource, 'procurementCost'),
          serviceChargeTotal: sum(cnyDataSource, 'serviceCharge'),
          estimatedProfitTotal: sum(cnyDataSource, 'estimatedProfit'),
        };
        usdDataSourceTotal = {
          total: usdDataSource.length,
          salesVolumeTotal: sum(usdDataSource, 'salesVolume'),
          orderQuantityTotal: sum(usdDataSource, 'orderQuantity'),
          adRateTotal: sum(usdDataSource, 'adRate'),
          businessVolumeTotal: sum(usdDataSource, 'businessVolume'),
          freightTotal: sum(usdDataSource, 'freight'),
          procurementCostTotal: sum(usdDataSource, 'procurementCost'),
          serviceChargeTotal: sum(usdDataSource, 'serviceCharge'),
          estimatedProfitTotal: sum(usdDataSource, 'estimatedProfit'),
        };
      };

      const handleCancle = () => {
        visible.value = false;
      };

      const saveResults = () => {
        formRef.value
          .validate()
          .then(() => {
            let cnyList = cnyDataSource.map((res, index) => {
              res.businessVolume = usdDataSource[index].businessVolume;
              res.adRate = usdDataSource[index].adRate;
              return res;
            });
            let sendData: any = {
              ...formState,
              ...cnyDataSourceTotal,
              businessVolumeTotal: usdDataSourceTotal.businessVolumeTotal,
              adRateTotal: usdDataSourceTotal.adRateTotal,
              list: cnyList,
            };
            console.log(sendData);
            editDailyTable(sendData).then(() => {
              createMessage.success('修改商品信息成功！');
              back()
            });
          })
          .catch((error: ValidateErrorEntity<FormState>) => {
            console.log('error', error);
          });
      };

      const back = () => {
        go('/grossProfitTable/dailyTable');
      };

      //参数信息修改触发数据修改
      const changeParameter = () => {
        cnyDataSource.forEach((item, index) => {
          const list = {
            ...item,
            businessVolume: (
              Number(usdDataSource[index].businessVolume) * Number(formState.exchangeRate)
            ).toFixed(2),
            adRate: (Number(usdDataSource[index].adRate) * Number(formState.exchangeRate)).toFixed(
              2,
            ),
          };
          recalculate({
            ...list, //当前编辑栏填写的人民币内容
            ...calculateGrossMargin(
              'CNY',
              {
                exchangeRate: formState.exchangeRate,
                operatingCost: formState.operatingCost,
                gramPrice: formState.gramPrice,
                // gram: formState.gram,
                // unitPrice: formState.unitPrice,
              },
              list,
            ), //计算人民币为基准下的其他数据
          });
        });
      };

      return {
        labelCol: { span: 2 },
        labelColEdit: { span: 6 },
        wrapperCol: { span: 20 },
        wrapperColEdit: { span: 12 },
        formState,
        formRef,
        columns,
        dataSource,
        deleteFn,
        editFn,
        addTable,
        skuIdOptions,
        skuNameOptions,
        onSkuIdSelect,
        onSkuIdSearch,
        onSkuNameSelect,
        onSkuNameSearch,
        visible,
        showModal,
        handleOk,
        handleCancle,
        rules,
        formStateEdit,
        formRefEdit,
        editColumns,
        changeCurrency,
        exchangeRate,
        saveResults,
        total_columns,
        totalDateSource,
        editRules,
        back,
        changeParameter,
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
