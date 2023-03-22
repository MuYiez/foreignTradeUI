<template>
  <div>
    <!-- 基础信息 Start -->
    <div class="form-wrap">
      <div class="title">基础信息</div>
      <a-form-item label="产品分类" name="goods_classify">
        <a-tree-select
          v-model:value="formState.goods_classify"
          style="width: 100%"
          show-search
          allow-clear
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="classifyData"
          placeholder="选择分类"
          tree-default-expand-all
          disabled
        />
      </a-form-item>
      <a-form-item label="商品spu">
        <span>{{ formState.spu }}</span>
      </a-form-item>
      <a-form-item label="商品sku" v-if="formState.spu">
        <span>{{ formState.sku_goods_id }}</span>
      </a-form-item>
      <a-form-item label="销售方式" name="sales_method">
        <a-checkbox-group name="sales_method" v-model:value="formState.sales_method">
          <a-checkbox value="goods">商品</a-checkbox>
          <a-checkbox value="gifts">赠品</a-checkbox>
          <a-checkbox value="package">包材</a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item label="商品状态" name="status">
        <a-radio-group name="status" v-model:value="formState.status">
          <a-radio value="A01">在售</a-radio>
          <a-radio value="A02">热销</a-radio>
          <a-radio value="A03">新品</a-radio>
          <a-radio value="A04">清仓</a-radio>
          <a-radio value="A05">停售</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="中文名称" name="name_cn">
        <a-input
          v-model:value="formState.name_cn"
          :suffix="formState.name_cn ? formState.name_cn.length : 0 + '/1024'"
          :maxlength="1024"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="英文名称" name="name_en">
        <a-input
          v-model:value="formState.name_en"
          :suffix="formState.name_en ? formState.name_en.length : 0 + '/1024'"
          :maxlength="1024"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="平台SKU" name="platform_sku">
        <a-textarea
          v-model:value="formState.platform_sku"
          placeholder="可填写平台销售SKU、FNSKU等，用于建立平台SKU与商品SKU的关系"
          :rows="4"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="识别码" name="Identification_code">
        <a-input
          v-model:value="formState.Identification_code"
          placeholder="仅支持字母、数字和-_ ,识别码是自定义码，包括图书印刷行业的ISBN，移动电子通信产品的IME和S/N序列号"
          allow-clear
        />
      </a-form-item>
    </div>
    <!-- 基础信息 End -->

    <!-- 重量信息 Start -->
    <div class="form-wrap">
      <div class="title">重量信息</div>
      <div>
        <a-form-item label="采购参考价" name="purchase_ref_price">
          <a-input
            type="number"
            v-model:value="formState.purchase_ref_price"
            allow-clear
            placeholder="是指商品管理维护的基础参考价格。 采购下单单价和仓库清单初始化时单价都引用的采购参考价。"
            suffix="CNY"
            @blur="changeDeclare"
          />
        </a-form-item>
        <a-form-item label="商品净重" name="weight">
          <a-input
            type="number"
            v-model:value="formState.weight"
            suffix="g"
            allow-clear
            @blur="changeDeclare"
          />
        </a-form-item>

        <a-form-item label="允许称重误差" name="weighting_error">
          <a-input type="number" v-model:value="formState.weighting_error" suffix="g" allow-clear />
        </a-form-item>
        <a-form-item label="商品尺寸">
          <div>
            <a-input
              style="margin-right: 10px; width: 25%"
              type="number"
              v-model:value="formState.length"
              placeholder="长"
            />
            <a-input
              style="margin-right: 10px; width: 25%"
              type="number"
              v-model:value="formState.wide"
              placeholder="宽"
            />
            <a-input
              style="margin-right: 10px; width: 25%"
              type="number"
              v-model:value="formState.height"
              placeholder="高"
            />
            (cm)
          </div>
        </a-form-item>
      </div>
    </div>
    <!-- 重量信息 End -->

    <!-- 来源URL Start -->
    <div class="form-wrap">
      <div class="title">来源URL（链接中不能包含?号）</div>
      <a-form-item
        v-for="(item, index) in sourceUrlList"
        :key="index"
        :label="'来源URL' + (index + 1)"
        name="source_url"
      >
        <a-input-search
          v-model:value="sourceUrlList[index].url"
          placeholder="https://"
          @search="visitUrl(index)"
          style="width: 80%"
          allow-clear
        >
          <template #enterButton>
            <a-button>访问</a-button>
          </template>
        </a-input-search>
        <PlusCircleTwoTone
          v-if="index === 0"
          style="font-size: 20px; line-height: 24px; margin-left: 10px"
          @click="addSourceUrl"
        />
        <MinusCircleTwoTone
          v-else
          style="font-size: 20px; line-height: 24px; margin-left: 10px"
          @click="deleteSourceUrl(index)"
        />
      </a-form-item>
    </div>
    <!-- 来源URL End -->

    <!-- 图片信息 Start -->
    <div class="form-wrap">
      <div class="title">图片信息</div>
      <a-form-item :label="'选择图片（' + fileList.length + '/20）'">
        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1">
                <a-upload
                  name="file"
                  v-model:file-list="fileList"
                  :showUploadList="false"
                  accept=".jpg,.png"
                  :beforeUpload="beforeUpload"
                  :handleChange="handleChange"
                >
                  本地图片
                </a-upload>
              </a-menu-item>
              <a-menu-item key="2" @click="openNetworkModal"> 网络图片 </a-menu-item>
            </a-menu>
          </template>
          <a-button type="primary" v-if="fileList.length < 20">
            选择图片
            <DownOutlined />
          </a-button>
        </a-dropdown>
      </a-form-item>
      <div class="clearfix">
        <a-upload
          list-type="picture-card"
          v-model:file-list="fileList"
          :remove="handleRemove"
          @preview="handlePreview"
        />
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </div>
    </div>
    <!-- 图片信息 End -->

    <!-- 人员信息 Start -->
    <div class="form-wrap">
      <div class="title">人员信息</div>
      <a-form-item label="开发员" name="developer">
        <a-select v-model:value="formState.developer" placeholder="请选择开发员">
          <a-select-option v-for="item in allUserData" :key="item.id" :value="item.id">
            {{ item.nickname }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="采购员" name="purchaser">
        <a-select v-model:value="formState.purchaser" placeholder="请选择采购员">
          <a-select-option v-for="item in allUserData" :key="item.id" :value="item.id">
            {{ item.nickname }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </div>
    <!-- 人员信息 End -->

    <!-- 选择仓库 Start -->
    <div class="form-wrap">
      <div class="title">商品保存成功，并放入以下仓库清单</div>
      <div>
        <a-form-item label="仓库" name="warehouse_location">
          <a-checkbox-group name="warehouse_location" v-model:value="formState.warehouse_location">
            <a-checkbox value="W01">默认仓库</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </div>
    </div>
    <!-- 选择仓库 End -->

    <a-modal
      :visible="networkVisible"
      title="从网络地址(URL)选择图片"
      @cancel="handleNetworkCancel"
      @ok="handleNetworkOk"
      bodyStyle="padding:20px"
    >
      <a-textarea
        v-model:value="networkUrl"
        placeholder="请填写图片URL地址，多个地址用回车换行"
        :rows="10"
      />
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, watch } from 'vue';
  import { classifyInfoSearch } from '/@/api/skuGoods/classifyInfo';
  import { allUser } from '/@/api/sys/user';
  import { PlusCircleTwoTone, MinusCircleTwoTone, DownOutlined } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addPictrue, delPictrue, addNetPictrue } from '/@/api/skuGoods/goodsInfo';
  import { search } from '/@/api/grossProfitTable/parameter';
  const { createMessage } = useMessage();
  export default defineComponent({
    props: {
      formState: {
        type: Object,
        default: () => {},
      },
      picture_list: {
        type: Array,
        default: () => [],
      },
      source_url_list: {
        type: Array,
        default: () => [],
      },
    },
    components: {
      PlusCircleTwoTone,
      MinusCircleTwoTone,
      DownOutlined,
    },
    setup(props) {
      const classifyData = ref([]);
      const allUserData = ref(<any>[]);
      const previewVisible = ref<boolean>(false);
      const networkVisible = ref<boolean>(false);
      const previewImage = ref<string | undefined>('');
      const networkUrl = ref('');
      const sourceUrlList = ref([{ url: '' }]);
      const fileList = ref(<any>[]);
      const picture_url = ref(<any>[]);
      let exchangeRate = 1;
      watch(
        () => [props.picture_list, props.source_url_list],
        (newValue, oldValue) => {
          newValue[0].forEach((res: any) => {
            picture_url.value.push(res.id);
            let file = {
              uid: res.id,
              name: res.name,
              status: 'done',
              url: res.url,
            };
            fileList.value.push(file);
          });
          sourceUrlList.value = newValue[1].map((res: any) => {
            return {
              url: res,
            };
          });
        },
      );
      onMounted(() => {
        classifyInfoSearch({}).then((res) => {
          classifyData.value = res;
        });
        allUser({}).then((res) => {
          allUserData.value = res;
        });
        search({}).then((res) => {
          exchangeRate = Number(res.exchangeRate);
        });
      });

      const createSku = (e) => {
        props.formState.sku_goods_id = props.formState.spu + '-' + props.formState.sku_rule;
      };

      //使用外链访问页面
      const visitUrl = (index) => {
        const url = sourceUrlList.value[index].url;
        if (!url) return;
        window.open(url);
      };

      const addSourceUrl = () => {
        sourceUrlList.value.push({ url: '' });
      };

      const deleteSourceUrl = (index) => {
        sourceUrlList.value.splice(index, 1);
      };

      const openNetworkModal = () => {
        networkVisible.value = true;
      };

      const getBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };

      const handleCancel = () => {
        previewVisible.value = false;
      };
      const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
          file.preview = (await getBase64(file.originFileObj)) as string;
        }
        previewImage.value = file.url || file.preview;
        previewVisible.value = true;
      };

      const handleNetworkCancel = () => {
        networkVisible.value = false;
      };

      // 上传文件改变时的状态
      const handleChange = (info: any) => {
        fileList.value = info.fileList;
      };

      const beforeUpload = (file: any) => {
        const allowFormat = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!allowFormat) {
          createMessage.error('只允许 JPG/PNG 文件!');
        }
        const fileSize = file.size / 1024 / 1024 < 2;
        if (!fileSize) {
          createMessage.error('图片大小不能超过2M');
        }
        if (!fileSize || !allowFormat) {
          return allowFormat && fileSize;
        }
        let formData = new FormData();
        formData.append('file', file);
        formData.append('sku_goods_id', props.formState.sku_goods_id);
        addPictrue(formData).then((res: any) => {
          picture_url.value.push(res.id);
        });
        return false;
      };

      const handleRemove = (e) => {
        const index = fileList.value.findIndex((res) => res.uid === e.uid);
        return new Promise((resolve, reject) => {
          delPictrue({ id: picture_url.value[index] })
            .then(() => {
              picture_url.value.splice(index, 1);
              resolve(true);
            })
            .catch(() => {
              reject();
            });
        });
      };

      const changeDeclare = () => {
        if (props.formState.purchase_ref_price) {
          props.formState.declare_price = (
            Number(props.formState.purchase_ref_price) / exchangeRate
          ).toFixed(2);
        }
        props.formState.declare_weight = props.formState.weight;
      };

      const handleNetworkOk = () => {
        if (!networkUrl.value) {
          createMessage.error('请输入至少一个图片地址');
          return;
        }
        const urlList = networkUrl.value.split(/\n/);
        addNetPictrue({ sku_goods_id: props.formState.sku_goods_id, list: urlList }).then((res) => {
          urlList.forEach((res, index) => {
            let url = {
              uid: Date.now() + 'order' + index,
              name: Date.now() + 'order' + index + '.png',
              status: 'done',
              url: res,
            };
            fileList.value.push(url);
          });
          picture_url.value = picture_url.value.concat(res.list);
        });
        networkVisible.value = false;
      };

      return {
        classifyData,
        visitUrl,
        allUserData,
        previewVisible,
        networkVisible,
        previewImage,
        fileList,
        sourceUrlList,
        picture_url,
        networkUrl,
        addSourceUrl,
        deleteSourceUrl,
        openNetworkModal,
        handleCancel,
        handlePreview,
        handleNetworkCancel,
        handleChange,
        beforeUpload,
        handleRemove,
        handleNetworkOk,
        createSku,
        changeDeclare,
      };
    },
  });
</script>

<style lang="less" scoped>
  .form-wrap {
    background-color: #fff;
    padding: 10px;
    margin-bottom: 20px;
    .title {
      font-size: 16px;
      margin-bottom: 20px;
      font-weight: 900;
      padding-bottom: 10px;
      border-bottom: 1px solid #e5e7eb;
    }

    :deep(.ant-form-item) {
      margin-bottom: 20px;
    }
  }
  .clearfix {
    padding: 0 80px;
  }
</style>
