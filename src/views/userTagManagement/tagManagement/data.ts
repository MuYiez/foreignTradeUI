import { ColumnProps } from 'ant-design-vue/es/table/interface';
import { reactive, UnwrapRef } from 'vue';
export interface FormState {
  tagName: string;
}

export const formState: UnwrapRef<FormState> = reactive({
  tagName: ''
});

export interface FiledData {
  dataSource: Array<DataSource>
}

export const data: UnwrapRef<FiledData> = reactive({
  dataSource:[]
});

//表格数据
export interface DataSource {
  tagId:string,
  tagName:string
}
export const columns:ColumnProps[]= [
  {
    title: '标签id',
    dataIndex: 'tagId',
    key: 'tagId',
  },
  {
    title: '标签名称',
    dataIndex: 'tagName',
    key: 'tagName',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots:{ title: '操作', customRender: 'action' }
  },
];