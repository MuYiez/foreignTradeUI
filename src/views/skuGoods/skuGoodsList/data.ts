import { reactive, UnwrapRef } from 'vue';
export interface FormState {
  name_cn: string;
  spu: string;
  sku_goods_id: string;
  goods_classify:string;
  developer:string;
}

export const formState: UnwrapRef<FormState> = reactive({
  name_cn: '',
  spu: '',
  sku_goods_id: '',
  goods_classify: '',
  developer: '',
});
