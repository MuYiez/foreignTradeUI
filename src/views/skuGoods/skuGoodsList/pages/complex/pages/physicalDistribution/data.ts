import { ColumnProps } from 'ant-design-vue/es/table/interface';
export const columns: ColumnProps[] = [
  {
    title: '图片',
    slots: { title: '图片', customRender: 'img' },
  },
  {
    title: 'SKU',
    dataIndex: 'sku_goods_id',
  },
  {
    title: '报关中文名',
    key: 'declare_cn',
    dataIndex: 'declare_cn',
    slots: {
      customRender: 'declare_cn',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
    },
  },
  {
    title: '报关英文名',
    key: 'declare_en',
    dataIndex: 'declare_en',
    slots: {
      customRender: 'declare_en',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
    },
  },
  {
    title: '报关价格(USD)',
    key: 'declare_price',
    dataIndex: 'declare_price',
    slots: {
      customRender: 'declare_price',
    },
  },
  {
    title: '报关重量（g）',
    key: 'declare_weight',
    dataIndex: 'declare_weight',
    slots: {
      customRender: 'declare_weight',
    },
  },
  {
    title: '材质',
    key: 'material_quality',
    dataIndex: 'material_quality',
    slots: {
      customRender: 'material_quality',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
    },
  },
  {
    title: '用途',
    key: 'purpose',
    dataIndex: 'purpose',
    slots: {
      customRender: 'purpose',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
    },
  },
  {
    title: '海关编码',
    key: 'customs_id',
    dataIndex: 'customs_id',
    slots: {
      customRender: 'customs_id',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
    },
  },
  {
    title: '危险运输品',
    key: 'dangerous_goods',
    dataIndex: 'dangerous_goods',
    slots: {
      customRender: 'dangerous_goods',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
    },
    width: '150px',
  },
];

export const weightColumns: ColumnProps[] = [
  {
    title: '图片',
    slots: { title: '图片', customRender: 'img' },
  },
  {
    title: 'SKU',
    dataIndex: 'sku_goods_id',
  },
  {
    title: '采购参考价',
    slots: { title: '采购参考价', customRender: 'purchase_ref_price' },
  },
  {
    title: '商品净重 (g)',
    slots: { title: '商品净重 (g)', customRender: 'weight' },
  },
  {
    title: '商品尺寸 (cm)',
    slots: { title: '商品尺寸 (cm)', customRender: 'size' },
    width: '350px',
  },
  {
    title: '允许称重误差(g)',
    slots: { title: '允许称重误差(g)', customRender: 'weighting_error' },
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: { title: '操作', customRender: 'action' },
  },
];
