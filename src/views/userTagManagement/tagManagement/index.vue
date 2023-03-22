<template>
  <div class="gutter-example">
    <div class="form-wrap">
      <p class="title">标签查询</p>
      <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="8">
            <a-form-item label="标签">
              <a-input v-model:value="formState.tagName" allowClear placeholder="请输入标签" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="btn-wrap">
        <a-button type="primary" danger style="margin-right: 20px" @click="addNewGoods"
          >新增标签</a-button
        >
        <a-button type="primary" @click="getData">查询</a-button>
      </div>
    </div>

    <div class="detail-wrap">
      <p class="title">商品菜单列表</p>
      <a-table
        :dataSource="data.dataSource"
        bordered
        :columns="columns"
        row-key="menuId"
        :pagination="pagination"
        :loading="loading"
      >
        <template #action="{ record }">
          <a @click="editMenu(record)">修改</a>
          <a-popconfirm
            title="是否确认删除？"
            @confirm="deleteMenu(record)"
          >
            <a style="margin-left: 10px">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, onMounted } from 'vue';
  import { ref } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { data, columns, formState, FormState } from './data';
  import { tagList,delTag } from '/@/api/userTagManagement/userTagManagement';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useRouter } from "vue-router";
  const { createMessage } = useMessage();

  export default defineComponent({
    setup() {
      const loading = ref(false);
      const go = useGo();
      const formRef = ref();
      const router = useRouter();
      const pagination = reactive({
        pageNo: 1,
        pageSize: 10, // 默认每页显示数量
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
        showTotal: (total) => `共 ${total} 条`, // 显示总数
        onShowSizeChange: (current, pageSize) => onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page) => onPageChange(page), //点击页码事件
        total: 0, //总条数
      });

      onMounted(() => {
        getData();
      });

      const getData = () => {
        formRef.value
          .validate()
          .then(() => {
            let sendData = {
              ...formState,
              pageSize: pagination.pageSize,
              pageNum: pagination.pageNo,
            };
            tagList(sendData).then((res) => {
              data.dataSource = res.list;
              pagination.total = parseInt(res.total);
              pagination.showTotal = (total) => `共 ${total} 条`;
            });
          })
          .catch((error: ValidateErrorEntity<FormState>) => {
            console.log('error', error);
          });
      };

      const onSizeChange = (current, pageSize) => {
        pagination.pageNo = 1;
        pagination.pageSize = pageSize;
        getData();
      };
      const onPageChange = (page) => {
        pagination.pageNo = page;
        getData();
      };

      const deleteMenu = (record) => {
        delTag({ tagId: record.tagId }).then(() => {
          createMessage.success('删除成功！');
          getData();
        });
      };

      //新增商品
      const addNewGoods = () => {
        go('/userTagManagement/tagManagement/tagDetail');
      };

      const editMenu = (value:any) =>{
        router.push({
          path:'/userTagManagement/tagManagement/tagDetail',
          query:{
            ...value
          }
        })
      }

      return {
        formState,
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        data,
        formRef,
        columns,
        loading,
        pagination,
        addNewGoods,
        getData,
        deleteMenu,
        editMenu,
      };
    },
  });
</script>
<style lang="less">
  .gutter-example {
    background: transparent;
    border: 0;
    padding: 20px;
  }
  .form-wrap {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
  }
  .btn-wrap {
    text-align: center;
  }
  .title {
    font-size: 20px;
    font-weight: 900;
    padding-bottom: 10px;
    border-bottom: 1px solid #e5e7eb;
  }
  .detail-wrap {
    margin-top: 20px;
    padding: 20px;
    background-color: #fff;
  }
</style>
