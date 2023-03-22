//由于有可能需要添加字段，所以将每日毛利详情内所有数据在这个函数内做处理，统一处理方式
export function calculateGrossProfit(total, list) {
  const obj = { ...total, ...list };
  return {
    ...list,
    freight: freightCalculate(obj),
    procurementCost: procurementCostCalculate(obj),
    serviceCharge: serviceChargeCalculate(obj),
    perCustomerTransaction: perCustomerTransactionCalculate(obj),
    roi: roiCalculate(obj),
    paypalCost: paypalCostCalculate(obj),
    estimatedProfit: estimatedProfitCalculate(obj),
    grossProfitRatio: grossProfitRatioCalculate(obj),
    unitProfit: unitProfitCalculate(obj),
    balancePoint: balancePointCalculate(obj),
    effect: effectCalculate(obj),
  };
}

//过滤不进行修改的数据
function filtration(obj) {
  const array = [
    'id',
    'calculate_date',
    'user_id',
    'sku_goods_id',
    'name_cn',
    'purchase_ref_price',
    'weight',
    'length',
    'wide',
    'height',
    'salesVolume',
    'orderQuantity',
    'businessVolume',
    'adRate',
    'estimatedProportion',
  ];
  const data = {};
  array.forEach((key) => {
    data[key] = obj[key];
  });
  return data;
}

//计算运费 = 操作费A * 订单量B + 克重单价C * 销量 * sku克重
function freightCalculate(obj) {
  const { operatingCost, orderQuantity, gramPrice, salesVolume, weight } = obj;
  return (
    Number(operatingCost) * Number(orderQuantity) +
    Number(gramPrice) * Number(salesVolume) * Number(weight)
  ).toFixed(2);
}

//计算采购成本=SKU销量F * 采购参考价
function procurementCostCalculate(obj) {
  const { purchase_ref_price, salesVolume } = obj;
  return (Number(purchase_ref_price) * Number(salesVolume)).toFixed(2);
}

//计算手续费=营业额H * 预估比例 I
function serviceChargeCalculate(obj) {
  const { businessVolume, estimatedProportion, exchangeRate } = obj;
  return (
    ((Number(businessVolume) * Number(estimatedProportion)) / 100) *
    Number(exchangeRate)
  ).toFixed(2);
}

//计算客单价=营业额/单量 (USD)
function perCustomerTransactionCalculate(obj) {
  const { businessVolume, orderQuantity } = obj;
  return (Number(businessVolume) / (Number(orderQuantity) ? Number(orderQuantity) : 1)).toFixed(2);
}

//计算ROI=营业额/广告花费
function roiCalculate(obj) {
  const { businessVolume, adRate } = obj;
  return Number(adRate) ? (Number(businessVolume) / Number(adRate)).toFixed(2) : '0';
}

//计算paypal提现费= $0.3 * 订单量 (USD)
function paypalCostCalculate(obj) {
  const { paypalWithdrawDeposit, orderQuantity } = obj;
  return (Number(paypalWithdrawDeposit) * Number(orderQuantity)).toFixed(2);
}

//计算毛利=营业额-运费-采购成本-手续费 - 广告费用-paypal提现费
function estimatedProfitCalculate(obj) {
  const { businessVolume, adRate, exchangeRate } = obj;
  return (
    Number(businessVolume) * Number(exchangeRate) -
    Number(freightCalculate(obj)) -
    Number(procurementCostCalculate(obj)) -
    Number(serviceChargeCalculate(obj)) -
    Number(adRate) * Number(exchangeRate) -
    Number(paypalCostCalculate(obj)) * Number(exchangeRate)
  ).toFixed(2);
}

//计算毛利率=毛利/营业额
function grossProfitRatioCalculate(obj) {
  const { businessVolume, exchangeRate } = obj;
  return (
    (
      (Number(estimatedProfitCalculate(obj)) /
        (Number(businessVolume) ? Number(businessVolume) : 1) /
        Number(exchangeRate)) *
      100
    ).toFixed(2) + '%'
  );
}

/**
 * 每单利润
 * 订单量>0 时
 * 每单利润 = 预估毛利/订单量
 * 订单量=0 时
 * 每单利润 = 预估毛利
 * @param obj
 * @returns
 */
function unitProfitCalculate(obj) {
  const { orderQuantity } = obj;
  if (orderQuantity == 0) {
    return estimatedProfitCalculate(obj);
  } else {
    return (
      Number(estimatedProfitCalculate(obj)) / (Number(orderQuantity) ? Number(orderQuantity) : 1)
    ).toFixed(2);
  }
}

//盈亏点=(营业额-运费-采购成本-手续费-paypal提现费)/订单量
function balancePointCalculate(obj) {
  const { businessVolume, orderQuantity, exchangeRate } = obj;
  return (
    (Number(businessVolume) * Number(exchangeRate) -
      Number(freightCalculate(obj)) -
      Number(procurementCostCalculate(obj)) -
      Number(serviceChargeCalculate(obj)) -
      Number(paypalCostCalculate(obj)) * Number(exchangeRate)) /
    (Number(orderQuantity) ? Number(orderQuantity) : 1)
  ).toFixed(2);
}

//单成效=广告花费/订单量(USD)
function effectCalculate(obj) {
  const { orderQuantity, adRate } = obj;
  return (Number(adRate) / (Number(orderQuantity) ? Number(orderQuantity) : 1)).toFixed(2);
}
