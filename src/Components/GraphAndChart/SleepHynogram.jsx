import React, { useRef, useEffect, useState, useContext } from 'react';
import * as d3 from 'd3';
import './SleepHypnogram.css';
import { SidebarContext } from '@/Context/CustomContext';

const SleepHypnogram = ({ sleepData = {}, height = 200 }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [containerWidth, setContainerWidth] = useState(800);
  const { sleepEventsType, sleepEventsColor } = useContext(SidebarContext);

  function transformSleepData(data) {
    const stageMap = {
      0: 'deep',
      1: 'light',
      2: 'awake',
      3: 'out_of_bed',
      7: 'rem',
    };

    const parseTime = (t) => new Date(t?.replace(' ', 'T'));
    const base = parseTime(data[0]?.start_time);
    const toMinutes = (date) => Math.floor((date - base) / 60000);

    const result = [];

    data.length &&
      data.forEach((item) => {
        const start = parseTime(item.start_time);
        const end = parseTime(item.end_time);

        const stage = stageMap[item.status] || 'unknown';

        result.push({
          time: toMinutes(start),
          stage,
          start_time: item.start_time,
        });

        result.push({
          time: toMinutes(end),
          stage,
          end_time: item.end_time,
        });
      });

    return result;
  }

  // Format time to AM/PM
  const formatTimeToAMPM = (dateTimeStr) => {
    const date = new Date(dateTimeStr.replace(' ', 'T'));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime.replace(' ', 'T'));
    const end = new Date(endTime.replace(' ', 'T'));
    const durationMs = end - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim();
    } else {
      return `${minutes}m`;
    }
  };

  const defaultSleepData = transformSleepData(sleepData);
  const data = defaultSleepData;

  const stageConfig = {
    out_of_bed: {
      label: 'Out of Bed',
      color: sleepEventsColor['Out of Bed'] || '#D3D3D3',
      yPosition: 0.7, // Top position
    },
    awake: {
      label: 'Awake',
      color: sleepEventsColor['Awake'] || '#FFA500',
      yPosition: 0.55,
    },
    rem: {
      label: 'REM',
      color: sleepEventsColor['REM'] || '#A0C878',
      yPosition: 0.4,
    },
    light: {
      label: 'Light',
      color: sleepEventsColor['Light Sleep'] || '#4285F4',
      yPosition: 0.25,
    },
    deep: {
      label: 'Deep',
      color: sleepEventsColor['Deep Sleep'] || '#7F87FC',
      yPosition: 0.1, // Bottom position
    },
  };

  const calculateStageSegments = (sleepData) => {
    const segments = [];

    for (let i = 0; i < sleepData.length - 1; i++) {
      const currentPoint = sleepData[i];
      const nextPoint = sleepData[i + 1];

      if (currentPoint.stage === nextPoint.stage) {
        segments.push({
          stage: currentPoint.stage,
          startTime: currentPoint.time,
          endTime: nextPoint.time,
          start_time: currentPoint.start_time,
          end_time: nextPoint.end_time,
          duration: nextPoint.time - currentPoint.time,
          yPosition: stageConfig[currentPoint?.stage]?.yPosition,
        });
      }
    }

    return segments;
  };

  const stageSegments = calculateStageSegments(data);

  const getXAxisDomain = () => {
    if (!sleepData || sleepData.length === 0) return [0, 480]; // Default 8 hours

    const startTime = new Date(sleepData[0]?.start_time.replace(' ', 'T'));
    const endTime = new Date(sleepData[sleepData.length - 1]?.end_time.replace(' ', 'T'));

    const totalMinutes = (endTime - startTime) / (1000 * 60);
    return [0, totalMinutes];
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const newWidth = entry.contentRect.width;
        setContainerWidth(newWidth);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current || containerWidth === 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const margin = { top: 0, right: 0, bottom: 30, left: 70 };
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = height * 1.2;

    const xDomain = getXAxisDomain();
    const xScale = d3.scaleLinear().domain(xDomain).range([0, innerWidth]);

    const yScale = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]);

    const g = svg.append('g').attr('transform', `translate(${margin.left},-${60})`);

    Object.entries(stageConfig).forEach(([stage, config]) => {
      g.append('rect')
        .attr('x', 0)
        .attr('y', yScale(config.yPosition) - innerHeight * 0.05)
        .attr('width', innerWidth)
        .attr('height', innerHeight * 0.1)
        .attr('fill', config.color)
        .attr('opacity', 0.1)
        .attr('rx', 4);
    });

    const defs = svg.append('defs');

    // Helper to get or create gradient for a transition

    const getGradientId = (stage1, stage2) => {
      const id = `gradient-${stage1}-${stage2}`;
      if (defs.select(`#${id}`).empty()) {
        const config1 = stageConfig[stage1];
        const config2 = stageConfig[stage2];

        // Use userSpaceOnUse to map gradient directly to the Y-axis coordinates
        // This ensures the color at y1 matches stage1 and y2 matches stage2
        const y1 = yScale(config1.yPosition);
        const y2 = yScale(config2.yPosition);

        const gradient = defs
          .append('linearGradient')
          .attr('id', id)
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', 0)
          .attr('y1', y1)
          .attr('x2', 0)
          .attr('y2', y2);

        gradient.append('stop').attr('offset', '0%').attr('stop-color', config1.color);

        gradient.append('stop').attr('offset', '100%').attr('stop-color', config2.color);
      }
      return id;
    };

    // Draw segments
    for (let i = 0; i < data.length - 1; i++) {
      const p1 = data[i];
      const p2 = data[i + 1];

      const config1 = Object.prototype.hasOwnProperty.call(stageConfig, p1.stage)
        ? stageConfig[p1.stage]
        : null;
      const config2 = Object.prototype.hasOwnProperty.call(stageConfig, p2.stage)
        ? stageConfig[p2.stage]
        : null;

      if (!config1 || !config2) continue;

      const x1 = xScale(p1.time);
      const y1 = yScale(config1.yPosition);
      const x2 = xScale(p2.time);
      const y2 = yScale(config2.yPosition);

      const isSameStage = p1.stage === p2.stage;

      g.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr(
          'stroke',
          isSameStage ? stageConfig[p1.stage]?.color : `url(#${getGradientId(p1.stage, p2.stage)})`
        )
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round');
    }

    // Add data points
    const dataPoints = g
      .selectAll('.data-point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', (d) => xScale(d.time))
      .attr('cy', (d) => yScale(stageConfig[d.stage]?.yPosition))
      .attr('r', 3)
      .attr('fill', (d) => stageConfig[d.stage]?.color)
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    const stageLines = [];

    stageSegments?.forEach((segment) => {
      const config = stageConfig[segment.stage];
      const yPos = yScale(config?.yPosition);
      const lineHeight = 20;

      const lineGroup = g.append('g').attr('class', 'stage-line-group');

      const stageLine = lineGroup
        .append('rect')
        .attr('class', 'stage-duration-line')
        .attr('x', xScale(segment.startTime))
        .attr('y', yPos - lineHeight / 2)
        .attr('width', xScale(segment.endTime) - xScale(segment.startTime))
        .attr('height', lineHeight)
        .attr('fill', config?.color)
        .attr('rx', 6)
        .attr('opacity', 0.8);

      stageLines.push({
        element: stageLine,
        group: lineGroup,
        segment: segment,
      });

      const tooltip = g
        .append('g')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('pointer-events', 'none');

      tooltip.append('rect').attr('class', 'tooltip-bg').attr('rx', 6).attr('ry', 6);

      const tooltipText = tooltip
        .append('text')
        .attr('class', 'tooltip-text')
        .attr('dy', '1.2em')
        .attr('x', 8);

      lineGroup
        .on('mouseenter', function (event) {
          const durationText = calculateDuration(segment.start_time, segment.end_time);
          const startTimeFormatted = formatTimeToAMPM(segment.start_time);
          const endTimeFormatted = formatTimeToAMPM(segment.end_time);

          stageLines.forEach((sl) => {
            if (sl.segment === segment) {
              sl.element.transition().duration(150).attr('opacity', 1);
            } else {
              sl.element.transition().duration(150).attr('opacity', 0.3);
            }
          });

          dataPoints.transition().duration(150).style('opacity', 1);

          const [x, y] = d3.pointer(event, this);

          tooltipText.selectAll('tspan').remove();
          tooltipText
            .append('tspan')
            .attr('x', 0)
            .attr('dy', '0')
            .text(`${config.label}: ${durationText}`);
          tooltipText
            .append('tspan')
            .attr('x', 0)
            .attr('dy', '1.2em')
            .text(`${startTimeFormatted} - ${endTimeFormatted}`);

          const bbox = tooltipText.node().getBBox();

          tooltip
            .select('.tooltip-bg')
            .attr('x', -bbox.width / 2 - 8)
            .attr('y', -bbox.height / 2 - 4)
            .attr('width', bbox.width + 16)
            .attr('height', bbox.height + 15)
            .attr('fill', config.color);

          const tooltipX = Math.max(
            bbox.width / 2 + 8,
            Math.min(x, innerWidth - bbox.width / 2 - 8)
          );
          const tooltipY = y - 45;

          tooltip
            .attr('transform', `translate(${tooltipX},${tooltipY})`)
            .raise()
            .transition()
            .duration(150)
            .style('opacity', 1);
        })
        .on('mouseleave', function () {
          stageLines.forEach((sl) => {
            sl.element.transition().duration(150).attr('opacity', 0.8);
          });

          tooltip.transition().duration(150).style('opacity', 0);
        });
    });

    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat((d) => {
        if (!sleepData || sleepData.length === 0) {
          const hours = Math.floor(d / 60);
          const minutes = d % 60;
          return `${hours}:${minutes.toString().padStart(2, '0')}`;
        }

        const startTime = new Date(sleepData[0].start_time.replace(' ', 'T'));
        const tickTime = new Date(startTime.getTime() + d * 60000);
        return tickTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
      })
      .ticks(Math.min(8, Math.floor(innerWidth / 80)));

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    const yAxis = d3
      .axisLeft(yScale)
      .tickValues(Object.values(stageConfig).map((config) => config.yPosition))
      .tickFormat((d) => {
        const stage = Object.entries(stageConfig).find(([_, config]) => config.yPosition === d);
        return stage ? stage[1].label : '';
      });

    g.append('g').attr('class', 'y-axis').call(yAxis);
  }, [data, containerWidth, height, stageSegments, sleepData]);

  return (
    <div ref={containerRef} className='sleep-hypnogram' style={{ width: '100%' }}>
      <div className='hypnogram-container'>
        <svg ref={svgRef} width={containerWidth} height={height} className='hypnogram-svg' />
      </div>
    </div>
  );
};

export default SleepHypnogram;
