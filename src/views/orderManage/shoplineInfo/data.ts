import moment, { Moment } from 'moment';
import { reactive, UnwrapRef } from 'vue';
export interface FormState {
  user: String;
  createDate: Array<any>;
}

export const formState: UnwrapRef<FormState> = reactive({
  user: '',
  createDate: ['', ''],
});

export interface EditFormState {
  createDate: Moment | undefined;
  shopline_name: string;
  appkey: string;
  APPSecret: string;
  token: string;
  user: string;
}

export const formStateEdit: UnwrapRef<EditFormState> = reactive({
  createDate: moment(new Date()),
  shopline_name: '',
  appkey: '',
  APPSecret: '',
  token: '',
  user: '',
});

export const rules = {
  createDate: [{ required: true, message: '请选择日期' }],
  shopline_name: [{ required: true, message: '请输入店铺名称' }],
  appkey: [{ required: true, message: '请输入App Key' }],
  APPSecret: [{ required: true, message: '请输入APP Secret' }],
  token: [{ required: true, message: '请输入后台 API 访问令牌' }],
};

export const shopColumns = [
  {
    title: '店铺',
    dataIndex: 'shopline_name',
  },
  {
    title: '归属人',
    dataIndex: 'nickname',
  },
  {
    title: '最新订单',
    dataIndex: 'since_id',
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
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
