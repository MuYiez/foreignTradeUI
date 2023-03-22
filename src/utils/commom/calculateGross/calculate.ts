//计算币种汇率转换
export function transformCurrency(type: boolean, number: number | string, rate: number | string) {
  if (number) {
    rate = parseFloat(rate);
    number = parseFloat(number);
    if (type) {
      number = (number * rate).toFixed(2);
    } else {
      number = (number / rate).toFixed(2);
    }
    return Number(number);
  }
  return number;
}

/**
 * 计算预估毛利
 * 毛利=营业额-运费-采购成本-手续费 - 广告费用-paypal提现费
 * 运费 = (操作费A * 订单量B + 克重单价C * 销量 * sku克重 )/ 汇率E
 * 采购成本=SKU销量F * 采购参考价 / 汇率E
 * 手续费=营业额H * 预估比例 I
 * 客单价=营业额/单量
 * ROI=营业额/广告花费
 * paypal提现费= $0.3 * 订单量
 * 广告费用直接填写。
 * @param type 币种:CNY-true;USD-false
 * @param params 参数表信息
 * @param info sku商品信息
 */
export function calculateGrossMargin(type: boolean, params: any, info: any) {
  //将数据全部转为数字
  for (const key in info) {
    if (key !== 'sku' && key !== 'name_cn') {
      info[key] = parseFloat(info[key]);
    }
  }
  for (const key in params) {
    //若计算人民币，不需要进行汇率转化；若计算美元，则需要进行汇率转化
    params[key] = parseFloat(params[key]);
  }
  //计算运费
  const freight =
    params.operatingCost * info.orderQuantity + params.gramPrice * info.salesVolume * info.weight;
  //计算采购成本
  const procurementCost = info.salesVolume * info.purchase_ref_price;
  //计算手续费
  const serviceCharge = (info.businessVolume * info.estimatedProportion) / 100;
  //计算paypal提现费
  // const paypalCost = info.orderQuantity * params.paypalWithdrawDeposit;
  //计算预估毛利
  const estimatedProfit =
    info.businessVolume - freight - procurementCost - serviceCharge - info.adRate - info.paypalCost;
  //计算客单价
  const perCustomerTransaction =
    info.businessVolume / (info.orderQuantity === 0 ? 1 : info.orderQuantity);
  //计算毛利率
  const grossProfitRatio = estimatedProfit / (info.businessVolume === 0 ? 1 : info.businessVolume);
  //计算roi
  const roi = info.adRate ? info.businessVolume / info.adRate : 0;
  return {
    freight: freight.toFixed(2),
    procurementCost: procurementCost.toFixed(2),
    serviceCharge: serviceCharge.toFixed(2),
    estimatedProfit: estimatedProfit.toFixed(2),
    perCustomerTransaction: perCustomerTransaction.toFixed(2),
    grossProfitRatio: (grossProfitRatio * 100).toFixed(2) + '%',
    roi: roi.toFixed(2),
    paypalCost: info.paypalCost,
  };
}

//换算成人民币和美元
export function calculateCurrency(list, exchangeRate) {
  exchangeRate = Number(exchangeRate);
  const cnyList = <any>[];
  const usdList = <any>[];
  /**
   * 将数据区分成人民币列表跟美元列表
   * 原数据：
   * 美元：客单价-perCustomerTransaction；paypal提现费-paypalCost；营业额-businessVolume；广告费-adRate
   * 人民币：运费-freight；采购成本-procurementCost；手续费-serviceCharge；毛利-estimatedProfit；参考价-purchase_ref_price；每单利润-unitProfit；克重单价-gramPrice
   */
  const usdKey = ['perCustomerTransaction', 'paypalCost', 'businessVolume', 'adRate', 'effect'];
  const cnyKey = [
    'estimatedProfit',
    'freight',
    'procurementCost',
    'purchase_ref_price',
    'serviceCharge',
    'unitProfit',
    'balancePoint',
    'gramPrice',
  ];
  list.forEach((element) => {
    //将美元转化为人民币
    const cnyObj = {};
    usdKey.forEach((key) => {
      cnyObj[key] = (Number(element[key]) * exchangeRate).toFixed(2);
    });
    cnyList.push({
      ...element,
      ...cnyObj,
    });
    //将人民币转化为美元
    const usdObj = {};
    cnyKey.forEach((key) => {
      usdObj[key] = (Number(element[key]) / exchangeRate).toFixed(2);
    });
    usdList.push({
      ...element,
      ...usdObj,
    });
  });
  return {
    cnyList,
    usdList,
  };
}

//计算数组总额
const sum = (arr, key, type = false) => {
  let num = 0;
  arr.forEach((res) => {
    num = num + Number(res[key] ?? 0);
  });
  if (type) {
    return num;
  }
  return num.toFixed(2);
};

//计算总额
export function calculateTotal(cnyDataSource, usdDataSource) {
  const cnyData = {
    total: cnyDataSource.length,
    salesVolumeTotal: sum(cnyDataSource, 'salesVolume', true),
    orderQuantityTotal: sum(cnyDataSource, 'orderQuantity', true),
    adRateTotal: sum(cnyDataSource, 'adRate'),
    businessVolumeTotal: sum(cnyDataSource, 'businessVolume'),
    paypalCostTotal: sum(cnyDataSource, 'paypalCost'),
    freightTotal: sum(cnyDataSource, 'freight'),
    procurementCostTotal: sum(cnyDataSource, 'procurementCost'),
    serviceChargeTotal: sum(cnyDataSource, 'serviceCharge'),
    estimatedProfitTotal: sum(cnyDataSource, 'estimatedProfit'),
    grossProfitRatioTotal:
      (
        (Number(sum(cnyDataSource, 'estimatedProfit')) /
          (Number(sum(cnyDataSource, 'businessVolume'))
            ? Number(sum(cnyDataSource, 'businessVolume'))
            : 1)) *
        100
      ).toFixed(2) + '%',
  };
  const usdData = {
    total: usdDataSource.length,
    salesVolumeTotal: sum(usdDataSource, 'salesVolume', true),
    orderQuantityTotal: sum(usdDataSource, 'orderQuantity', true),
    adRateTotal: sum(usdDataSource, 'adRate'),
    businessVolumeTotal: sum(usdDataSource, 'businessVolume'),
    paypalCostTotal: sum(usdDataSource, 'paypalCost'),
    freightTotal: sum(usdDataSource, 'freight'),
    procurementCostTotal: sum(usdDataSource, 'procurementCost'),
    serviceChargeTotal: sum(usdDataSource, 'serviceCharge'),
    estimatedProfitTotal: sum(usdDataSource, 'estimatedProfit'),
    grossProfitRatioTotal:
      (
        (Number(sum(usdDataSource, 'estimatedProfit')) /
          (Number(sum(usdDataSource, 'businessVolume'))
            ? Number(sum(usdDataSource, 'businessVolume'))
            : 1)) *
        100
      ).toFixed(2) + '%',
  };
  return {
    cnyData,
    usdData,
  };
}
