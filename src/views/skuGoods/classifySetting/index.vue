<template>
  <div class="gutter-example">
    <div class="form-wrap">
      <p class="title">分类商品</p>
      <a-tree
        v-if="gData.length"
        class="draggable-tree"
        :tree-data="gData"
        :defaultExpandAll="true"
      >
        <template #title="{ key: treeKey, title, level }">
          <a-dropdown :trigger="['contextmenu']">
            <span>{{ title }}</span>
            <template #overlay>
              <a-menu
                @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey, level, title)"
              >
                <a-menu-item key="1" v-if="level !== 3">添加</a-menu-item>
                <a-menu-item key="2" v-if="level !== 0">修改</a-menu-item>
                <a-menu-item key="3" v-if="level !== 0">删除</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-tree>
    </div>

    <!-- 编辑框 Start -->
    <a-modal
      width="60%"
      :destroyOnClose="true"
      bodyStyle="padding:20px"
      v-model:visible="visible"
      title="编辑"
      @ok="handleOk"
      @canplay="handleCancle"
    >
      <a-form
        ref="formRefEdit"
        :model="formStateEdit"
        :label-col="labelColEdit"
        :wrapper-col="wrapperColEdit"
        :rules="rules"
      >
        <a-form-item label="分类名称" name="classifyName">
          <a-input v-model:value="formStateEdit.classifyName" placeholder="请输入分类名称" />
        </a-form-item>
        <a-form-item label="分类英文缩写" name="classifyType">
          <a-input v-model:value="formStateEdit.classifyType" placeholder="请输入分类英文缩写" />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 编辑框 End -->
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, UnwrapRef, reactive } from 'vue';
  import { TreeDataItem } from 'ant-design-vue/es/tree/Tree';
  import {
    classifyInfoSearch,
    classifyInfoAdd,
    classifyInfoUpdate,
    classifyInfoDelete,
  } from '/@/api/skuGoods/classifyInfo';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  const genData: TreeDataItem[] = [];
  export default defineComponent({
    setup() {
      const gData = ref<TreeDataItem[]>(genData);
      const visible = ref<boolean>(false);
      const formRefEdit = ref();
      const formStateEdit: UnwrapRef<any> = reactive({
        classifyName: '',
      });
      const rules = {
        classifyName: [{ required: true, message: '请输入分类名称' }],
        classifyType: [{ required: true, message: '请输入分类英文缩写' }],
      };
      let data = <any>{};

      onMounted(() => {
        gData.value = [];
        getData();
      });

      const getData = () => {
        classifyInfoSearch({}).then((res) => {
          gData.value = res;
        });
      };

      const onContextMenuClick = (
        treeKey: string,
        menuKey: string,
        level: number,
        title: string,
      ) => {
        switch (menuKey) {
          case '1':
            //添加
            data = {
              level: level + 1,
              parentId: treeKey,
              case: '1',
            };
            showModal();

            break;
          case '2':
            //修改
            data = {
              id: treeKey,
              case: '2',
            };
            formStateEdit.classifyName = title.split(" - ")[0];
            formStateEdit.classifyType = title.split(" - ")[1];
            showModal();

            break;
          case '3':
            classifyInfoDelete({ id: treeKey }).then(() => {
              createMessage.success('删除成功');
              getData();
            });

            break;

          default:
            break;
        }
      };

      const handleOk = () => {
        formRefEdit.value
          .validate()
          .then(() => {
            switch (data.case) {
              case '1':
                //新增
                classifyInfoAdd({
                  classifyName: formStateEdit.classifyName,
                  classifyType: formStateEdit.classifyType,
                  level: data.level,
                  parentId: data.parentId,
                }).then(() => {
                  createMessage.success('添加成功');
                  getData();
                });
                break;
              case '2':
                //修改
                classifyInfoUpdate({
                  classifyName: formStateEdit.classifyName,
                  classifyType: formStateEdit.classifyType,
                  id: data.id,
                }).then(() => {
                  createMessage.success('修改成功');
                  getData();
                });
                break;

              default:
                break;
            }
            handleCancle()
          })
          .catch((error) => {
            console.log('error', error);
          });
      };

      const handleCancle = () => {
        formStateEdit.classifyName = '';
        formStateEdit.classifyType = '';
        visible.value = false;
      };

      const showModal = () => {
        visible.value = true;
      };

      return {
        visible,
        gData,
        formRefEdit,
        labelColEdit: { span: 6 },
        wrapperColEdit: { span: 12 },
        formStateEdit,
        rules,
        showModal,
        handleOk,
        handleCancle,
        onContextMenuClick,
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
  .title {
    font-size: 20px;
    font-weight: 900;
    padding-bottom: 10px;
    border-bottom: 1px solid #e5e7eb;
  }
</style>
