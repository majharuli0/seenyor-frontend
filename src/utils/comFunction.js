import dayjs from 'dayjs';
/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params) {
  let result = '';
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    var part = encodeURIComponent(propName) + '=';
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== '' && typeof value[key] !== 'undefined') {
            let params = propName + '[' + key + ']';
            var subPart = encodeURIComponent(params) + '=';
            result += subPart + encodeURIComponent(value[key]) + '&';
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&';
      }
    }
  }
  return result;
}

/**
 * @description判断对象为空
 *
 * @param {Function} obj  是否为空的对象
 * @return  Boolen 判断结果
 */
export function isEmptyObject(obj) {
  return Object.keys(obj).length == 0;
}

export function calculateDuration(data) {
  console.log(data);
  let nbspcolor = '#f2f2ff'; //"transparent"
  //let nbspcolor="red"
  // 按照 reportStartTime 对数据进行排序
  data.sort((a, b) => a.reportStartTime.localeCompare(b.reportStartTime));

  // 计算每个时间段的长度，以及每两个时间段之间的间隙
  let proportions = [];
  let prevEndTime = `${dayjs().format('YYYY-MM-DD')} 00:00:00`; // 初始时间设为当天的 0 点
  console.log('prevEndTime', prevEndTime);
  data.forEach((item, ri) => {
    const { reportStartTime, reportEndTime, color, reportType, reportName } = item;

    // 计算间隙的长度
    console.log();
    const gapStart = dayjs(prevEndTime);
    const gapEnd = dayjs(reportStartTime);
    const gapDuration = gapEnd.diff(gapStart, 'minute');
    if (gapDuration > 0) {
      if (ri > 34) console.log((gapDuration / (24 * 60)) * 100);
      proportions.push({
        value: (gapDuration / (24 * 60)) * 100, // 转换为百分比
        type: -1,
        itemStyle: {
          color: nbspcolor,
        },
        name: 'vacancy',
      });
    }

    // 计算时间段的长度
    const start = dayjs(reportStartTime);
    const end = dayjs(reportEndTime);
    const duration = end.diff(start, 'minute');
    proportions.push({
      value: (duration / (24 * 60)) * 100, // 转换为百分比
      color,
      type: reportType,
      itemStyle: {
        color,
      },
      name: reportName,
    });

    prevEndTime = reportEndTime;
  });

  // 计算最后一个时间段到 24 点的间隙
  const lastGapStart = dayjs(prevEndTime);

  const lastGapEnd = dayjs(`${dayjs().add(1, 'day').format('YYYY-MM-DD')} 00:00:00`); // 下一天的 0 点
  const lastGapDuration = lastGapEnd.diff(lastGapStart, 'minute');
  console.log('lastGapStart,lastGapDuration', lastGapStart, lastGapDuration);
  let realTotal = proportions.reduce((acc, cv) => acc + cv.value, 0);
  realTotal = realTotal > 100 ? 100 : realTotal;
  console.log(realTotal);
  console.log(100 - realTotal);
  if (lastGapDuration > 0) {
    proportions.push({
      value: 100 - realTotal, // 转换为百分比
      itemStyle: {
        color: nbspcolor,
      },
      type: -1,
      name: 'vacancy',
    });
  }

  return proportions;
}

export function targetFormat(e) {
  let targetValue = '';
  if (e.targetMax && e.targetMin) {
    targetValue = `${e.targetMin}-${e.targetMax}`;
  } else if (e.targetMax) {
    targetValue = `${e.targetMax}`;
  } else if (e.targetMin) {
    targetValue = `${e.targetMin}`;
  }
  return targetValue;
}

export function setStatusFormate(status) {
  let valueStatu = -1;
  if (status == 1) {
    valueStatu = 6;
  }
  if (status == 2) {
    valueStatu = 7;
  }
  if (status == 3) {
    valueStatu = 8;
  }
  return valueStatu;
}

export const calculateProportions = (data) => {
  // 使用 dayjs 将时间字符串转换为 Date 对象
  data.forEach((item) => {
    item.reportStartTime = dayjs(item.reportStartTime).valueOf();
    item.reportEndTime = dayjs(item.reportEndTime).valueOf();
  });

  // 计算每个元素的持续时间（毫秒）
  data.forEach((item) => {
    item.duration = item.reportEndTime - item.reportStartTime;
  });

  // 计算总持续时间
  let totalDuration = data.reduce((total, item) => total + item.duration, 0);

  // 计算每个元素的比例
  data.forEach((item) => {
    item.proportion = item.duration / totalDuration;
  });

  return data;
};
