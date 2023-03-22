import moment, { Moment } from 'moment';
import { reactive, UnwrapRef } from 'vue';
export interface FormState {
  id: String;
  createDate: Array<any>;
}

export const formState: UnwrapRef<FormState> = reactive({
  id: '',
  createDate: ['', ''],
});

export interface EditFormState {
  nickname: string;
  email: string;
  phone: string;
  userName: string;
  status: boolean;
  password: string;
  repassword: string;
  home_page: Array<any>;
}

export const formStateEdit: UnwrapRef<EditFormState> = reactive({
  nickname: '',
  email: '',
  phone: '',
  userName: '',
  status: true,
  password: '',
  repassword: '',
  home_page: [],
});

export const rules = {
  nickname: [{ required: true, message: '请输入姓名' }],
  email: [{ required: true, message: '请输入邮箱' }],
  phone: [{ required: true, message: '请输入电话' }],
  userName: [{ required: true, message: '请输入账号' }],
  home_page: [{ required: true, message: '请选择主页' }],
};

export const shopColumns = [
  {
    title: '账号',
    dataIndex: 'userName',
  },
  {
    title: '姓名',
    dataIndex: 'nickname',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '电话',
    dataIndex: 'phone',
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: ({ text }) => {
      return text ? '启用' : '停用';
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
  },
  {
    title: '创建人',
    dataIndex: 'parentName',
  },
  {
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
  },
];

export const columns = [
  {
    title: '日期',
    dataIndex: 'date',
    slots: { customRender: 'date' },
    width: '150px',
  },
  {
    title: '支出金额',
    dataIndex: 'expand',
    slots: { customRender: 'expand' },
    width: '120px',
  },
  {
    title: '收入金额',
    dataIndex: 'income',
    slots: { customRender: 'income' },
    width: '120px',
  },
  {
    title: '类型',
    dataIndex: 'type',
    slots: { customRender: 'type' },
    width: '150px',
  },
  {
    title: '付款方式',
    dataIndex: 'paymentMethod',
    slots: { customRender: 'paymentMethod' },
    width: '150px',
  },
  {
    title: '付款情况',
    dataIndex: 'paymentReady',
    slots: { customRender: 'paymentReady' },
    width: '150px',
  },
  {
    title: '事由',
    dataIndex: 'origin',
    slots: { customRender: 'origin' },
  },
  {
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
  },
];
