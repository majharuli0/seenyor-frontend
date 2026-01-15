import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/chart/bar';
import { isEmptyObject } from '@/utils/comFunction';
import debounce from '@/utils/debounce';

function MonthChart({ chardata, query, getCharList }) {
  // Demo data as a fallback
  const demoData = {
    data: ['Demo1', 'Demo2', 'Demo3'],
    series: [{ data: [10, 15, 20] }, { data: [5, 10, 15] }, { data: [20, 25, 30] }],
  };
  const [option, setOption] = useState({
    tooltip: {
      show: false,
      trigger: 'axis',
      axisPointer: {
        // Use axis to trigger tooltip
        type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
      },
    },
    legend: {
      show: true,
      top: '8%',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      interval: 0, // 刻度间隔为10
      axisLine: {
        show: true,
      },
    },
    yAxis: {
      type: 'category',
      data: [],
    },
    dataZoom: [
      {
        type: 'inside',
        yAxisIndex: 0, // 这将启用 y 轴的缩放
        start: 0,
        end: 50,
      },
    ],
    color: ['#34CECE', '#FA4B5E', '#FAB515'],
    series: [],
  });
  const [params, setParams] = useState({});
  const paramsRef = useRef(params); // 使用 useRef 来持有 params 的最新值
  const optionRef = useRef(option); // 使用 useRef 来持有 params 的最新值
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);
  useEffect(() => {
    optionRef.current = option;
  }, [option]);
  useEffect(() => {
    if (isEmptyObject(params)) {
      setParams({ ...query });
    } else {
      setParams({ ...query, current: 1 });
    }
    if (chardata) {
      setOption({
        ...option,
        yAxis: {
          type: 'category',
          data: chardata.data,
        },
        series: chardata.series,
      });
    }
  }, [chardata]);
  const setCharData = () => {};
  const handleZomm = async (e) => {
    const { batch } = e;
    let { start, end } = batch[0];

    debounce(() => {
      if (end > 80) {
        let params1 = { ...paramsRef.current, current: paramsRef.current.current + 1 };
        setParams(params1);
        // let data = await getCharList({ ...params1 })
      }
    });
  };

  useEffect(() => {
    if (params.current > 1) {
      getCharList(params).then((data) => {
        console.log(data);

        let ydata = option.yAxis.data.concat(data.data);
        let series0 = option.series[0].data.concat(data.series[0].data);
        let series1 = option.series[1].data.concat(data.series[1].data);
        let series2 = option.series[2].data.concat(data.series[2].data);
        setOption({
          ...option,
          yAxis: {
            type: 'category',
            data: ydata,
          },
          series: [],
        });
      });
    }
  }, [params]);
  const onEvents = useCallback(
    {
      dataZoom: handleZomm, // 监听图表缩放事件
    },
    []
  ); // Dependencies array here ensures onEvents is only recreated if handleZomm changes

  return <ReactEcharts onEvents={onEvents} notMerge={true} lazyUpdate={true} option={option} />;
}

export default MonthChart;
