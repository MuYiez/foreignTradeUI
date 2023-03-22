import { ColumnProps } from 'ant-design-vue/es/table/interface';
export const columns: ColumnProps[] = [
  {
    title: '图片',
    key: 'img',
    dataIndex: 'img',
    slots: {
      customRender: 'img',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
    },
  },
  // {
  //   title: '变种属性',
  //   dataIndex: 'varietas_name',
  // },
  {
    title: '商品SKU',
    dataIndex: 'sku_goods_id',
  },
  {
    title: '*中文名称',
    key: 'name_cn',
    dataIndex: 'name_cn',
    slots: {
      customRender: 'name_cn',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
    },
  },
  {
    title: '英文名称',
    key: 'name_en',
    dataIndex: 'name_en',
    slots: {
      customRender: 'name_en',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
    },
  },
  {
    title: '来源URL',
    key: 'source_url',
    dataIndex: 'source_url',
    slots: {
      customRender: 'source_url',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
    },
  },
  {
    title: '识别码',
    key: 'Identification_code',
    dataIndex: 'Identification_code',
    slots: {
      customRender: 'Identification_code',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: { title: '操作', customRender: 'action' },
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
    title: '*采购参考价(CNY)',
    key: 'purchase_ref_price',
    dataIndex: 'purchase_ref_price',
    slots: {
      customRender: 'purchase_ref_price',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
    },
  },
  {
    title: '*商品净重 (g)',
    key: 'weight',
    dataIndex: 'weight',
    slots: {
      customRender: 'weight',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
    },
  },
  {
    title: '商品尺寸 (cm)',
    key: 'size',
    dataIndex: 'size',
    slots: {
      customRender: 'size',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
    },
    width: '350px',
  },
  {
    title: '允许称重误差(g)',
    key: 'weighting_error',
    dataIndex: 'weighting_error',
    slots: {
      customRender: 'weighting_error',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
    },
  },
];
