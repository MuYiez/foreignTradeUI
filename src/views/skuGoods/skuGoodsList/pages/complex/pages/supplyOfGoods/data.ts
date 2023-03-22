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
    title: '采购参考价',
    slots: { title: '采购参考价', customRender: 'purchase_ref_price' },
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: { title: '操作', customRender: 'action' },
  },
];