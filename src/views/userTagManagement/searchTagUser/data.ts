import { ColumnProps } from 'ant-design-vue/es/table/interface';
import { reactive, UnwrapRef } from 'vue';
export interface FormState {
  tagId: Array<any>;
}

export const formState: UnwrapRef<FormState> = reactive({
  tagId: []
});

export interface FiledData {
  dataSource: Array<DataSource>,
  options:Array<any>
}

export const data: UnwrapRef<FiledData> = reactive({
  dataSource:[],
  options:[]
});

//表格数据
export interface DataSource {
  tagId:string,
  tagName:string
}
export const columns:ColumnProps[]= [
  {
    title: '用户id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '标签',
    dataIndex: 'tagNames',
    key: 'tagNames',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots:{ title: '操作', customRender: 'action' }
  },
];