import { reactive, UnwrapRef } from 'vue';
export interface FormState {
  sku_goods_id:string;
  spu: string;
  sku_rule: string;
  sales_method: Array<any>;
  status: string;
  goods_classify: string;
  name_cn: string;
  name_en: string;
  platform_sku: string;
  Identification_code: string;
  source_url: string;
  developer: string | number;
  purchaser: string | number;
  warehouse_location: Array<any>;
  declare_cn: string;
  declare_en: string;
  declare_price: string | number;
  declare_weight: string | number;
  material_quality: string;
  purpose: string;
  customs_id: string;
  dangerous_goods: string;
  weight: string | number;
  weighting_error: string | number;
  length: string | number;
  wide: string | number;
  height: string | number;
  purchase_ref_price: string | number;
}

export const formState: UnwrapRef<FormState> = reactive({
  sku_goods_id:'',
  sku_rule: '',
  spu: '',
  sales_method: ['goods'],
  status: 'A01',
  goods_classify: '',
  name_cn: '',
  name_en: '',
  platform_sku: '',
  Identification_code: '',
  source_url: '',
  developer: '',
  purchaser: '',
  warehouse_location: ['W01'],
  declare_cn: '',
  declare_en: '',
  declare_price: 0,
  declare_weight: 0,
  material_quality: '',
  purpose: '',
  customs_id: '',
  dangerous_goods: 'D01',
  weight: '',
  weighting_error: '',
  length: '',
  wide: '',
  height: '',
  purchase_ref_price: '',
});

export const rules = {
  sku_rule: [{ required: true, message: '请输入商品规格' }],
  sku_goods_id: [{ required: false }],
  spu: [{ required: false }],
  sales_method: [{ required: true, message: '请选择销售方式', type: 'array' }],
  status: [{ required: true, message: '请选择商品状态' }],
  goods_classify: [{ required: true, message: '请选择产品分类' }],
  name_cn: [{ required: true, message: '请填写中文名称' }],
  name_en: [{ required: false }],
  platform_sku: [{ required: false }],
  Identification_code: [{ required: false }],
  source_url: [{ required: false }],
  developer: [{ required: true, message: '请选择开发员' }],
  purchaser: [{ required: true, message: '请选择采购员' }],
  warehouse_location: [{ required: false }],
  declare_cn: [{ required: false }],
  declare_en: [{ required: false }],
  declare_price: [{ required: false }],
  declare_weight: [{ required: false }],
  purpose: [{ required: false }],
  customs_id: [{ required: false }],
  dangerous_goods: [{ required: false }],
  weight: [{ required: true, message: '请输入商品净重' }],
  weighting_error: [{ required: false }],
  length: [{ required: false }],
  wide: [{ required: false }],
  height: [{ required: false }],
  purchase_ref_price: [{ required: true, message: '请输入采购参考价' }],
};
