import { reactive, UnwrapRef } from 'vue';
export interface FormState {
  label: string;
  value: string;
}

export const formState: UnwrapRef<FormState> = reactive({
  label: '',
  value: '',
});

export const rules = {
  label: [{ required: true, message: '请输入名称' }],
  value: [{ required: true, message: '请输入值' }],
};

export const typeList = reactive([
  {
    label: '类型',
    type: 'type',
    tags: <any>[],
  },
  {
    label: '付款方式',
    type: 'paymentMethod',
    tags: <any>[],
  },
  {
    label: '付款情况',
    type: 'paymentReady',
    tags: <any>[],
  },
]);
