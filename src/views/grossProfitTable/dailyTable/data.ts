import { ColumnProps } from 'ant-design-vue/es/table/interface';
import { reactive, UnwrapRef } from 'vue';
import { TreeDataItem } from 'ant-design-vue/es/tree/Tree';
import moment from 'moment';
import { formatAmt } from '/@/utils/commom/format';
export interface FormState {
  calculate_date: Array<any>;
  user_id: string;
}

export const formState: UnwrapRef<FormState> = reactive({
  calculate_date: [moment(new Date()), moment(new Date())],
  user_id: '',
});

export interface FiledData {
  dataSource: Array<DataSource>;
  options: Array<any>;
}

export const data: UnwrapRef<FiledData> = reactive({
  dataSource: [],
  options: [],
});

//表格数据
export interface DataSource {
  tagId: string;
  tagName: string;
}
export const columns: ColumnProps[] = [
  {
    title: '日期/运营',
    dataIndex: 'calculate_date',
    key: 'calculate_date',
    slots: { title: '日期', customRender: 'calculate_date' },
  },
  // {
  //   title: '运营人员',
  //   dataIndex: 'nickname',
  //   key: 'nickname',
  // },
  {
    title: '汇率',
    dataIndex: 'exchangeRate',
    key: 'exchangeRate',
  },
  {
    title: '销量/订单量',
    dataIndex: 'salesVolumeTotal',
    key: 'salesVolumeTotal',
    slots: { title: '日期', customRender: 'salesVolumeTotal' },
  },
  // {
  //   title: '总订单量',
  //   dataIndex: 'orderQuantityTotal',
  //   key: 'orderQuantityTotal',
  // },
  {
    title: '总营业额',
    dataIndex: 'businessVolumeTotal',
    key: 'businessVolumeTotal',
    slots: { title: '总营业额', customRender: 'businessVolumeTotal' },
  },
  {
    title: '总广告费',
    dataIndex: 'adRateTotal',
    key: 'adRateTotal',
    slots: { title: '日期', customRender: 'adRateTotal' },
  },
  {
    title: '总运费',
    dataIndex: 'freightTotal',
    key: 'freightTotal',
    slots: { title: '日期', customRender: 'freightTotal' },
  },
  {
    title: '总采购成本',
    dataIndex: 'procurementCostTotal',
    key: 'procurementCostTotal',
    slots: { title: '日期', customRender: 'procurementCostTotal' },
  },
  {
    title: '总手续费',
    dataIndex: 'serviceChargeTotal',
    key: 'serviceChargeTotal',
    slots: { title: '日期', customRender: 'serviceChargeTotal' },
  },
  {
    title: '总paypal提现费',
    dataIndex: 'paypalCostTotal',
    key: 'paypalCostTotal',
    slots: { title: '日期', customRender: 'paypalCostTotal' },
  },
  {
    title: '总预估毛利',
    dataIndex: 'estimatedProfitTotal',
    key: 'estimatedProfitTotal',
    slots: { title: '日期', customRender: 'estimatedProfitTotal' },
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: { title: '操作', customRender: 'action' },
  },
];

export const detailColumns = [
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
    customRender: ({ text }) => {
      return formatAmt(text);
    },
  },
  {
    title: '重量(g)',
    dataIndex: 'weight',
    customRender: ({ text }) => {
      return formatAmt(text);
    },
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
    customRender: ({ text }) => {
      return formatAmt(text);
    },
  },
  {
    title: '广告费',
    dataIndex: 'adRate',
    customRender: ({ text }) => {
      return formatAmt(text);
    },
  },
  {
    title: '克重单价',
    dataIndex: 'gramPrice',
    slots: { customRender: 'gramPrice' },
  },
  {
    title: '运费',
    dataIndex: 'freight',
    customRender: ({ text }) => {
      return formatAmt(text);
    },
  },
  {
    title: '采购成本',
    dataIndex: 'procurementCost',
    customRender: ({ text }) => {
      return formatAmt(text);
    },
  },
  {
    title: '手续费',
    dataIndex: 'serviceCharge',
    customRender: ({ text }) => {
      return formatAmt(text);
    },
  },
  {
    title: '客单价',
    dataIndex: 'perCustomerTransaction',
    customRender: ({ text }) => {
      return formatAmt(text);
    },
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
    customRender: ({ text }) => {
      return formatAmt(text);
    },
  },
  {
    title: 'paypal提现费',
    dataIndex: 'paypalCost',
    customRender: ({ text }) => {
      return formatAmt(text);
    },
  },
  {
    title: '盈亏点',
    dataIndex: 'balancePoint',
    customRender: ({ text }) => {
      return formatAmt(text);
    },
  },
  {
    title: '单成效',
    dataIndex: 'effect',
    customRender: ({ text }) => {
      return formatAmt(text);
    },
  },
  {
    title: '预估毛利',
    dataIndex: 'estimatedProfit',
    customRender: ({ text }) => {
      return formatAmt(text);
    },
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
    format: true,
  },
  {
    title: '总广告费',
    key: 'adRateTotal',
    format: true,
  },
  {
    title: '总运费',
    key: 'freightTotal',
    format: true,
  },
  {
    title: '总采购成本',
    key: 'procurementCostTotal',
    format: true,
  },
  {
    title: '总手续费',
    key: 'serviceChargeTotal',
    format: true,
  },
  {
    title: '总paypal提现费',
    key: 'paypalCostTotal',
    format: true,
  },
  {
    title: '总毛利率',
    key: 'grossProfitRatioTotal',
  },
  {
    title: '总预估毛利',
    key: 'estimatedProfitTotal',
    format: true,
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
