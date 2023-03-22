import { ColumnProps } from 'ant-design-vue/es/table/interface';
import { reactive, UnwrapRef } from 'vue';

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
    title: '图片',
    slots: { title: '图片', customRender: 'img' },
  },
  {
    title: '商品信息',
    slots: { title: '商品信息', customRender: 'goodsInfo' },
  },
  {
    title: '参考价(￥)',
    dataIndex: 'purchase_ref_price',
    key: 'purchase_ref_price',
  },
  {
    title: '重量（g）',
    dataIndex: 'weight',
    key: 'weight',
  },
  {
    title: '尺寸（cm）',
    slots: { title: '尺寸（cm）', customRender: 'size' },
  },
  {
    title: '状态',
    slots: { title: '状态', customRender: 'status' },
  },
  {
    title: '时间',
    slots: { title: '时间', customRender: 'time' },
    width: '170px',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: { title: '操作', customRender: 'action' },
    width: '100px',
  },
];
export const warehouseColumns: ColumnProps[] = [
  {
    title: '图片',
    slots: { title: '图片', customRender: 'img' },
    width:'100px'
  },
  {
    title: '商品信息',
    slots: { title: '商品信息', customRender: 'goodsInfo' },
  },
  {
    title: '重量（g）',
    slots: { title: '重量（g）', customRender: 'weight' },
    width:'200px'
  },
  {
    title: '尺寸（cm）',
    slots: { title: '尺寸（cm）', customRender: 'size' },
    width:'500px'
  },
];
