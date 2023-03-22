<template>
  <div class="gutter-example">
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="rules"
    >
      <a-tabs type="card" v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="商品信息">
          <goodsInfo ref="goodsInfo" :formState="formState" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="物流与包装">
          <physicalDistribution :formState="formState" />
        </a-tab-pane>
        <!-- <a-tab-pane key="3" tab="质检与供货">
          <supplyOfGoods :formState="formState" />
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
  import { formState, rules, FormState } from './data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { goodsInfoAdd } from '/@/api/skuGoods/goodsInfo';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { PlusCircleTwoTone, MinusCircleTwoTone, DownOutlined } from '@ant-design/icons-vue';
  import { useGo } from '/@/hooks/web/usePage';
  import goodsInfo from './pages/goodsInfo/index.vue';
  import physicalDistribution from './pages/physicalDistribution/index.vue';
  import supplyOfGoods from './pages/supplyOfGoods/index.vue';

  const { createMessage } = useMessage();

  export default defineComponent({
    name: 'AddSimpleSkuGoods',
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

      onMounted(() => {
        formState.developer = JSON.parse(localStorage.getItem('userInfo') ?? '').id;
      });

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(() => {
            const sendData = {
              ...formState,
              goods_classify: formState.goods_classify.split('----')[0],
              goods_classify_name: formState.goods_classify.split('----')[1],
              source_url: goodsInfo.value.sourceUrlList
                .map((res) => {
                  return res.url;
                })
                .join(','),
              sales_method: formState.sales_method.join(','),
              img_id: goodsInfo.value.picture_url.join(','),
            };
            goodsInfoAdd(sendData).then(() => {
              createMessage.success('新增商品信息成功！');
              //重置数据
              for (const key in formState) {
                if (Object.prototype.hasOwnProperty.call(formState, key)) {
                  switch (key) {
                    case 'sales_method':
                      formState[key] = ['goods'];
                      break;

                    case 'status':
                      formState[key] = 'A01';
                      break;

                    case 'warehouse_location':
                      formState[key] = ['W01'];
                      break;

                    case 'dangerous_goods':
                      formState[key] = 'D01';
                      break;

                    case 'developer':
                      formState[key] = JSON.parse(localStorage.getItem('userInfo') ?? '').id;
                      break;

                    default:
                      formState[key] = '';
                      break;
                  }
                }
              }
              go('/skuGoods/skuGoodsList?isChange=1');
            });
          })
          .catch((error: ValidateErrorEntity<FormState>) => {
            console.log('error', error);
          });
      };

      const back = () => {
        go('/skuGoods/skuGoodsList');
      };

      return {
        activeKey,
        formState,
        formRef,
        rules,
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        goodsInfo,
        onSubmit,
        back,
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
