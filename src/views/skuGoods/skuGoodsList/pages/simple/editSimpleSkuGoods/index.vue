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
          <editGoodsInfo
            ref="editGoodsInfo"
            :formState="formState"
            :picture_list="picture_list"
            :source_url_list="source_url_list"
          />
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
  import { defineComponent, ref, onMounted, UnwrapRef } from 'vue';
  import { formState, rules, FormState } from './data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { goodsInfoChange, getGoodsInfo } from '/@/api/skuGoods/goodsInfo';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { PlusCircleTwoTone, MinusCircleTwoTone, DownOutlined } from '@ant-design/icons-vue';
  import { useGo } from '/@/hooks/web/usePage';
  import editGoodsInfo from '../pages/editGoodsInfo/index.vue';
  import physicalDistribution from '../pages/physicalDistribution/index.vue';
  import supplyOfGoods from '../pages/supplyOfGoods/index.vue';
  import { useRouter } from 'vue-router';

  const { createMessage } = useMessage();

  export default defineComponent({
    name: 'EditSimpleSkuGoods',
    components: {
      PlusCircleTwoTone,
      MinusCircleTwoTone,
      DownOutlined,
      editGoodsInfo,
      physicalDistribution,
      supplyOfGoods,
    },
    setup() {
      const activeKey = ref('1');
      const go = useGo();
      const formRef = ref();
      const $router = useRouter();
      const editGoodsInfo = ref();
      const picture_list = ref([]);
      const source_url_list = ref([]);

      onMounted(() => {
        getGoodsInfo({ sku_goods_id: $router.currentRoute.value.query.sku_goods_id }).then(
          (res) => {
            for (const key in formState) {
              if (Object.prototype.hasOwnProperty.call(formState, key)) {
                const element = res[key];
                formState[key] = element;
              }
            }
            formState.goods_classify =
              res.goods_classify + '----' + res.classifyName + ' - ' + res.classifyType;
            picture_list.value = res.picture_list;
            source_url_list.value = res.source_url.split(',');
            formState.sales_method = res.sales_method.split(',');
            formState.developer = Number(res.developer)
            formState.purchaser = Number(res.purchaser)
          },
        );
      });

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(() => {
            const sendData = {
              ...formState,
              goods_classify: formState.goods_classify.split('----')[0],
              goods_classify_name: formState.goods_classify.split('----')[1],
              source_url: editGoodsInfo.value.sourceUrlList
                .map((res) => {
                  return res.url;
                })
                .join(','),
              sales_method: formState.sales_method.join(','),
              img_id: editGoodsInfo.value.picture_url.join(','),
            };
            goodsInfoChange(sendData).then(() => {
              createMessage.success('修改商品信息成功！');
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

      return {
        activeKey,
        formState,
        formRef,
        editGoodsInfo,
        rules,
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        picture_list,
        source_url_list,
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
