import { reactive, UnwrapRef } from 'vue';
export interface FormState {
  calculate_date: any;
  currency: boolean;
  operatingCost:string;
  gramPrice:string;
  // gram:string;
  // unitPrice:string;
  exchangeRate:string;
}

export interface FormStateEdit {
  sku_goods_id:string;
  name_cn:string;
  // purchase_ref_price:string|number;
  // weight:string|number;
  // length:string|number;
  // width:string|number;
  // height:string|number;
  estimatedProportion:string|number;
  salesVolume:string|number;
  orderQuantity:string|number;
  businessVolume:string|number;
  adRate:string|number;
}

export const formState: UnwrapRef<FormState> = reactive({
  calculate_date: '',
  currency:true,
  operatingCost:'',
  // gramPrice:'',
  // gram:'',
  unitPrice:'',
  exchangeRate:'',
});

export const formStateEdit: UnwrapRef<FormStateEdit> = reactive({
  sku_goods_id:'',
  name_cn:'',
  // purchase_ref_price:'',
  // weight:'',
  // length:'',
  // width:'',
  // height:'',
  estimatedProportion:'',
  salesVolume:'',
  orderQuantity:'',
  businessVolume:'',
  adRate:'',
});

export const editColumns = [
  {
    label:'sku编号',
    key:'sku_goods_id',
    type:'input',
    disabled:true,
    require:true
  },
  {
    label:'sku商品名称',
    key:'name_cn',
    type:'input',
    disabled:true,
    require:true
  },
  // {
  //   label:'参考价',
  //   key:'purchase_ref_price',
  //   type:'input',
  //   disabled:true,
  //   require:true,
  //   prefix:true
  // },
  // {
  //   label:'重量(g)',
  //   key:'weight',
  //   type:'input',
  //   disabled:true,
  //   require:true
  // },
  // {
  //   label:'长(cm)',
  //   key:'length',
  //   type:'input',
  //   disabled:true,
  //   require:true
  // },
  // {
  //   label:'宽(cm)',
  //   key:'width',
  //   type:'input',
  //   disabled:true,
  //   require:true
  // },
  // {
  //   label:'高(cm)',
  //   key:'height',
  //   type:'input',
  //   disabled:true,
  //   require:true
  // },
  {
    label:'预估比例',
    key:'estimatedProportion',
    type:'inputNumber',
    disabled:false,
    require:true
  },
  {
    label:'销量',
    key:'salesVolume',
    type:'inputNumber',
    disabled:false,
    require:true
  },
  {
    label:'订单量',
    key:'orderQuantity',
    type:'inputNumber',
    disabled:false,
    require:true
  },
  {
    label:'营业额',
    key:'businessVolume',
    type:'inputNumber',
    disabled:false,
    require:true,
    prefix:true
  },
  {
    label:'广告费',
    key:'adRate',
    type:'inputNumber',
    disabled:false,
    require:true,
    prefix:true
  }
]

export const columns = [
  {
    title: 'sku编号',
    dataIndex: 'sku_goods_id',
    slots: { customRender: 'sku_goods_id' },
    width:'150px',
    fixed:'left'
  },
  {
    title: 'sku商品名称',
    dataIndex: 'name_cn',
    slots: { customRender: 'name_cn' },
    width:'150px',
    fixed:'left'
  },
  {
    title: '参考价',
    dataIndex: 'purchase_ref_price',
    slots: { customRender: 'purchase_ref_price' }
  },
  {
    title: '重量(g)',
    dataIndex: 'weight',
    slots: { customRender: 'weight' }
  },
  {
    title: '尺寸(cm)',
    dataIndex: 'size',
    slots: { customRender: 'size' }
  },
  {
    title: '销量',
    dataIndex: 'salesVolume',
    slots: { customRender: 'salesVolume' }
  },
  {
    title: '订单量',
    dataIndex: 'orderQuantity',
    slots: { customRender: 'orderQuantity' }
  },
  {
    title: '营业额',
    dataIndex: 'businessVolume',
    slots: { customRender: 'businessVolume' }
  },
  {
    title: '广告费',
    dataIndex: 'adRate',
    slots: { customRender: 'adRate' }
  },
  {
    title: '预估比例',
    dataIndex: 'estimatedProportion',
    slots: { customRender: 'estimatedProportion' }
  },
  {
    title: '运费',
    dataIndex: 'freight',
    slots: { customRender: 'freight' }
  },
  {
    title: '采购成本',
    dataIndex: 'procurementCost',
    slots: { customRender: 'procurementCost' }
  },
  {
    title: '手续费',
    dataIndex: 'serviceCharge',
    slots: { customRender: 'serviceCharge' }
  },
  {
    title: '客单价',
    dataIndex: 'perCustomerTransaction'
  },
  {
    title: '毛利占比',
    dataIndex: 'grossProfitRatio'
  },
  {
    title: 'roi',
    dataIndex: 'roi'
  },
  {
    title: '预估毛利',
    dataIndex: 'estimatedProfit',
    slots: { customRender: 'estimatedProfit' },
    fixed:'right'
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: { title: '操作', customRender: 'action' },
    fixed:'right'
  }
]

export const total_columns = [
  {
    title:'总数量',
    key:'total'
  },
  {
    title:'总销量',
    key:'salesVolumeTotal'
  },
  {
    title:'总订单量',
    key:'orderQuantityTotal'
  },
  {
    title:'总营业额',
    key:'businessVolumeTotal'
  },
  {
    title:'总广告费',
    key:'adRateTotal'
  },
  {
    title:'总运费',
    key:'freightTotal'
  },
  {
    title:'总采购成本',
    key:'procurementCostTotal'
  },
  {
    title:'总手续费',
    key:'serviceChargeTotal'
  },
  {
    title:'总预估毛利',
    key:'estimatedProfitTotal'
  }
]

export const rules = {
  estimatedProportion: [{ required: true, message: '请输入预估比例', trigger: 'blur' }],
  salesVolume: [{ required: true, message: '请输入销量', trigger: 'blur' }],
  orderQuantity: [{ required: true, message: '请输入订单量', trigger: 'blur' }],
  businessVolume: [{ required: true, message: '请输入营业额', trigger: 'blur' }],
  adRate: [{ required: true, message: '请输入广告费', trigger: 'blur' }],
};

export const editRules = {
  operatingCost: [{ required: true, message: '请输入操作费A(CNY)' }],
  gramPrice: [{ required: true, message: '请输入克重单价C(CNY)' }],
  // gram: [{ required: true, message: '请输入SKU克重D' }],
  // unitPrice: [{ required: true, message: '请输入SKU单价G' }],
  exchangeRate: [{ required: true, message: '请输入汇率E' }],
};