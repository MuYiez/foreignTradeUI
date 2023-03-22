import { reactive, UnwrapRef } from 'vue';
export interface FormState {
  spu: string;
  sales_method: Array<any>;
  warehouse_location: Array<any>;
  goods_classify: string;
  developer: string|number;
  purchaser: string|number;
}

export const formState: UnwrapRef<FormState> = reactive({
  spu: '',
  sales_method: [],
  warehouse_location: [],
  goods_classify: '',
  developer: '',
  purchaser: '',
});

export const requiredList = [
  {
    name: '商品sku',
    key: 'sku_goods_id',
  },
  {
    name: '中文名称',
    key: 'name_cn',
  },
  {
    name: '采购参考价',
    key: 'purchase_ref_price',
  },
  {
    name: '商品净重',
    key: 'weight',
  },
];

export const rules = {
  spu: [{ required: false, message: '请输入商品SPU' }],
  sales_method: [{ required: true, message: '请选择销售方式', type: 'array' }],
  warehouse_location: [{ required: true, message: '请选择仓库', type: 'array' }],
  goods_classify: [{ required: true, message: '请选择销售方式' }],
  developer: [{ required: true, message: '请选择开发员' }],
  purchaser: [{ required: true, message: '请选择采购员' }],
};
