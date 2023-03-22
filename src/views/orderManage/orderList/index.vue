<template>
  <div class="gutter-example">
    <div class="form-wrap">
      <p class="title">订单查询</p>
      <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="8">
            <a-form-item label="归属人">
              <a-select v-model:value="formState.user" placeholder="请选择归属人" allow-clear>
                <a-select-option v-for="item in allUserData" :key="item.id" :value="item.id">
                  {{ item.nickname }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <a-form-item label="店铺">
              <a-select
                v-model:value="formState.shopline_name"
                placeholder="请选择店铺"
                allow-clear
              >
                <a-select-option
                  v-for="item in allStore"
                  :key="item.shopline_name"
                  :value="item.shopline_name"
                >
                  {{ item.shopline_name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <a-form-item label="订单号">
              <a-input v-model:value="formState.id" placeholder="请输入订单号" allow-clear />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <a-form-item label="下单日期">
              <a-range-picker
                v-model:value="formState.createDate"
                placeholder="选择日期"
                style="width: 100%"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <a-form-item label="商品sku">
              <a-input v-model:value="formState.sku" placeholder="模糊查询sku" allow-clear />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="btn-wrap">
        <a-button type="primary" style="margin-right: 20px" @click="getData">查询</a-button>
        <a-button @click="synchronousOrder">同步shopline订单</a-button>
      </div>
    </div>

    <div class="detail-wrap">
      <p class="title">订单列表</p>
      <a-table
        :dataSource="shopDataSource"
        :columns="shopColumns"
        row-key="id"
        :pagination="pagination"
        :loading="loading"
        bordered
      >
        <template #goods_info="{ record }">
          <ul>
            <li v-for="(t, index) in record.line_items" :key="t.id">
              <div style="display: flex; vertical-align: middle; align-items: center">
                <div>
                  <a-image v-if="t.image_url" :width="68" :height="68" :src="t.image_url" />
                  <img v-else src="../../../assets/images/kong.png" />
                </div>

                <div class="goods">
                  <p>
                    <a style="color: #428bca">{{ t.sku ?? '未匹配' }}</a>
                    ×<span>{{ t.quantity }}</span>
                  </p>
                  <p style="font-size: 12px">{{ record.currency }} {{ t.price }}</p>
                  <p style="font-size: 12px">{{ t.attribute }}</p>
                </div>

                <div v-if="t.sku_status === '0'">
                  <a-popover>
                    <template #content>
                      <p style="margin: 0">sku异常</p>
                      <p style="margin: 0">请匹配正确的sku</p>
                    </template>
                    <span class="warning">!</span>
                  </a-popover>
                </div>
              </div>
              <a-divider
                style="margin: 5px 0"
                dashed
                v-if="index !== record.line_items.length - 1"
              />
            </li>
          </ul>
        </template>
        <template #price="{ record }">
          <div>
            <p>{{ record.currency }} {{ record.current_total_price }}</p>
            <p style="color: #737679">
              <PayCircleOutlined />
              CNY
              {{ (Number(record.current_total_price) * Number(record.exchangeRate)).toFixed(2) }}</p
            >
          </div>
        </template>
        <template #recipients="{ record }">
          <div>
            <p>
              <span style="padding-right: 20px">{{ record.shipping_address.name }}</span>
            </p>
            <p>
              [{{
                countryCode.find((res) => res[0] === record.shipping_address.country_code)?.[1]
              }}]
            </p>
            <p style="color: #737679">
              支付：{{
                shoplineParameter.payment_gateway_names[record.payment_gateway_names] ??
                record.payment_gateway_names
              }}
            </p>
          </div>
        </template>
        <template #id="{ record }">
          <p>
            <a>{{ record.id }}</a>
          </p>
          <p> 买家指定： </p>
          <p style="font-size: 12px">
            {{ record.shipping_lines[0].title }}
          </p>
        </template>
        <template #time="{ record }">
          <div>
            <p>下单：</p>
            <p>{{ moment(record.created_at).format('YYYY-MM-DD HH:mm:ss') }}</p>
            <p>付款：</p>
            <p>{{ moment(record.order_at).format('YYYY-MM-DD HH:mm:ss') }}</p>
          </div>
        </template>
        <template #status="{ record }">
          <div>
            <p>[shopline:{{ record.shop_name }}]</p>
            <p>{{ shoplineParameter.financial_status[record.financial_status] }}</p>
          </div>
        </template>
        <template #action="{ record }">
          <div class="editable-row-operations">
            <p><a @click="getDetail(record)">详情</a></p>
            <p><a @click="matchSkuFn(record)">匹配SKU</a></p>
          </div>
        </template>
      </a-table>
    </div>

    <!-- 匹配sku Start -->
    <a-modal
      v-model:visible="matchVisible"
      width="60%"
      bodyStyle="padding:20px"
      title="sku信息"
      @cancel="handleMatchCancel"
    >
      <a-table
        :columns="sku_columns"
        row-key="old_sku"
        :data-source="sku_data"
        bordered
        :pagination="false"
      >
        <template #old_sku="{ record }">
          <div style="display: flex; vertical-align: middle; align-items: center">
            <div>
              <a-image v-if="record.image_url" :width="68" :height="68" :src="record.image_url" />
              <img style="height: 68px; width: 68px" v-else src="../../../assets/images/kong.png" />
            </div>

            <div class="goods">
              {{ record.old_sku }}
            </div>
          </div>
        </template>
        <template #sku="{ record }">
          <ul>
            <li v-for="(item, index) in record.sku_list" :key="item.sku">
              <div style="display: flex; vertical-align: middle; align-items: center">
                <div>
                  <a-image
                    v-if="item.img_list.url"
                    :width="68"
                    :height="68"
                    :src="item.img_list.url"
                  />
                  <img
                    style="height: 68px; width: 68px"
                    v-else
                    src="../../../assets/images/kong.png"
                  />
                </div>

                <div class="goods">
                  <p>
                    <a>
                      {{ item.sku }}<span v-if="item.quantity !== 1">*{{ item.quantity }}</span>
                    </a>
                  </p>
                  <p>{{ item.name_cn }}</p>
                </div>
              </div>

              <a-divider style="margin: 5px 0" dashed v-if="index !== record.sku_list.length - 1" />
            </li>
          </ul>
        </template>
        <template #action="{ record }">
          <a @click="changeSku(record)">修改sku组成</a>
        </template>
      </a-table>
      <template #footer>
        <a-button key="back" @click="handleMatchCancel">关闭</a-button>
      </template>
    </a-modal>
    <!-- 匹配sku End -->

    <!-- 修改sku Start -->
    <a-modal
      v-model:visible="skuVisible"
      width="60%"
      bodyStyle="padding:20px"
      title="修改sku"
      @ok="changeSkuOk"
      @cancel="changeSkuCancel"
    >
      <a-table
        :columns="change_sku_columns"
        row-key="dataSourceKey"
        :data-source="dataSource"
        bordered
        :pagination="false"
      >
        <template #img="{ record }">
          <div>
            <a-image v-if="record.img" :width="68" :height="68" :src="record.img" />
            <img style="height: 68px; width: 68px" v-else src="../../../assets/images/kong.png" />
          </div>
        </template>
        <template #sku_goods_id="{ record, index }">
          <a-auto-complete
            width="100%"
            v-model:value="dataSource[index].sku"
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
            width="100%"
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
        <template #quantity="{ index }">
          <a-input
            v-model:value="dataSource[index].quantity"
            placeholder="请输入数量"
            type="number"
            min="1"
          />
        </template>
        <template #action="{ record }">
          <div class="editable-row-operations">
            <a @click="deleteFn(record.dataSourceKey)">删除</a>
          </div>
        </template>
      </a-table>
      <div style="text-align: center; padding-top: 10px">
        <PlusSquareTwoTone
          style="font-size: 30px; margin: auto 0; cursor: pointer"
          @click="addTable"
        />
      </div>
    </a-modal>
    <!-- 修改sku End -->

    <!-- 详情 Start -->
    <a-modal
      v-model:visible="detailVisible"
      width="80%"
      bodyStyle="padding:20px"
      title="订单详情"
      @cancel="handleDetailCancel"
    >
      <orderDetail :detailData="detailData" />
      <template #footer>
        <a-button key="back" @click="handleDetailCancel">关闭</a-button>
      </template>
    </a-modal>
    <!-- 详情 End -->
  </div>
</template>

<script lang="ts">
  import { ref, reactive, onMounted, defineComponent } from 'vue';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import {
    columns,
    formState,
    shopColumns,
    FormState,
    sku_columns,
    change_sku_columns,
  } from './data';
  import { PayCircleOutlined, PlusSquareTwoTone } from '@ant-design/icons-vue';
  import {
    getShoplineOrder,
    getOrder,
    searchShop,
    searchOrderSku,
    matchSku,
  } from '/@/api/orderManage/orderInfo';
  import { autosearch } from '/@/api/grossProfitTable/skuCalculate';
  import { allUser } from '/@/api/sys/user';
  import moment from 'moment';
  import { useMessage } from '/@/hooks/web/useMessage';
  import countryCode from '/@/utils/commom/countryCode.json';
  import shoplineParameter from '/@/utils/commom/shoplineParameter.json';
  import orderDetail from './pages/detail.vue';
  export default defineComponent({
    name: 'OrderList',
    components: {
      PayCircleOutlined,
      PlusSquareTwoTone,
      orderDetail,
    },
    setup() {
      const { createMessage } = useMessage();
      const skuVisible = ref(false);
      const matchVisible = ref(false);
      const detailVisible = ref(false);
      const loading = ref(false);
      const formRef = ref();

      const shopDataSource = ref(<any>[]);
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
      const allUserData = ref(<any>[]);
      const allStore = ref(<any>[]);
      const sku_data = ref(<any>[]);
      const sku_change_data = ref(<any>{});
      const skuIdOptions = ref<any[]>([]);
      const skuNameOptions = ref<any[]>([]);
      const dataSource = ref<any[]>([]);
      let dataSourceKey = 0;
      let current_order_id = '';
      const detailData = ref(<any>{});

      onMounted(() => {
        allUser({}).then((res) => {
          allUserData.value = res;
        });
        searchShop({}).then((res) => {
          allStore.value = res;
        });
        getData();
        formState.user = JSON.parse(localStorage.getItem('userInfo') ?? '').id;
      });

      const onSizeChange = (current, pageSize) => {
        pagination.pageNo = 1;
        pagination.pageSize = pageSize;
        getData();
      };

      const onPageChange = (page) => {
        pagination.pageNo = page;
        getData();
      };

      const synchronousOrder = () => {
        const sendData = {
          user: formState.user,
        };
        getShoplineOrder(sendData).then(() => {
          createMessage.success('订单同步中，请稍候~');
        });
      };

      const getData = () => {
        formRef.value
          .validate()
          .then(() => {
            let createDate = <any>[];
            if (
              formState.createDate.length !== 0 &&
              formState.createDate[0] &&
              formState.createDate[1]
            ) {
              createDate = [
                moment(formState.createDate[0]).format('YYYY-MM-DD'),
                moment(formState.createDate[1]).format('YYYY-MM-DD'),
              ];
            }
            let sendData = {
              ...formState,
              pageSize: pagination.pageSize,
              pageNum: pagination.pageNo,
              createDate,
            };
            loading.value = true;
            getOrder(sendData).then((res) => {
              shopDataSource.value = res.list;
              pagination.total = parseInt(res.total);
              pagination.showTotal = (total) => `共 ${total} 条`;
              loading.value = false;
            });
          })
          .catch((error: ValidateErrorEntity<FormState>) => {
            console.log('error', error);
          });
      };

      const matchSkuFn = (record) => {
        current_order_id = record.id;
        searchOrderSku({ order_id: record.id, user: record.user }).then((res) => {
          sku_data.value = res;
          sku_change_data.value.user = record.user;
          matchVisible.value = true;
        });
      };
      const handleMatchCancel = () => {
        matchVisible.value = false;
      };
      const getDetail = (record) => {
        console.log(record);
        detailData.value = record;
        detailVisible.value = true;
      };
      const changeSku = (record) => {
        skuVisible.value = true;
        sku_change_data.value = {
          ...sku_change_data.value,
          ...record,
        };
        dataSource.value = record.sku_list.map((item) => {
          return {
            sku: item.sku,
            dangerous_goods: item.dangerous_goods,
            purchase_ref_price: item.purchase_ref_price,
            quantity: item.quantity,
            name_cn: item.name_cn,
            img: item.img_list.url,
            dataSourceKey: dataSourceKey++,
          };
        });
      };
      const changeSkuCancel = (record) => {
        skuVisible.value = false;
      };
      const changeSkuOk = () => {
        const { old_sku, created_at, user } = sku_change_data.value;
        const sendData = {
          old_sku,
          date: moment(created_at).format('YYYY-MM-DD'),
          user,
          list: dataSource.value,
        };
        matchSku(sendData).then(() => {
          searchOrderSku({ order_id: current_order_id, user }).then((res) => {
            sku_data.value = res;
            sku_change_data.value.user = user;

            createMessage.success('重新匹配sku成功，毛利表已更新');
            skuVisible.value = false;
            getData();
          });
        });
      };

      const onSkuIdSelect = (searchText: string, key: string) => {
        const list = skuIdOptions.value.find((res) => res.sku_goods_id === searchText);
        const index = dataSource.value.findIndex((res) => res.dataSourceKey === key);
        dataSource.value[index].name_cn = list.name_cn;
        dataSource.value[index].sku = list.sku_goods_id;
        dataSource.value[index].quantity = 1;
        dataSource.value[index].img = list.url;
        dataSource.value[index].dangerous_goods = list.dangerous_goods;
        dataSource.value[index].purchase_ref_price = list.purchase_ref_price;
      };

      const onSkuIdSearch = (value: string) => {
        autosearch({ sku_goods_id: value }).then((res) => {
          skuIdOptions.value = res;
        });
      };

      const onSkuNameSelect = (searchText: string, key: string) => {
        const list = skuNameOptions.value.find((res) => res.sku_goods_id === searchText);
        const index = dataSource.value.findIndex((res) => res.dataSourceKey === key);
        dataSource.value[index].name_cn = list.name_cn;
        dataSource.value[index].sku = list.sku_goods_id;
        dataSource.value[index].quantity = 1;
        dataSource.value[index].img = list.url;
        dataSource.value[index].dangerous_goods = list.dangerous_goods;
        dataSource.value[index].purchase_ref_price = list.purchase_ref_price;
      };

      const onSkuNameSearch = (value: string) => {
        autosearch({ name_cn: value }).then((res) => {
          skuNameOptions.value = res;
        });
      };

      //删除
      const deleteFn = (key: any) => {
        const index = dataSource.value.findIndex((res) => res.dataSourceKey === key);
        dataSource.value.splice(index, 1);
      };

      //添加
      const addTable = () => {
        dataSource.value.push({
          dataSourceKey: dataSourceKey++,
          sku: '',
          name_cn: '',
        });
      };

      //添加
      const handleDetailCancel = () => {
        detailVisible.value = false;
      };

      return {
        columns,
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        allUserData,
        matchVisible,
        formRef,
        formState,
        pagination,
        loading,
        shopColumns,
        shopDataSource,
        countryCode,
        shoplineParameter,
        dataSource,
        moment,
        allStore,
        skuVisible,
        detailVisible,
        sku_columns,
        sku_data,
        skuIdOptions,
        skuNameOptions,
        change_sku_columns,
        detailData,
        getData,
        synchronousOrder,
        matchSkuFn,
        handleMatchCancel,
        getDetail,
        changeSku,
        changeSkuCancel,
        changeSkuOk,
        onSkuIdSelect,
        onSkuIdSearch,
        onSkuNameSelect,
        onSkuNameSearch,
        deleteFn,
        addTable,
        handleDetailCancel,
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

    p {
      margin: 0;
    }
    ul {
      margin: 0;
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
    position: absolute;
  }
  .goods {
    padding: 0 5px;
    p {
      margin: 0;
    }
  }
  .warning {
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 18xp;
    font-size: 12px;
    text-align: center;
    border-radius: 100%;
    background-color: red;
    color: #fff;
    cursor: pointer;
  }
</style>
