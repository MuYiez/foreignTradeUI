import { reactive, UnwrapRef } from 'vue';
import { TreeDataItem } from 'ant-design-vue/es/tree/Tree';
import moment from 'moment';
export interface FormState {
  calculateDate: any;
  currency: boolean;
  operatingCost: string | number;
  estimatedProportion: string | number;
  exchangeRate: string | number;
  paypalWithdrawDeposit: string | number;
}

export interface FormStateEdit {
  sku_goods_id: string;
  name_cn: string;
  gramPrice: string | number;
  salesVolume: string | number;
  orderQuantity: string | number;
  businessVolume: string | number;
  adRate: string | number;
}

export const formState: UnwrapRef<FormState> = reactive({
  calculateDate: moment(new Date(), 'YYYY-MM-DD'),
  currency: false,
  estimatedProportion: '',
  exchangeRate: '',
  operatingCost: '',
  paypalWithdrawDeposit: '',
});

export const formStateEdit: UnwrapRef<FormStateEdit> = reactive({
  sku_goods_id: '',
  name_cn: '',
  gramPrice: '',
  salesVolume: '',
  orderQuantity: '',
  businessVolume: '',
  adRate: '',
});

export const editColumns = [
  {
    label: 'sku编号',
    key: 'sku_goods_id',
    type: 'input',
    disabled: true,
    require: true,
  },
  {
    label: 'sku商品名称',
    key: 'name_cn',
    type: 'input',
    disabled: true,
    require: true,
  },
  {
    label: '克重单价',
    key: 'gramPrice',
    type: 'inputNumber',
    disabled: false,
    require: true,
  },
  {
    label: '销量',
    key: 'salesVolume',
    type: 'inputNumber',
    disabled: false,
    require: true,
  },
  {
    label: '订单量',
    key: 'orderQuantity',
    type: 'inputNumber',
    disabled: false,
    require: true,
  },
  {
    label: '营业额',
    key: 'businessVolume',
    type: 'inputNumber',
    disabled: false,
    require: true,
    prefix: true,
  },
  {
    label: '广告费',
    key: 'adRate',
    type: 'inputNumber',
    disabled: false,
    require: true,
    prefix: true,
  },
];

export const treeData: TreeDataItem[] = [
  {
    title: 'sku编号',
    key: 'sku_goods_id',
    disabled: true,
    index: 0,
  },
  {
    title: 'sku商品名称',
    key: 'name_cn',
    disabled: true,
    index: 1,
  },
  {
    title: '参考价',
    key: 'purchase_ref_price',
    index: 2,
  },
  {
    title: '重量(g)',
    key: 'weight',
    index: 3,
  },
  {
    title: '尺寸(cm)',
    key: 'size',
    index: 4,
  },
  {
    title: '销量',
    key: 'salesVolume',
    index: 5,
  },
  {
    title: '订单量',
    key: 'orderQuantity',
    index: 6,
  },
  {
    title: '营业额',
    key: 'businessVolume',
    index: 7,
  },
  {
    title: '广告费',
    key: 'adRate',
    index: 8,
  },
  {
    title: '克重单价',
    key: 'gramPrice',
    index: 9,
  },
  {
    title: '运费',
    key: 'freight',
    index: 10,
  },
  {
    title: '采购成本',
    key: 'procurementCost',
    index: 11,
  },
  {
    title: '手续费',
    key: 'serviceCharge',
    index: 12,
  },
  {
    title: '客单价',
    key: 'perCustomerTransaction',
    index: 13,
  },
  {
    title: '毛利占比',
    key: 'grossProfitRatio',
    index: 14,
  },
  {
    title: 'roi',
    key: 'roi',
    index: 15,
  },
  {
    title: '每单利润',
    key: 'unitProfit',
    index: 16,
  },
  {
    title: 'paypal提现费',
    key: 'paypalCost',
    index: 17,
  },
  {
    title: '盈亏点',
    key: 'balancePoint',
    index: 18,
  },
  {
    title: '单成效',
    key: 'effect',
    index: 19,
  },
  {
    title: '预估毛利',
    key: 'estimatedProfit',
    index: 20,
    disabled: true,
  },
];

export const columns = [
  {
    title: 'sku编号',
    dataIndex: 'sku_goods_id',
    slots: { customRender: 'sku_goods_id' },
    width: '150px',
    fixed: 'left',
  },
  {
    title: 'sku商品名称',
    dataIndex: 'name_cn',
    slots: { customRender: 'name_cn' },
    width: '150px',
    fixed: 'left',
  },
  {
    title: '参考价',
    dataIndex: 'purchase_ref_price',
    slots: { customRender: 'purchase_ref_price' },
  },
  {
    title: '重量(g)',
    dataIndex: 'weight',
    slots: { customRender: 'weight' },
  },
  {
    title: '尺寸(cm)',
    dataIndex: 'size',
    slots: { customRender: 'size' },
  },
  {
    title: '销量',
    dataIndex: 'salesVolume',
    slots: { customRender: 'salesVolume' },
  },
  {
    title: '订单量',
    dataIndex: 'orderQuantity',
    slots: { customRender: 'orderQuantity' },
  },
  {
    title: '营业额',
    dataIndex: 'businessVolume',
    slots: { customRender: 'businessVolume' },
  },
  {
    title: '广告费',
    dataIndex: 'adRate',
    slots: { customRender: 'adRate' },
  },
  {
    title: '克重单价',
    dataIndex: 'gramPrice',
    slots: { customRender: 'gramPrice' },
  },
  {
    title: '运费',
    dataIndex: 'freight',
    slots: { customRender: 'freight' },
  },
  {
    title: '采购成本',
    dataIndex: 'procurementCost',
    slots: { customRender: 'procurementCost' },
  },
  {
    title: '手续费',
    dataIndex: 'serviceCharge',
    slots: { customRender: 'serviceCharge' },
  },
  {
    title: '客单价',
    dataIndex: 'perCustomerTransaction',
  },
  {
    title: '毛利占比',
    dataIndex: 'grossProfitRatio',
  },
  {
    title: 'roi',
    dataIndex: 'roi',
  },
  {
    title: '每单利润',
    dataIndex: 'unitProfit',
  },
  {
    title: 'paypal提现费',
    dataIndex: 'paypalCost',
  },
  {
    title: '盈亏点',
    dataIndex: 'balancePoint',
  },
  {
    title: '单成效',
    dataIndex: 'effect',
  },
  {
    title: '预估毛利',
    dataIndex: 'estimatedProfit',
    slots: { customRender: 'estimatedProfit' },
    fixed: 'right',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: { title: '操作', customRender: 'action' },
    fixed: 'right',
  },
];

export const total_columns = [
  {
    title: '总数量',
    key: 'total',
  },
  {
    title: '总销量',
    key: 'salesVolumeTotal',
  },
  {
    title: '总订单量',
    key: 'orderQuantityTotal',
  },
  {
    title: '总营业额',
    key: 'businessVolumeTotal',
  },
  {
    title: '总广告费',
    key: 'adRateTotal',
  },
  {
    title: '总运费',
    key: 'freightTotal',
  },
  {
    title: '总采购成本',
    key: 'procurementCostTotal',
  },
  {
    title: '总手续费',
    key: 'serviceChargeTotal',
  },
  {
    title: '总paypal提现费',
    key: 'paypalCostTotal',
  },
  {
    title: '总毛利率',
    key: 'grossProfitRatioTotal',
  },
  {
    title: '总预估毛利',
    key: 'estimatedProfitTotal',
  },
];

export const rules = {
  gramPrice: [{ required: true, message: '请输入克重单价' }],
  salesVolume: [{ required: true, message: '请输入销量' }],
  orderQuantity: [{ required: true, message: '请输入订单量' }],
  businessVolume: [{ required: true, message: '请输入营业额' }],
  adRate: [{ required: true, message: '请输入广告费' }],
};

export const dangerous_goods_price = {
  '0.1': ['D01'],
  '0.12': ['D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08'],
};
