import { reactive, UnwrapRef } from 'vue';
export interface FormState {
  userName: string;
  email: string;
  tagList: Array<any>;
}

export const formState: UnwrapRef<FormState> = reactive({
  userName:'',
  email: '',
  tagList:[]
});

export const rules = {
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
};
