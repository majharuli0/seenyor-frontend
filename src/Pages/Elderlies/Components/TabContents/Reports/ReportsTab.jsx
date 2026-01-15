import React, { useState, useRef, useContext } from 'react';
import { Button, DatePicker, Collapse, ConfigProvider, Cascader, Dropdown } from 'antd';
import { FaFileExport } from 'react-icons/fa';
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { SHOW_CHILD } = Cascader;
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'svg-crowbar';
import DurationStatistic from '../Sleep/Components/DurationStatistic';
import DurationDistribution from '../Sleep/Components/DurationDistribution';
import EfficiencyStatistic from '../Sleep/Components/EfficiencyStatistic';
import DeepSleepPercentageDistribution from '../Sleep/Components/DeepSleepPercentageDistribution';
import DeepSleepPercentageStatistic from '../Sleep/Components/DeepSleepPercentageStatistic';
import EfficiencyDistribution from '../Sleep/Components/EfficiencyDistribution';
import ApneaIndexStatistic from '../Sleep/Components/ApneaIndexStatistic';
import NumberOfBedExitStatistic from '../Sleep/Components/NumberOfBedExitStatistic';
import DistributionOfBedExitTimes from '../Sleep/Components/DistributionOfBedExitTimes';
import TimeToFallAsleepStatistic from '../Sleep/Components/TimeToFallAsleepStatistic';
import DistributionOfTimeToFallAsleep from '../Sleep/Components/DistributionOfTimeToFallAsleep';
import DistributionOfDailyRoutine from '../Sleep/Components/DistributionOfDailyRoutine';
import RespiratoryRate from '../Health/Components/RespiratoryRate';
import HeartRate from '../Health/Components/HeartRate';
import HeartRateAnnomalyStatistic from '../Health/Components/HeartRateAnnomalyStatistic';
import HeartRateDistribution from '../Health/Components/HeartRateDistribution';
import BreathRateDistribution from '../Health/Components/BreathRateDistribution';
import dayjs from 'dayjs';
import { CustomContext } from '@/Context/UseCustomContext';
export default function ReportsTab() {
  const [datePicker, setDatePicker] = useState([]);
  dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  const [toDate, setToDate] = useState();
  const [fromDate, setFromDate] = useState(dayjs().subtract(31, 'day').format('YYYY-MM-DD'));
  const [selectedValues, setSelectedValues] = useState([]);
  const [activeKeys, setActiveKeys] = useState(['0']); // Sleep expanded by default
  const collapseRef = useRef(null);
  const context = useContext(CustomContext);
  const [loading, setLoading] = useState(false);
  const handleDatePicker = (value) => {
    setDatePicker(value);
    setFromDate(value[0]);
    setToDate(value[1]);
  };
  const exportAsImage = async () => {
    if (collapseRef.current) {
      setLoading(true); // Set loading state to true
      try {
        const canvas = await html2canvas(collapseRef.current);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'reports.png';
        link.click();
      } catch (error) {
        console.error('Error exporting as image:', error);
      } finally {
        setLoading(false); // Set loading state to false
      }
    }
  };
  const exportAsSVG = async () => {
    if (collapseRef.current) {
      setLoading(true);
      try {
        const canvas = await html2canvas(collapseRef.current, {
          scale: 2,
          useCORS: true,
        });

        const imgData = canvas.toDataURL('image/png');
        const svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
            <image href="${imgData}" width="${canvas.width}" height="${canvas.height}" />
          </svg>
        `;

        const svgBlob = new Blob([svgContent], {
          type: 'image/svg+xml;charset=utf-8',
        });
        const svgUrl = URL.createObjectURL(svgBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = 'reports.svg';
        downloadLink.click();
        URL.revokeObjectURL(svgUrl);
      } catch (error) {
        console.error('Error exporting as SVG:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const exportAsPDF = async () => {
    try {
      setLoading(true);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const columns = 2;
      let x = margin,
        y = margin;
      let rowHeight = 0,
        chartsInRow = 0;

      const charts = Array.from(document.querySelectorAll('.chart'));

      for (let i = 0; i < charts.length; i++) {
        const chartElem = charts[i];
        const isFullWidth = chartElem.classList.contains('full-width-chart');
        const canvas = await html2canvas(chartElem, { scale: 2 });
        const nativeWidth = canvas.width;
        const nativeHeight = canvas.height;
        const imgData = canvas.toDataURL('image/png');

        let chartWidth, chartHeight, colSpan;
        if (isFullWidth) {
          chartWidth = pageWidth - margin * 2;
          chartHeight = (nativeHeight / nativeWidth) * chartWidth;
          colSpan = 2;
        } else {
          chartWidth = (pageWidth - margin * (columns + 1)) / columns;
          chartHeight = (nativeHeight / nativeWidth) * chartWidth;
          colSpan = 1;
        }

        if (y + chartHeight + margin > pageHeight) {
          pdf.addPage();
          x = margin;
          y = margin;
          chartsInRow = 0;
          rowHeight = 0;
        }

        pdf.addImage(imgData, 'JPEG', x, y, chartWidth, chartHeight, undefined, 'MEDIUM', 0);

        if (isFullWidth) {
          y += chartHeight + margin;
          x = margin;
          chartsInRow = 0;
          rowHeight = 0;
        } else {
          if (chartsInRow === 0) {
            rowHeight = chartHeight;
          }
          chartsInRow++;
          x += chartWidth + margin;

          if (chartsInRow === columns) {
            y += rowHeight + margin;
            x = margin;
            chartsInRow = 0;
            rowHeight = 0;
          }
        }
      }
      pdf.save('export.pdf');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const options = [
    {
      value: 'sleep',
      label: 'Sleep',
      children: [
        {
          label: 'Daily Sleep Duration',
          value: 'sleepDurationStatistic',
        },
        {
          label: 'Sleep Duration Distribution',
          value: 'sleepDurationDistribution',
        },
        {
          label: 'Daily Sleep Quality',
          value: 'efficiencyStatistic',
        },
        {
          label: 'Deep Sleep Distribution',
          value: 'deepSleepPercentageDistribution',
        },
        {
          label: 'Daily Deep Sleep %',
          value: 'deepSleepPercentageStatistic',
        },
        {
          label: 'Sleep Quality Distribution',
          value: 'efficiencyDistribution',
        },
        {
          label: 'Daily Sleep Disturbances',
          value: 'apneaIndexStatistic',
        },
        {
          label: 'Number of Bed Exits',
          value: 'numberOfBedExitStatistic',
        },
        {
          label: 'Bed Exit Time Trends',
          value: 'distributionOfBedExitTimes',
        },
        {
          label: 'Distribution of Time to Fall Asleep',
          value: 'distributionOfTimeToFallAsleep',
        },
        {
          label: 'Time to Fall Asleep',
          value: 'timeToFallAsleepStatistic',
        },
        {
          label: 'Distribution of Daily Routine',
          value: 'distributionOfDailyRoutine',
        },
      ],
    },
    {
      value: 'health',
      label: 'Health',
      children: [
        {
          label: 'Daily Breathing Rate',
          value: 'respiratoryRate',
        },
        {
          label: 'Daily Heart Rate',
          value: 'heartRate',
        },
        {
          label: 'Heart Rate Distribution',
          value: 'heartRateDistribution',
        },
        {
          label: 'Breath Rate Distribution',
          value: 'breathRateDistribution',
        },
      ],
    },
  ];

  // Map graph IDs to their panel keys
  const graphToPanelMap = {
    // Sleep graphs -> panel "0"
    sleepDurationStatistic: '0',
    sleepDurationDistribution: '0',
    efficiencyStatistic: '0',
    deepSleepPercentageDistribution: '0',
    deepSleepPercentageStatistic: '0',
    efficiencyDistribution: '0',
    apneaIndexStatistic: '0',
    numberOfBedExitStatistic: '0',
    distributionOfBedExitTimes: '0',
    timeToFallAsleepStatistic: '0',
    distributionOfTimeToFallAsleep: '0',
    distributionOfDailyRoutine: '0',
    // Health graphs -> panel "1"
    respiratoryRate: '1',
    heartRate: '1',
    heartRateDistribution: '1',
    breathRateDistribution: '1',
  };

  const handleCascaderChange = (value) => {
    const flattenedValues = value.map((path) => path[path.length - 1]);
    setSelectedValues(flattenedValues);

    // Auto-expand panels for selected graphs
    const panelsToExpand = new Set(activeKeys);
    flattenedValues.forEach((graphId) => {
      const panelKey = graphToPanelMap[graphId];
      if (panelKey) {
        panelsToExpand.add(panelKey);
      }
    });
    setActiveKeys(Array.from(panelsToExpand));
  };

  const isSelected = (value) => {
    // Show all charts if no specific selections are made
    if (selectedValues.length === 0) return true;
    const result = selectedValues.includes(value);
    console.log(`Checking if ${value} is selected:`, result); // Debugging line
    return result;
  };

  return (
    <>
      <div id='reports' className='flex flex-col gap-4 mt-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-[24px] font-bold'>Reports</h1>
          <div className='flex gap-4 items-center'>
            <ConfigProvider
              theme={{
                token: {
                  fontFamily: 'Baloo2',
                  colorPrimary: '#8086AC',
                  colorLinkActive: '#8086AC',
                  colorLinkHover: '#8086AC',
                  colorLink: '#8086AC',
                },
              }}
            >
              <RangePicker
                showTime={false}
                style={{ width: '200px', borderRadius: '10px' }}
                size='large'
                placeholder={['Pick Data Range (Start)', 'End']}
                format='YYYY-MM-DD'
                onChange={(value, dateString) => {
                  handleDatePicker(dateString);
                }}
              />
              <Cascader
                style={{
                  width: '300px',
                }}
                options={options}
                placeholder='Select Specific Analysis'
                multiple
                maxTagCount='responsive'
                size='large'
                showCheckedStrategy={SHOW_CHILD}
                onChange={handleCascaderChange}
                defaultValue={selectedValues}
              />
            </ConfigProvider>
            <Dropdown.Button
              size='large'
              style={{
                backgroundColor: '#fff',
                width: 'fit-content',
                borderRadius: '10px',
              }}
              loading={loading}
              menu={{
                items: [
                  { label: 'Export as PNG', key: '1' },
                  { label: 'Export as SVG', key: '2' },
                ],
                onClick: (e) => {
                  if (e.key === '1') {
                    exportAsImage(); // Export as PNG
                  } else if (e.key === '2') {
                    exportAsSVG(); // Export as SVG
                  }
                },
                icon: <FaFileExport />,
              }}
              onClick={exportAsPDF}
            >
              <FaFileExport />
              Export Report as PDF
            </Dropdown.Button>
            {/* <Button
              size="large"
              style={{ backgroundColor: "#fff", color: "#252F67" }}
              icon={<FaFileExport />}
              onClick={exportAsImage}
            >
              Export as PDF
            </Button> */}
          </div>
        </div>

        <CustomContext.Provider
          value={{ ...context, chartFromDate: fromDate, chartToDate: toDate }}
        >
          <div id='reports' ref={collapseRef}>
            <Collapse activeKey={activeKeys} onChange={setActiveKeys} expandIconPosition='left'>
              {groupGraphAndChart.map((group, index) => (
                <Panel
                  key={index}
                  style={{ backgroundColor: 'transparent' }}
                  header={
                    <div
                      className='flex items-center justify-between'
                      style={{ border: 'none', padding: 0 }}
                    >
                      <span>{group.groupName || 'Unnamed Group'}</span>
                      <div className='flex-grow mx-2' style={{ borderBottom: 'none' }}></div>
                    </div>
                  }
                >
                  <div className='gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2'>
                    {group.components.map(
                      ({ id, component, fullWidth }, idx) =>
                        isSelected(id) && (
                          <div
                            key={idx}
                            className={
                              fullWidth ? 'col-span-2 chart full-width-chart' : '' + ` chart`
                            }
                          >
                            {component}
                          </div>
                        )
                    )}
                  </div>
                </Panel>
              ))}
            </Collapse>
          </div>
        </CustomContext.Provider>
      </div>
    </>
  );
}

const groupGraphAndChart = [
  {
    groupName: 'Sleep',
    components: [
      {
        id: 'sleepDurationStatistic',
        component: <DurationStatistic isSummaryBtn={false} />,
        fullWidth: false,
      },
      {
        id: 'sleepDurationDistribution',
        component: <DurationDistribution isSummaryBtn={false} />,
        fullWidth: false,
      },
      {
        id: 'efficiencyStatistic',
        component: <EfficiencyStatistic isSummaryBtn={false} />,
        fullWidth: false,
      },
      {
        id: 'deepSleepPercentageDistribution',
        component: <DeepSleepPercentageDistribution isSummaryBtn={false} />,
        fullWidth: false,
      },
      {
        id: 'deepSleepPercentageStatistic',
        component: <DeepSleepPercentageStatistic isSummaryBtn={false} />,
        fullWidth: false,
      },
      {
        id: 'efficiencyDistribution',
        component: <EfficiencyDistribution isSummaryBtn={false} />,
        fullWidth: false,
      },
      {
        id: 'apneaIndexStatistic',
        component: <ApneaIndexStatistic isSummaryBtn={false} />,
        fullWidth: false,
      },
      {
        id: 'numberOfBedExitStatistic',
        component: <NumberOfBedExitStatistic isSummaryBtn={false} />,
        fullWidth: false,
      },
      {
        id: 'distributionOfBedExitTimes',
        component: <DistributionOfBedExitTimes isSummaryBtn={false} />,
        fullWidth: true, // This component should be full width
      },
      {
        id: 'timeToFallAsleepStatistic',
        component: <TimeToFallAsleepStatistic isSummaryBtn={false} />,
        fullWidth: false,
      },
      {
        id: 'distributionOfTimeToFallAsleep',
        component: <DistributionOfTimeToFallAsleep isSummaryBtn={false} />,
        fullWidth: false,
      },
      {
        id: 'distributionOfDailyRoutine',
        component: <DistributionOfDailyRoutine isSummaryBtn={false} />,
        fullWidth: true, // This component should be full width
      },
    ],
  },
  {
    groupName: 'Health',
    components: [
      {
        id: 'respiratoryRate',
        component: <RespiratoryRate isSummaryBtn={true} dataType='Month' />,
        fullWidth: true,
      },
      {
        id: 'heartRate',
        component: <HeartRate isSummaryBtn={true} dataType='Month' />,
        fullWidth: true,
      },
      // {
      //   id: "heartRateAnnomalyStatistic",
      //   component: <HeartRateAnnomalyStatistic isSummaryBtn={false} />,
      //   fullWidth: false,
      // },
      {
        id: 'heartRateDistribution',
        component: <HeartRateDistribution isSummaryBtn={false} />,
        fullWidth: false,
      },
      {
        id: 'breathRateDistribution',
        component: <BreathRateDistribution isSummaryBtn={false} />,
        fullWidth: false,
      },
    ],
  },
];
