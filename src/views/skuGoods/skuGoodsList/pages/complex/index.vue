<template>
  <div class="gutter-example">
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="rules"
    >
      <a-tabs type="card" v-model:activeKey="activeKey" @change="selectTabs">
        <a-tab-pane key="1" tab="商品信息">
          <goodsInfo
            ref="goodsInfo"
            :formState="formState"
            :getStrategicPassList="getStrategicPassList"
            :insertImg="insertImg"
          />
        </a-tab-pane>
        <a-tab-pane key="2" tab="物流与包装">
          <physicalDistribution ref="physicalDistribution" :formState="formState" />
        </a-tab-pane>
        <!-- <a-tab-pane key="3" tab="质检与供货">
          <supplyOfGoods ref="supplyOfGoods" :formState="formState" />
        </a-tab-pane> -->
      </a-tabs>

      <div style="text-align: right">
        <a-button type="primary" @click="onSubmit">保存</a-button>
        <a-button style="margin-left: 20px" @click="back">关闭</a-button>
      </div>
    </a-form>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { formState, rules, FormState, requiredList } from './data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addSpuInfo } from '/@/api/skuGoods/spu';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { PlusCircleTwoTone, MinusCircleTwoTone, DownOutlined } from '@ant-design/icons-vue';
  import { useGo } from '/@/hooks/web/usePage';
  import goodsInfo from './pages/goodsInfo/index.vue';
  import physicalDistribution from './pages/physicalDistribution/index.vue';
  import supplyOfGoods from './pages/supplyOfGoods/index.vue';

  const { createMessage } = useMessage();

  export default defineComponent({
    name: 'AddComplexSkuGoods',
    components: {
      PlusCircleTwoTone,
      MinusCircleTwoTone,
      DownOutlined,
      goodsInfo,
      physicalDistribution,
      supplyOfGoods,
    },
    setup() {
      const activeKey = ref('1');
      const go = useGo();
      const formRef = ref();
      const goodsInfo = ref();
      const physicalDistribution = ref();
      const supplyOfGoods = ref();
      const strategicPassList = ref(<any>{}); //中转数据，只接收子组件传来的数据而不做处理

      onMounted(() => {
        formState.developer = JSON.parse(localStorage.getItem('userInfo') ?? '').id;
      });

      const onSubmit = () => {
        if (!physicalDistribution.value) {
          createMessage.error('请检查物流与包装信息是否已填写完整');
          return;
        }
        formRef.value
          .validate()
          .then(() => {
            const sku_list = <any>[];
            let requiredObj = {
              isCompate: true,
              data: <any>{},
              sku_goods_id: '',
            };
            goodsInfo.value.dataSource.forEach((res, index) => {
              let list = {
                ...res,
                ...(physicalDistribution.value ? physicalDistribution.value.dataSource[index] : {}),
              };
              //检查是否填写所有必填项
              requiredList.forEach((item) => {
                const value = list[item.key];
                if (!value) {
                  requiredObj = {
                    isCompate: false,
                    data: item,
                    sku_goods_id: list.sku_goods_id,
                  };
                }
              });
              sku_list.push(list);
            });

            if (!requiredObj.isCompate) {
              createMessage.error(
                `商品sku为${requiredObj.sku_goods_id}的${requiredObj.data.name}为必填信息，请填写完整`,
              );
              return;
            }

            const sendData = {
              ...formState,
              goods_classify: formState.goods_classify.split('----')[0],
              goods_classify_name: formState.goods_classify.split('----')[1].split(' - ')[0],
              goods_classify_type: formState.goods_classify.split('----')[1].split(' - ')[1],
              sales_method: formState.sales_method.join(','),
              warehouse_location: formState.warehouse_location.join(','),
              img_id: goodsInfo.value.picture_url,
              sku_list,
            };

            addSpuInfo(sendData).then(() => {
              createMessage.success('新增商品信息成功！');
              //重置数据
              formState.spu = '';
              formState.sales_method = ['goods'];
              formState.warehouse_location = ['W01'];
              formState.goods_classify = '';
              formState.developer = JSON.parse(localStorage.getItem('userInfo') ?? '').id;
              formState.purchaser = '';
              back();
            });
          })
          .catch((error: ValidateErrorEntity<FormState>) => {
            console.log('error', error);
          });
      };

      const back = () => {
        go('/skuGoods/skuGoodsList');
      };

      const getStrategicPassList = (list) => {
        strategicPassList.value = list;
      };

      //将图片数据添加到其他表格
      const insertImg = (list) => {
        strategicPassList.value.isChange2 = true;
        strategicPassList.value.isChange3 = true;
        strategicPassList.value.list = list;
      };

      const selectTabs = (key) => {
        if (key === '2') {
          setTimeout(() => {
            physicalDistribution.value.getStrategicPassList(strategicPassList.value);
            strategicPassList.value.isChange2 = false;
          }, 10);
        }
        // else if (key === '3') {
        //   setTimeout(() => {
        //     supplyOfGoods.value.getStrategicPassList(strategicPassList.value);
        //     strategicPassList.value.isChange3 = false;
        //   }, 10);
        // }
      };

      return {
        activeKey,
        formState,
        formRef,
        rules,
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        goodsInfo,
        strategicPassList,
        physicalDistribution,
        supplyOfGoods,
        onSubmit,
        back,
        getStrategicPassList,
        selectTabs,
        insertImg,
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
