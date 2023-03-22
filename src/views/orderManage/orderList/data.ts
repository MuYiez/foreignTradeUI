import moment, { Moment } from 'moment';
import { reactive, UnwrapRef } from 'vue';
export interface FormState {
  user: String;
  shopline_name: String;
  id: String;
  sku: String;
  createDate: Array<any>;
}

export const formState: UnwrapRef<FormState> = reactive({
  user: '',
  shopline_name: '',
  id: '',
  sku: '',
  createDate: [moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
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
    title: '商品信息',
    dataIndex: 'goods_info',
    slots: { customRender: 'goods_info' },
  },
  {
    title: '订单金额',
    dataIndex: 'price',
    slots: { customRender: 'price' },
    width: '130px',
  },
  {
    title: '收件人「国家/地区」',
    dataIndex: 'recipients',
    slots: { customRender: 'recipients' },
    width: '170px',
  },
  {
    title: '订单号',
    dataIndex: 'id',
    slots: { customRender: 'id' },
  },
  {
    title: '时间',
    dataIndex: 'time',
    slots: { customRender: 'time' },
    width: '170px',
  },
  {
    title: '状态',
    dataIndex: 'status',
    slots: { customRender: 'status' },
    width: '180px',
  },
  {
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
    width: '90px',
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

export const sku_columns = [
  {
    title: '原sku',
    dataIndex: 'old_sku',
    slots: { customRender: 'old_sku' },
  },
  {
    title: 'sku组成',
    dataIndex: 'sku',
    slots: { customRender: 'sku' },
  },
  {
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
  },
];

export const change_sku_columns = [
  {
    title: '图片',
    dataIndex: 'img',
    slots: { customRender: 'img' },
    width:'105px'
  },
  {
    title: 'sku编号',
    dataIndex: 'sku_goods_id',
    slots: { customRender: 'sku_goods_id' },
    width: '300px',
  },
  {
    title: 'sku商品名称',
    dataIndex: 'name_cn',
    slots: { customRender: 'name_cn' },
    width: '300px',
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    slots: { customRender: 'quantity' },
    width: '100px',
  },
  {
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
  },
];
