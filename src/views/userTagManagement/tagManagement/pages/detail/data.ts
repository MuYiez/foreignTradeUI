import { reactive, UnwrapRef } from 'vue';
export interface FormState {
  tagName: string;
}

export const formState: UnwrapRef<FormState> = reactive({
  tagName: ''
});

export const rules = {
  tagName: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
};
