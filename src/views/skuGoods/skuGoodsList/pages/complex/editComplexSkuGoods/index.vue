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
          <editGoodsInfo
            ref="editGoodsInfo"
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
  import { getSpuInfo, editSpuInfo } from '/@/api/skuGoods/spu';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { PlusCircleTwoTone, MinusCircleTwoTone, DownOutlined } from '@ant-design/icons-vue';
  import { useGo } from '/@/hooks/web/usePage';
  import editGoodsInfo from '../pages/editGoodsInfo/index.vue';
  import physicalDistribution from '../pages/physicalDistribution/index.vue';
  import supplyOfGoods from '../pages/supplyOfGoods/index.vue';
  import { useRouter } from 'vue-router';

  const { createMessage } = useMessage();

  export default defineComponent({
    name: 'EditComplexSkuGoods',
    components: {
      PlusCircleTwoTone,
      MinusCircleTwoTone,
      DownOutlined,
      editGoodsInfo,
      physicalDistribution,
      supplyOfGoods,
    },
    setup() {
      const $router = useRouter();
      const activeKey = ref('1');
      const go = useGo();
      const formRef = ref();
      const editGoodsInfo = ref();
      const physicalDistribution = ref();
      const supplyOfGoods = ref();
      const strategicPassList = ref(<any>{
        isChange2: true,
        isChange3: true,
        list: [],
      });
      let firstEdit = {
        tab2: true,
        tab3: true,
      };
      let old_sku_list = '';
      let insert_time = '';

      onMounted(() => {
        //回显数据
        getSpuInfo({ spu: $router.currentRoute.value.query.spu }).then((res) => {
          old_sku_list = res.sku_list;
          insert_time = res.insert_time;
          for (const key in formState) {
            if (Object.prototype.hasOwnProperty.call(formState, key)) {
              const element = res[key];
              formState[key] = element;
            }
          }
          formState.goods_classify =
            res.goods_classify + '----' + res.classifyName + ' - ' + res.classifyType;
          formState.sales_method = res.sales_method ? res.sales_method.split(',') : [];
          formState.warehouse_location = res.warehouse_location
            ? res.warehouse_location.split(',')
            : [];
          formState.developer = Number(res.developer);
          formState.purchaser = Number(res.purchaser);
          editGoodsInfo.value.imgUrl = res.url;
          editGoodsInfo.value.picture_url = res.img_id;
          res.skuList.forEach((list) => {
            strategicPassList.value.list.push({
              ...list,
              img: list.img_list[0],
              imgId: list.img_id.split(',')[0],
            });
            editGoodsInfo.value.dataSource.push({
              ...list,
              img: list.img_list[0],
              imgId: list.img_id.split(',')[0],
            });
          });
        });
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
            editGoodsInfo.value.dataSource.forEach((res, index) => {
              let list = {
                ...res,
                declare_cn: physicalDistribution.value.dataSource[index].declare_cn,
                declare_en: physicalDistribution.value.dataSource[index].declare_en,
                declare_price: physicalDistribution.value.dataSource[index].declare_price,
                declare_weight: physicalDistribution.value.dataSource[index].declare_weight,
                material_quality: physicalDistribution.value.dataSource[index].material_quality,
                purpose: physicalDistribution.value.dataSource[index].purpose,
                customs_id: physicalDistribution.value.dataSource[index].customs_id,
                dangerous_goods: physicalDistribution.value.dataSource[index].dangerous_goods,
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
              img_id: editGoodsInfo.value.picture_url,
              sku_list,
              old_sku_list,
              insert_time,
            };

            editSpuInfo(sendData).then(() => {
              createMessage.success('修改商品信息成功！');
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
        strategicPassList.value.list = list.map((res, index) => {
          return {
            ...strategicPassList.value.list[index],
            img: res.img,
            imgId: res.imgId,
          };
        });
      };

      const selectTabs = (key) => {
        if (key === '2') {
          setTimeout(() => {
            physicalDistribution.value.getStrategicPassList(strategicPassList.value);
            strategicPassList.value.isChange2 = false;
            if (firstEdit.tab2) {
              physicalDistribution.value.dataSource = strategicPassList.value.list;
              firstEdit.tab2 = false;
            }
          }, 10);
        }
        // else if (key === '3') {
        //   setTimeout(() => {
        //     supplyOfGoods.value.getStrategicPassList(strategicPassList.value);
        //     strategicPassList.value.isChange3 = false;
        //     if (firstEdit.tab3) {
        //       supplyOfGoods.value.dataSource = strategicPassList.value.list;
        //       firstEdit.tab3 = false;
        //     }
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
        editGoodsInfo,
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
