import React, { useMemo, useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import ls from 'store2';
import { formatTimeToHoursAndMinutes } from '@/utils/helper';
import { Empty } from 'antd';
import dayjs from 'dayjs';

export default function BarChart({
  data,
  dataType,
  color,
  chartType = 'Day',
  toDate,
  fromDate,
  xUnit = 'date',
  hourLimit = 12,
  numberLimit = 100,
  dataUnit = '',
  chartFor = '',
}) {
  const options = useMemo(() => {
    if (!data?.length) {
      return null;
    }

    const getAllDatesInRange = (start, end) => {
      const dates = [];
      const current = new Date(start);
      const endDate = new Date(end);

      while (current <= endDate) {
        dates.push(new Date(current).toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
      return dates;
    };

    function generateSleepDistribution(data) {
      const bucketSize = 60; // Bucket size in minutes (e.g., every 60 minutes)
      const minBucket = 60; // Minimum bucket range (1 hour)
      const maxBucket = 720; // Maximum bucket range (12 hours)

      // Generate x-axis labels for time ranges (e.g., "1 hr", "1 hr 10 min")
      const xaxis = Array.from({ length: (maxBucket - minBucket) / bucketSize + 1 }, (_, i) => {
        const totalMinutes = minBucket + i * bucketSize;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return minutes === 0 ? `${hours} hr` : `${hours} hr ${minutes} min`;
      });

      // Initialize bucket counts (all set to 0 initially)
      const bucketCounts = new Array(xaxis.length).fill(0);

      // Count the number of items in each bucket
      data?.forEach((item) => {
        const bucketIndex = Math.floor((item.sleep_total_time - minBucket) / bucketSize);
        if (bucketIndex >= 0 && bucketIndex < bucketCounts.length) {
          bucketCounts[bucketIndex]++;
        }
      });

      // Calculate the percentage distribution of items in each bucket
      const totalCounts = bucketCounts.reduce((sum, count) => sum + count, 0);
      const distribution = bucketCounts.map((count) =>
        totalCounts > 0 ? ((count / totalCounts) * 100).toFixed(0) : '0'
      );

      // Return x-axis labels and distribution
      return { xaxis, data: distribution };
    }

    function generateSleepEfficiencyDistribution(data) {
      const bucketSize = 10; // Grouping size for sleep efficiency ranges
      const minBucket = 0; // Minimum sleep efficiency percentage
      const maxBucket = 100; // Maximum sleep efficiency percentage

      // Generate x-axis labels (e.g., "10-20", "20-30")
      const xaxis = Array.from(
        { length: (maxBucket - minBucket) / bucketSize },
        (_, i) => `${minBucket + i * bucketSize}-${minBucket + (i + 1) * bucketSize}`
      );

      // Initialize bucket counts for each range
      const bucketCounts = new Array(xaxis.length).fill(0);

      // Count the number of days falling into each bucket
      data?.forEach((item) => {
        const bucketIndex = Math.floor(
          chartFor !== 'deepSleepPercentageDistribution'
            ? item?.sleep_efficiency / bucketSize
            : item?.sleep_quality / bucketSize
        );
        if (bucketIndex >= 0 && bucketIndex < bucketCounts.length) {
          bucketCounts[bucketIndex]++;
        }
      });

      // Calculate the total number of days
      const totalDays = data.length;

      // Calculate the distribution percentages for the y-axis
      const distribution = bucketCounts.map((count) =>
        totalDays > 0 ? ((count / totalDays) * 100).toFixed(0) : '0'
      );
      ls.set(chartFor, { xaxis, data: distribution });
      // Return the distribution data with x-axis labels and percentages
      return { xaxis, data: distribution };
    }

    function generateApneaIndexDistribution(data) {
      const bucketSize = 5; // Grouping by 5 units for the Apnea Index
      const minBucket = 0; // Start at 0
      const maxBucket = 30; // End at 30 (Apnea Index range)

      // Generate x-axis labels for ranges (e.g., "0-5", "5-10", "10-15", ..., "25-30")
      const xaxis = Array.from(
        { length: maxBucket / bucketSize },
        (_, i) => `${i * bucketSize}-${(i + 1) * bucketSize}`
      );

      // Initialize bucket counts for each Apnea Index range
      const bucketCounts = new Array(xaxis.length).fill(0);

      // Count the number of days falling into each Apnea Index bucket
      data?.forEach((item) => {
        const ahiValue = parseFloat(item.ahi);
        const bucketIndex = Math.floor(ahiValue / bucketSize); // Group by bucket size of 5
        if (bucketIndex >= 0 && bucketIndex < bucketCounts.length) {
          bucketCounts[bucketIndex]++;
        }
      });

      // Calculate the total number of days
      const totalDays = data.length;

      // Calculate the distribution percentages for the y-axis
      const distribution = bucketCounts.map((count) =>
        totalDays > 0 ? ((count / totalDays) * 100).toFixed(0) : '0'
      );

      // Return the distribution data with x-axis labels and percentages
      return { xaxis, data: distribution };
    }
    function generateFallAsleepDurationDistribution(data) {
      const bucketSize = 10; // Grouping by 10 minutes
      const maxBucket = 120; // Upper bound for normal buckets
      // Generate x-axis labels for ranges (e.g., "0-10", ..., "110-120", "120+")
      const xaxis = [
        ...Array.from(
          { length: maxBucket / bucketSize },
          (_, i) => `${i * bucketSize}-${(i + 1) * bucketSize} min`
        ),
        `${maxBucket}min+`, // Add an extra "120+" bucket
      ];

      // Initialize bucket counts for each Fall Asleep Duration range (extra slot for 120+)
      const bucketCounts = new Array(xaxis.length).fill(0);

      // Count the number of days falling into each Fall Asleep Duration bucket
      data?.forEach((item) => {
        const duration = item.totalFallAsleepDuration;
        let bucketIndex = Math.floor(duration / bucketSize);
        // Anything beyond 120 goes to last bucket
        if (duration >= maxBucket) {
          bucketIndex = bucketCounts.length - 1; // Last index (120+)
        }
        if (bucketIndex >= 0 && bucketIndex < bucketCounts.length) {
          bucketCounts[bucketIndex]++;
        }
      });

      // Calculate the total number of days
      const totalDays = data.length;

      // Calculate the distribution percentages for the y-axis
      const distribution = bucketCounts.map((count) =>
        totalDays > 0 ? ((count / totalDays) * 100).toFixed(0) : '0'
      );

      // Return the distribution data with x-axis labels and percentages
      return { xaxis, data: distribution };
    }

    // function generateBreathRateDistribution(data) {
    //   const minBreathRate = 6; // Minimum breath rate
    //   const maxBreathRate = 36; // Maximum breath rate

    //   // Initialize counts for each breath rate
    //   const breathRateCounts = new Array(
    //     maxBreathRate - minBreathRate + 1
    //   ).fill(0);

    //   // Count occurrences of each avg breath rate
    //   data?.forEach((item) => {
    //     const avgRate = Math.round(item.avg); // Round avg rate to nearest integer
    //     if (avgRate >= minBreathRate && avgRate <= maxBreathRate) {
    //       const index = avgRate - minBreathRate;
    //       breathRateCounts[index]++;
    //     }
    //   });

    //   // Calculate total entries
    //   const totalEntries = data.length;

    //   // Calculate the percentage for each breath rate
    //   const distribution = breathRateCounts.map((count) =>
    //     totalEntries > 0 ? ((count / totalEntries) * 100).toFixed(0) : "0"
    //   );

    //   // Create x-axis labels (6 to 36)
    //   const xaxis = Array.from(
    //     { length: maxBreathRate - minBreathRate + 1 },
    //     (_, i) => (minBreathRate + i).toString()
    //   );

    //   return { xaxis, data: distribution };
    // }
    function calculateBreathRateDistribution(data) {
      // Breath rate range [6 to 36]
      const breathRateRange = Array.from({ length: 31 }, (_, i) => i + 6); // [6, 7, ..., 36]

      const result = {
        xaxis: breathRateRange.map((rate) => rate.toString()), // X-axis values for 6-36
        data: Array(31).fill(0), // Initialize with zeros for each breath rate in the range (6-36)
      };

      let totalCounts = Array(31).fill(0); // Sum of counts for each rate (6-36) across all days

      // Iterate over each day's data
      data.forEach((day) => {
        // Filter out invalid breath rates (-1 and 0), and convert the valid data to numbers
        const validData = day.data_list
          .filter((value) => value !== '-1' && value !== '0')
          .map(Number);

        // Create an array to hold counts for each rate (6-36) for this day
        let dayCounts = Array(31).fill(0);

        validData.forEach((rate) => {
          if (rate >= 6 && rate <= 36) {
            const index = rate - 6; // Map rate to index (6 -> index 0, 7 -> index 1, ..., 36 -> index 30)
            dayCounts[index]++;
          }
        });

        // Sum up the counts for the current day for each rate
        dayCounts.forEach((count, index) => {
          totalCounts[index] += count;
        });
      });

      // Identify the valid range (first and last non-zero index)
      const validIndices = totalCounts
        .map((count, index) => (count > 0 ? index : null))
        .filter((index) => index !== null);

      if (validIndices.length === 0) {
        return result; // If no valid data, return result with all zeros
      }

      const validStart = Math.max(validIndices[0] - 1, 0);
      const validEnd = Math.min(validIndices[validIndices.length - 1] + 1, 30);

      // Calculate the total count within the valid range
      const validTotal = totalCounts
        .slice(validStart, validEnd + 1)
        .reduce((sum, count) => sum + count, 0);

      // Calculate distributed percentages within the valid range
      result.data = totalCounts.map((count, index) => {
        if (index >= validStart && index <= validEnd && validTotal > 0) {
          return ((count / validTotal) * 100).toFixed(2);
        }
        return '0.00';
      });

      // Return the result in the required format
      return result;
    }

    const heartRateRanges = [
      '45-50',
      '50-55',
      '55-60',
      '60-65',
      '65-70',
      '70-75',
      '75-80',
      '80-85',
      '85-90',
      '90-95',
      '95-100',
      '100-105',
      '105-110',
      '110-115',
      '115-120',
    ];
    const calculateHeartRateDistribution = (data) => {
      // Initialize a count array for each range
      const rangeCounts = new Array(heartRateRanges.length).fill(0);
      // Loop through each day's data
      data?.forEach((day) => {
        day.data_list.forEach((value) => {
          if (value > 0) {
            // Consider only valid values (excluding 0 or negative values)
            // Find which range this value falls into and increment the corresponding count
            for (let i = 0; i < heartRateRanges.length; i++) {
              const [min, max] = heartRateRanges[i].split('-').map(Number);
              if (value >= min && value < max) {
                rangeCounts[i] += 1;
                break; // Once the correct range is found, break out of the loop
              }
            }
          }
        });
      });

      // Calculate total valid values across all days
      const totalValidValues = data?.reduce(
        (sum, day) => sum + day.data_list.filter((value) => value > 0).length,
        0
      );

      // Calculate the percentage for each range
      const distribution = rangeCounts.map((count) =>
        ((count / totalValidValues) * 100).toFixed(0)
      );

      return {
        xaxis: heartRateRanges,
        data: distribution,
      };
    };
    const getChartData = () => {
      if (xUnit === 'number') {
        if (chartFor === 'apneaIndexDistribution') {
          const { xaxis, data: distribution } = generateApneaIndexDistribution(data);

          return xaxis.map((label, index) => ({
            number: label,
            value: distribution[index],
          }));
        } else if (chartFor === 'heartRateDistribution') {
          const { xaxis, data: distribution } = calculateHeartRateDistribution(data);

          // Combine xaxis and distribution into chart data
          return xaxis.map((label, index) => ({
            number: label,
            value: distribution[index],
          }));
        } else if (chartFor === 'breathRateDistribution') {
          const { xaxis, data: distribution } = calculateBreathRateDistribution(data);

          // Combine xaxis and distribution into chart data
          return xaxis.map((label, index) => ({
            number: label,
            value: distribution[index],
          }));
        }
      }
      if (xUnit === 'hour') {
        // Ensure data is valid
        if (data && data.length > 0 && chartFor === 'durationDistribution') {
          const { xaxis, data: distribution } = generateSleepDistribution(data);

          // Combine xaxis and distribution into chart data
          return xaxis.map((label, index) => ({
            hour: label,
            percentage: parseInt(label, 10), // Use calculated percentage
            value: distribution[index], // Convert xaxis label back to a numeric value for display
          }));
        } else if (data && data.length > 0 && chartFor === 'fallAsleepDurationDistribution') {
          const { xaxis, data: distribution } = generateFallAsleepDurationDistribution(data);

          // Combine xaxis and distribution into chart data
          return xaxis.map((label, index) => ({
            hour: label,
            percentage: parseInt(label, 10), // Use calculated percentage
            value: distribution[index], // Convert xaxis label back to a numeric value for display
          }));
        } else {
          // Generate empty dataset if no data is present
          return Array.from({ length: hourLimit }, (_, i) => ({
            hour: i,
            value: 0,
            percentage: 0,
          }));
        }
      } else if (xUnit === 'percentage') {
        if (
          chartFor === 'efficiencyDistribution' ||
          chartFor === 'deepSleepPercentageDistribution'
        ) {
          const { xaxis, data: distribution } = generateSleepEfficiencyDistribution(data);

          // Combine xaxis and distribution into chart data
          return xaxis.map((label, index) => ({
            percentage: label,
            value: distribution[index], // Convert xaxis label back to a numeric value for display
          }));
        } else {
          // Generate array of percentages from 0 to 100 (by 10s)
          const percentages = Array.from({ length: 11 }, (_, i) => i * 10);
          // Create a map of existing data
          const dataMap = new Map(
            data.map((item) => [
              Math.floor(item.sleep_efficiency / 10) * 10, // Round to nearest 10
              {
                value: item.sleep_efficiency,
                date: item.date,
              },
            ])
          );

          // Create complete dataset with 0 for missing percentages
          return percentages.map((percentage) => ({
            percentage,
            value: dataMap.get(percentage)?.value || 0,
            date: dataMap.get(percentage)?.date || null,
          }));
        }
      } else {
        const getChartValue = (item, chartFor) => {
          switch (chartFor) {
            case 'roomInOut':
              return item?.user_activity?.entry_room_count || '--';
            case 'walkingStepsStatistix':
              return item?.user_activity?.step_number || '--';
            case 'walkingSpeedStatistic':
              return item?.user_activity?.speed || '--';
            case 'sleedDurationStatistic':
              return item.sleep_total_time || 0;
            case 'deepSleepPercentageStatistic':
              return item.sleep_quality || '--';
            case 'numberOfBedExitTime':
              return item.leave_bed_count || '--';
            case 'bedExitDuration':
              // Extract bed exit duration from sleep_index_common_list where status is 3
              const bedExitItem = item.sleep_index_common_list?.find(
                (entry) => entry.status === '3' || entry.status === 3
              );
              return bedExitItem?.value ? parseInt(bedExitItem.value) : 0;
            default:
              return (
                item.ratio ||
                item.bed_exit_duration ||
                item.value ||
                item.sleep_time ||
                item.ahi ||
                item.anomalyHeartRate ||
                item.sleep_efficiency ||
                item.totalFallAsleepDuration ||
                '--'
              );
          }
        };

        const normalizeDate = (item, chartFor) => {
          if (item?.date) {
            return item.date.split('T')[0];
          }
          if (item?.datestr) {
            if (
              chartFor === 'roomInOut' ||
              chartFor === 'walkingStepsStatistix' ||
              chartFor === 'walkingSpeedStatistic'
            ) {
              // Assuming dayjs is available in the environment
              return dayjs(item.datestr).subtract(1, 'day').format('YYYY-MM-DD');
            }
            return item.datestr;
          }
          return null; // Or handle error appropriately
        };

        // Refactored code block
        // This assumes fromDate, toDate, data, and chartFor are defined in the scope
        const getAllDatesInRange = (start, end) => {
          const dates = [];
          const current = new Date(start);
          current.setUTCHours(0, 0, 0, 0); // Set to midnight UTC
          const endDate = new Date(end);
          endDate.setUTCHours(0, 0, 0, 0); // Set to midnight UTC

          while (current <= endDate) {
            dates.push(current.toISOString().split('T')[0]);
            current.setUTCDate(current.getUTCDate() + 1);
          }
          return dates;
        };

        const allDates = getAllDatesInRange(fromDate, toDate);

        // New aggregation logic for dataMap
        const dataMap = new Map();
        data?.forEach((item) => {
          const normalizedDate = normalizeDate(item, chartFor);
          const value = getChartValue(item, chartFor);

          // Only update the map if the value is not 0 (or '--' if it was still the default)
          // This prioritizes valid data over null/default values for the same date
          if (normalizedDate && value !== 0 && value !== '--') {
            dataMap.set(normalizedDate, value);
          } else if (normalizedDate && !dataMap.has(normalizedDate)) {
            // If no valid data has been set for this date yet, set the default (0)
            dataMap.set(normalizedDate, 0);
          }
        });

        // Remove or comment out debug console.log in production code
        // if (chartFor == "sleedDurationStatistic") {
        //   console.log(data);
        // }

        return allDates.map((date) => ({
          date,
          value: dataMap.get(date) || 0,
        }));
      }
    };

    const chartData = getChartData();

    const formatValue = (value, type = 'axis') => {
      if (xUnit === 'percentage' || dataType === 'percentage') {
        return `${value}%`;
      }
      if (dataType === 'duration') {
        const hours = Math.floor(value / 60);
        const minutes = value % 60;
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      }

      return value;
    };

    const formatXAxis = (value) => {
      if (xUnit === 'number') {
        return value?.toString();
      }
      if (xUnit === 'hour') {
        return `${value}`;
      }
      if (xUnit === 'percentage') {
        return `${value}%`;
      }
      if (chartType === 'Week') {
        const weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dateObj = new Date(value);
        return weekNames[dateObj.getDay()];
      }
      const dateObj = new Date(value);
      return dateObj
        .toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
        })
        .replace('/', '-');
    };

    return {
      xAxis: {
        type: 'category',
        axisLabel: {
          fontSize: 14,
        },
        data: chartData.map((item) =>
          xUnit === 'hour'
            ? formatXAxis(item.hour)
            : xUnit === 'percentage'
              ? formatXAxis(item.percentage)
              : xUnit === 'number'
                ? formatXAxis(item.number)
                : formatXAxis(item.date)
        ),
      },

      grid: {
        top: '5%',
        left: '8%',
        bottom: '15%',
        right: '2%',
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 14,
          formatter: formatValue,
        },
        max: xUnit === 'percentage' || dataType === 'percentage' ? 100 : undefined,
      },
      series: [
        {
          data: chartData.map((item) => item.value),
          type: 'bar',
          barMaxWidth: 20,
          itemStyle: {
            color: color || '#000',
            borderRadius: [50, 50, 0, 0],
          },
        },
      ],
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          if (xUnit === 'number') {
            if (chartFor !== 'apneaIndexDistribution') {
              const item = chartData[params[0].dataIndex];
              return `<div style="margin-top: 4px">
              <span >${item.value}%</span>
              <br>
              <span style="font-weight: bold">${item.number} BPM</span>
              </div>`;
            } else {
              const item = chartData[params[0].dataIndex];
              return `<div style="margin-top: 4px">
              <span style="font-weight: bold">${item.value}%</span>
              <br>
              <span style="font-weight: normal">${item.number}</span>
              </div>`;
            }
          } else if (xUnit === 'hour') {
            const item = chartData[params[0].dataIndex];
            return `<div style="margin-top: 4px">
                    ${item.value ? `<span>${item.value}%</span>` : '--'}
                    <br>
                    <span style="font-weight: bold">${item.hour}</span>
                    </div>`;
          } else if (xUnit === 'percentage') {
            const item = chartData[params[0].dataIndex];
            if (item.date) {
              const fullDate = new Date(item.date)
                .toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })
                .replace(/\//g, '-');
              return `<div style="font-weight: bold">${item.value}%</div>
                     <div style="margin-top: 4px">${fullDate}</div>`;
            }
            return `<div style="font-weight: bold"> ${item.value}% <br/> <span style="font-weight: normal">${item.percentage}%</span></div>`;
          }

          const date = chartData[params[0].dataIndex].date;
          const fullDate = new Date(date)
            .toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
            .replace(/\//g, '-');

          return `<div style="font-weight: bold">${fullDate}</div>
                  <div style="margin-top: 4px">${formatValue(params[0].value)}${dataUnit}</div>`;
        },
      },
    };
  }, [data, dataType, color, chartType, fromDate, toDate, xUnit, hourLimit, numberLimit]);

  if (!data?.length || !options) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        {' '}
        <Empty description='No data available to show' />
      </div>
    );
  }

  return <ReactECharts option={options} style={{ height: '350px' }} />;
}
