<template>
  <div class="order-detail-wrap">
    <a-row>
      <a-col :span="6" class="order-detail-list">卖家：{{ detailData.shop_name }}</a-col>
      <a-col :span="6" class="order-detail-list">
        买家：{{ detailData.shopline_customer_info.id }}
      </a-col>
      <a-col :span="6" class="order-detail-list">
        <p>买家姓名：{{ detailData.shopline_customer_info.name }}</p>
        <p>邮箱：{{ detailData.shopline_customer_info.email }}</p>
      </a-col>
      <a-col :span="6" class="order-detail-list">
        包裹总额：{{ detailData.currency }}{{ detailData.subtotal_price }}
      </a-col>
    </a-row>
    <div class="tab-wrap">
      <a-tabs type="card" v-model:activeKey="detailActiveKey" tab-position="left">
        <a-tab-pane key="1" tab="收货地址">
          <a-card size="small" title="收货地址">
            <a-descriptions>
              <a-descriptions-item label="收件人">
                {{ detailData.shipping_address.first_name }}
                {{ detailData.shipping_address.last_name }}
              </a-descriptions-item>
              <a-descriptions-item label="电话">
                {{ detailData.shipping_address.phone }}
              </a-descriptions-item>
              <a-descriptions-item label="国家/地区">
                {{ detailData.shipping_address.country }}（{{
                  countryCode.find(
                    (res) => res[0] === detailData.shipping_address.country_code,
                  )?.[1]
                }}）
              </a-descriptions-item>
              <a-descriptions-item label="省/州">
                {{ detailData.shipping_address.province }}
              </a-descriptions-item>
              <a-descriptions-item label="城市">
                {{ detailData.shipping_address.city }}
              </a-descriptions-item>
              <a-descriptions-item label="地址1">
                {{ detailData.shipping_address.address1 }}
              </a-descriptions-item>
              <a-descriptions-item label="地址2">
                {{ detailData.shipping_address.address2 }}
              </a-descriptions-item>
              <a-descriptions-item label="门牌号">
                {{ detailData.shipping_address.delivery_store_name }}
              </a-descriptions-item>
              <a-descriptions-item label="邮编">
                {{ detailData.shipping_address.zip }}
              </a-descriptions-item>
              <a-descriptions-item label="公司">
                {{ detailData.shipping_address.company }}
              </a-descriptions-item>
              <a-descriptions-item label="税号">
                {{ detailData.tax_type }}
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import countryCode from '/@/utils/commom/countryCode.json';
  export default defineComponent({
    props: {
      detailData: {
        type: Object,
        default: () => {},
      },
    },
    setup() {
      const detailActiveKey = ref('1');

      return {
        countryCode,
        detailActiveKey,
      };
    },
  });
</script>

<style lang="less" scoped>
  .order-detail-wrap {
    p {
      margin: 0;
    }
    .order-detail-list {
      border: 1px solid #ccc;
      padding: 10px;
      font-weight: 600;
      color: #434649;
    }
    .tab-wrap {
      padding-top: 10px;
    }
    :deep(.ant-tabs) {
      .ant-tabs-left-content {
        padding-left: 0;
      }
    }
  }
</style>
