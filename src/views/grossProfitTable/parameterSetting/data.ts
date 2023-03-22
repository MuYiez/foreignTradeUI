import { reactive, UnwrapRef } from 'vue';
import { Moment } from 'moment';
export interface FormState {
  operatingCost: number | string;
  estimatedProportion: number | string;
  exchangeRate: number | string;
  date: Moment | undefined;
  paypalWithdrawDeposit: number | string;
  D01: number | string;
  D02: number | string;
  D03: number | string;
  D04: number | string;
  D05: number | string;
  D06: number | string;
  D07: number | string;
  D08: number | string;
}

export const formState: UnwrapRef<FormState> = reactive({
  operatingCost: 0,
  estimatedProportion: 0,
  exchangeRate: 0,
  date: undefined,
  paypalWithdrawDeposit: 0,
  D01: 0.1,
  D02: 0.12,
  D03: 0.12,
  D04: 0.12,
  D05: 0.12,
  D06: 0.12,
  D07: 0.12,
  D08: 0.12,
});

export const rules = {
  operatingCost: [{ required: true, message: '请输入操作费A(CNY)' }],
  estimatedProportion: [{ required: true, message: '请输入克重单价C(CNY)' }],
  paypalWithdrawDeposit: [{ required: true, message: '请输入PayPal提现费(USD)' }],
  exchangeRate: [{ required: true, message: '请输入汇率E' }],
  D01: [{ required: true, message: '请输入克重单价' }],
  D02: [{ required: true, message: '请输入克重单价' }],
  D03: [{ required: true, message: '请输入克重单价' }],
  D04: [{ required: true, message: '请输入克重单价' }],
  D05: [{ required: true, message: '请输入克重单价' }],
  D06: [{ required: true, message: '请输入克重单价' }],
  D07: [{ required: true, message: '请输入克重单价' }],
  D08: [{ required: true, message: '请输入克重单价' }],
};
