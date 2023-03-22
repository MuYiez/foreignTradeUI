<template>
  <div class="gutter-example">
    <div class="form-wrap">
      <p class="title">每日毛利</p>
      <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="8">
            <a-form-item label="查询人员">
              <a-select v-model:value="formState.user_id" placeholder="请选择查询人员">
                <a-select-option v-for="item in allUserData" :key="item.id" :value="item.id">
                  {{ item.nickname }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <a-form-item label="查询日期">
              <a-range-picker
                v-model:value="formState.calculate_date"
                placeholder="选择日期"
                style="width: 100%"
                allowClear
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="btn-wrap">
        <a-button type="primary" style="margin-right: 20px" @click="getData">查询</a-button>
      </div>
    </div>

    <div style="padding-top: 20px">
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="3">
          <div class="gutter-box">
            <div class="gutter-top">营业额</div>
            <div class="gutter-mid">${{ formatAmt(usdData.businessVolumeTotal) }}</div>
            <div class="gutter-bottom">￥{{ formatAmt(cnyData.businessVolumeTotal) }}</div>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="3">
          <div class="gutter-box">
            <div class="gutter-top">预估毛利</div>
            <div class="gutter-mid">${{ formatAmt(usdData.estimatedProfitTotal) }}</div>
            <div class="gutter-bottom">￥{{ formatAmt(cnyData.estimatedProfitTotal) }}</div>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="3">
          <i class="query-icon">
            <a-popover>
              <template #content> 客单价=营业额/单量 </template>
              <ExclamationCircleTwoTone />
            </a-popover>
          </i>
          <div class="gutter-box">
            <div class="gutter-top">客单价</div>
            <div class="gutter-mid">${{ formatAmt(usdData.procurementCostTotal) }}</div>
            <div class="gutter-bottom">￥{{ formatAmt(cnyData.procurementCostTotal) }}</div>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="3">
          <i class="query-icon">
            <a-popover>
              <template #content> 预估毛利率=预估毛利/营业额 </template>
              <ExclamationCircleTwoTone />
            </a-popover>
          </i>
          <div class="gutter-box">
            <div class="gutter-top">预估毛利率</div>
            <div class="gutter-mid">{{ usdData.grossProfitRatioTotal }}</div>
            <div class="gutter-bottom"> </div>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="3">
          <i class="query-icon">
            <a-popover>
              <template #content> 销售ROI=营业额/广告花费 </template>
              <ExclamationCircleTwoTone />
            </a-popover>
          </i>
          <div class="gutter-box">
            <div class="gutter-top">销售ROI</div>
            <div class="gutter-mid">{{ usdData.roiTotal }}</div>
            <div class="gutter-bottom"> </div>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="3">
          <div class="gutter-box">
            <div class="gutter-top">广告费用</div>
            <div class="gutter-mid">${{ formatAmt(usdData.adRateTotal) }}</div>
            <div class="gutter-bottom">￥{{ formatAmt(cnyData.adRateTotal) }}</div>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="3">
          <i class="query-icon">
            <a-popover>
              <template #content> 单均广告费=广告费用/订单量 </template>
              <ExclamationCircleTwoTone />
            </a-popover>
          </i>
          <div class="gutter-box">
            <div class="gutter-top">单均广告费</div>
            <div class="gutter-mid">${{ formatAmt(usdData.homogeneousAdrateTotal) }}</div>
            <div class="gutter-bottom">￥{{ formatAmt(cnyData.homogeneousAdrateTotal) }}</div>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="3">
          <div class="gutter-box">
            <div class="gutter-top">订单量</div>
            <div class="gutter-mid">{{ usdData.orderQuantityTotal }}</div>
            <div class="gutter-bottom"> </div>
          </div>
        </a-col>
      </a-row>
    </div>

    <div class="detail-wrap">
      <p class="title">毛利列表</p>
      <a-table
        :dataSource="data.dataSource"
        :columns="columns"
        :row-key="(record, index) => index"
        :pagination="pagination"
        :loading="loading"
      >
        <template #action="{ record }">
          <a @click="getDetail(record)">查看</a>
        </template>
        <template #calculate_date="{ record }">
          <div>{{ record.calculate_date }}</div>
          <div>{{ record.nickname }}</div>
        </template>
        <template #salesVolumeTotal="{ record }">
          <div>{{ record.salesVolumeTotal }}</div>
          <div>{{ record.orderQuantityTotal }}</div>
        </template>
        <template #businessVolumeTotal="{ record }">
          <div>${{ formatAmt(record.businessVolumeTotal) }}</div>
          <div style="color: #999">
            ￥{{
              formatAmt(
                (Number(record.businessVolumeTotal) * Number(record.exchangeRate)).toFixed(2),
              )
            }}
          </div>
        </template>
        <template #adRateTotal="{ record }">
          <div>${{ formatAmt(record.adRateTotal) }}</div>
          <div style="color: #999">
            ￥{{ formatAmt((Number(record.adRateTotal) * Number(record.exchangeRate)).toFixed(2)) }}
          </div>
        </template>
        <template #freightTotal="{ record }">
          <div>
            ${{ formatAmt((Number(record.freightTotal) / Number(record.exchangeRate)).toFixed(2)) }}
          </div>
          <div style="color: #999">￥{{ formatAmt(record.freightTotal) }}</div>
        </template>
        <template #procurementCostTotal="{ record }">
          <div>
            ${{
              formatAmt(
                (Number(record.procurementCostTotal) / Number(record.exchangeRate)).toFixed(2),
              )
            }}
          </div>
          <div style="color: #999">￥{{ formatAmt(record.procurementCostTotal) }}</div>
        </template>
        <template #serviceChargeTotal="{ record }">
          <div>
            ${{
              formatAmt(
                (Number(record.serviceChargeTotal) / Number(record.exchangeRate)).toFixed(2),
              )
            }}
          </div>
          <div style="color: #999">￥{{ formatAmt(record.serviceChargeTotal) }}</div>
        </template>
        <template #paypalCostTotal="{ record }">
          <div>${{ formatAmt(record.paypalCostTotal) }}</div>
          <div style="color: #999">
            ￥{{
              formatAmt((Number(record.paypalCostTotal) * Number(record.exchangeRate)).toFixed(2))
            }}
          </div>
        </template>
        <template #estimatedProfitTotal="{ record }">
          <div>
            ${{
              formatAmt(
                (Number(record.estimatedProfitTotal) / Number(record.exchangeRate)).toFixed(2),
              )
            }}
          </div>
          <div style="color: #999">￥{{ formatAmt(record.estimatedProfitTotal) }}</div>
        </template>
      </a-table>
    </div>

    <!-- 编辑框 Start -->
    <a-modal
      width="80%"
      :destroyOnClose="true"
      bodyStyle="padding:20px"
      v-model:visible="visible"
      title="毛利详情"
      @cancel="handleCancel"
      :centered="true"
    >
      <div>
        <a-descriptions :column="1">
          <a-descriptions-item label="日期">{{ detailData.date }}</a-descriptions-item>
          <a-descriptions-item label="币种">
            <a-switch
              checked-children="￥"
              un-checked-children="$"
              v-model:checked="currency"
              @change="changeCurrency"
            />
            {{ currency ? ' 人民币' : ' 美元' }}
          </a-descriptions-item>
        </a-descriptions>
        <!-- 参数信息 Start -->
        <div style="padding-bottom: 10px">参数信息：</div>
        <a-descriptions bordered :column="5">
          <a-descriptions-item label="操作费A(CNY)">
            {{ detailData.operatingCost }}
          </a-descriptions-item>
          <a-descriptions-item label="预估比例">
            {{ detailData.estimatedProportion }}%
          </a-descriptions-item>
          <a-descriptions-item label="汇率E">{{ detailData.exchangeRate }}</a-descriptions-item>
          <a-descriptions-item label="PayPal提现费(USD)">
            {{ detailData.paypalWithdrawDeposit }}
          </a-descriptions-item>
        </a-descriptions>
        <!-- 参数信息 End -->
        <div style="padding: 10px 0; display: flex; justify-content: space-between">
          <span>毛利表：</span>
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
          :data-source="currentDataSource"
          :pagination="false"
          :rowKey="(record, index) => index"
          bordered
          tableLayout="fixed"
          :scroll="{ x: localColumnsLength, y: 700 }"
          size="small"
        >
          <template #size="{ record }">
            <div style="width: 50px">
              {{ record.length }}*{{ record.wide }}*{{ record.height }}
            </div>
          </template>
        </a-table>

        <!-- 总数展示 Start -->
        <div style="padding: 10px 0">总数：</div>
        <a-descriptions bordered>
          <a-descriptions-item v-for="item in total_columns" :key="item.key" :label="item.title">
            <span v-if="item.format">{{ formatAmt(totalDateSource[item.key]) }}</span>
            <span v-else>{{ totalDateSource[item.key] }}</span>
          </a-descriptions-item>
        </a-descriptions>
        <!-- 总数展示 End -->
      </div>
      <template #footer>
        <a-button key="back" @click="handleCancel">关闭</a-button>
        <!-- <a-button key="submit" type="primary" @click="handleEdit">修改</a-button> -->
      </template>
    </a-modal>
    <!-- 编辑框 End -->
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, onMounted, UnwrapRef } from 'vue';
  import { ref } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import {
    data,
    columns,
    detailColumns,
    formState,
    FormState,
    total_columns,
    treeData,
  } from './data';
  import {
    searchDailyTable,
    getTableDetail,
    editGrossColumns,
    getGrossColumns,
  } from '/@/api/grossProfitTable/skuCalculate';
  import { allUser } from '/@/api/sys/user';
  import { calculateCurrency, calculateTotal } from '/@/utils/commom/calculateGross/calculate';
  import { TreeDataItem, TreeDragEvent, DropEvent } from 'ant-design-vue/es/tree/Tree';
  import { calculateGrossProfit } from '/@/utils/commom/calculateGross/calculateGrossProfit';
  import moment from 'moment';
  import { ExclamationCircleTwoTone } from '@ant-design/icons-vue';
  import { formatAmt } from '/@/utils/commom/format';

  export default defineComponent({
    name: 'DailyTable',
    components: {
      ExclamationCircleTwoTone,
    },
    setup() {
      const loading = ref(false);
      const go = useGo();
      const formRef = ref();
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
      const detailData = ref<any>({});
      const visible = ref<boolean>(false);
      const currency = ref<boolean>(false);
      const allUserData = ref(<any>[]);
      let cnyDataSource = <any>[];
      let usdDataSource = <any>[];
      let currentDataSource: UnwrapRef<any> = ref([]);
      let cnyDataSourceTotal = <any>{};
      let usdDataSourceTotal = <any>{};
      const totalDateSource = ref({});
      const localColumnsLength = ref(1200);
      const usdData = ref(<any>{});
      const cnyData = ref(<any>{});
      let selectNode: any = {};
      const gData = ref<TreeDataItem[]>(treeData);
      const parentKeys: Array<any> = treeData.map((item) => item.key);
      const checkedKeys = ref<any[]>([]);
      const localColumns = ref<any>(detailColumns);

      onMounted(() => {
        allUser({}).then((res) => {
          allUserData.value = res;
          allUserData.value.unshift({
            id: '',
            nickname: '所有数据',
          });
          formState.user_id = JSON.parse(localStorage.getItem('userInfo') ?? '').id;
          getData();
        });
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

      const getData = () => {
        formRef.value
          .validate()
          .then(() => {
            let calculate_date = <any>[];
            if (formState.calculate_date.length !== 0) {
              calculate_date = [
                moment(formState.calculate_date[0]).format('YYYY-MM-DD'),
                moment(formState.calculate_date[1]).format('YYYY-MM-DD'),
              ];
            }
            let sendData = {
              ...formState,
              pageSize: pagination.pageSize,
              pageNum: pagination.pageNo,
              calculate_date,
            };
            loading.value = true;
            searchDailyTable(sendData).then((res) => {
              data.dataSource = res.list;
              pagination.total = parseInt(res.total);
              pagination.showTotal = (total) => `共 ${total} 条`;
              usdData.value = res.totalData.usdData;
              cnyData.value = res.totalData.cnyData;
              loading.value = false;
            });
          })
          .catch((error: ValidateErrorEntity<FormState>) => {
            console.log('error', error);
          });
      };

      const onSizeChange = (current, pageSize) => {
        pagination.pageNo = 1;
        pagination.pageSize = pageSize;
        getData();
      };
      const onPageChange = (page) => {
        pagination.pageNo = page;
        getData();
      };

      const getDetail = (record) => {
        //数据清空
        cnyDataSource = <any>[];
        usdDataSource = <any>[];
        currentDataSource.value = [];
        cnyDataSourceTotal = <any>{};
        usdDataSourceTotal = <any>{};
        totalDateSource.value = {};
        getTableDetail({ calculate_date: record.calculate_date, user_id: record.user_id }).then(
          (res: any) => {
            detailData.value = res;
            //分别计算人民币和美元数据
            const list = res.list.map((element) => {
              return calculateGrossProfit(res, element);
            });
            const calculateCurrencyData = calculateCurrency(list, res.exchangeRate);
            cnyDataSource = calculateCurrencyData.cnyList;
            usdDataSource = calculateCurrencyData.usdList;
            //计算总额
            const calculateTotalData = calculateTotal(cnyDataSource, usdDataSource);
            cnyDataSourceTotal = calculateTotalData.cnyData;
            usdDataSourceTotal = calculateTotalData.usdData;
            changeCurrency(currency.value);
            visible.value = true;
          },
        );
      };

      //转化币种
      const changeCurrency = (type: boolean) => {
        if (type) {
          //美元转化为人民币
          cnyDataSource.forEach((item, index) => {
            currentDataSource.value[index] = item;
          });
          totalDateSource.value = cnyDataSourceTotal;
        } else {
          //人民币转化为美元
          usdDataSource.forEach((item, index) => {
            currentDataSource.value[index] = item;
          });
          totalDateSource.value = usdDataSourceTotal;
        }
      };

      const handleCancel = () => {
        cnyDataSource = <any>[];
        usdDataSource = <any>[];
        visible.value = false;
      };

      //跳转至修改页面
      const handleEdit = () => {
        go(
          '/grossProfitTable/dailyTable/dailyTableEdit?calculate_date=' +
            detailData.value.calculate_date,
        );
        visible.value = false;
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
          const columns_item = detailColumns.find((item) => item.dataIndex === key);
          if (checkedKeys.value.includes(key)) {
            localColumns.value.push(columns_item);
          }
        });
        
        localColumnsLength.value = (localColumns.value.length-10)>0?(localColumns.value.length-10)*120+1200:1200
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
        formState,
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        data,
        formRef,
        columns,
        loading,
        pagination,
        visible,
        detailData,
        currency,
        detailColumns,
        totalDateSource,
        currentDataSource,
        total_columns,
        allUserData,
        cnyData,
        usdData,
        gData,
        checkedKeys,
        localColumns,
        localColumnsLength,
        getData,
        getDetail,
        changeCurrency,
        handleCancel,
        handleEdit,
        formatAmt,
        onDragEnter,
        onDrop,
        editColumnsSort,
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
    margin-top: 20px;
    padding: 20px;
    background-color: #fff;
  }
  .gutter-row {
    position: relative;
    .query-icon {
      position: absolute;
      right: 20px;
      top: 10px;
      cursor: pointer;
    }
  }
  .gutter-box {
    background-color: #fff;
    border-radius: 5px;
    padding: 10px;
    .gutter-top {
      font-size: 12px;
      padding: 5px 0;
    }
    .gutter-mid {
      font-size: 16px;
      font-weight: 500;
    }
    .gutter-bottom {
      font-size: 12px;
      color: #999;
      height: 20px;
    }
  }
</style>
