import moment, { Moment } from 'moment';
import { reactive, UnwrapRef } from 'vue';
import { formatAmt } from '/@/utils/commom/format';
export interface FormState {
  date: Array<any>;
  type: String;
  paymentMethod: String;
  paymentReady: String;
}

export const formState: UnwrapRef<FormState> = reactive({
  date: ['', ''],
  type: '',
  paymentMethod: '',
  paymentReady: '',
});

export interface EditFormState {
  date: Moment | undefined;
  expand: string | number;
  income: string | number;
  type: string;
  paymentMethod: string;
  paymentReady: string;
  origin: string;
}

export const editFormState: UnwrapRef<EditFormState> = reactive({
  date: moment(new Date()),
  expand: 0,
  income: 0,
  type: '',
  paymentMethod: '',
  paymentReady: '',
  origin: '',
});

export const rules = {
  date: [{ required: true, message: '请选择日期' }],
  expand: [{ required: true, message: '请输入支出金额' }],
  income: [{ required: true, message: '请输入收入金额' }],
  type: [{ required: true, message: '请选择类型' }],
  paymentMethod: [{ required: true, message: '请选择付款方式' }],
  paymentReady: [{ required: false, message: '请选择付款情况' }],
  origin: [{ required: false, message: '请输入事由' }],
};

export const accountColumns = [
  {
    title: '日期',
    dataIndex: 'date',
  },
  {
    title: '支出金额(CNY)',
    dataIndex: 'expand',
    customRender: ({ text }) => {
      return formatAmt(text);
    },
  },
  {
    title: '收入金额(CNY)',
    dataIndex: 'income',
    customRender: ({ text }) => {
      return formatAmt(text);
    },
  },
  {
    title: '类型',
    dataIndex: 'type',
    slots: { customRender: 'type' },
  },
  {
    title: '付款方式',
    dataIndex: 'paymentMethod',
    slots: { customRender: 'paymentMethod' },
  },
  {
    title: '付款情况',
    dataIndex: 'paymentReady',
    slots: { customRender: 'paymentReady' },
  },
  {
    title: '事由',
    dataIndex: 'origin',
  },
  {
    title: '期初',
    dataIndex: 'begin_price',
    customRender: ({ text }) => {
      return formatAmt(text);
    },
  },
  {
    title: '期末',
    dataIndex: 'end_price',
    customRender: ({ text }) => {
      return formatAmt(text);
    },
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
