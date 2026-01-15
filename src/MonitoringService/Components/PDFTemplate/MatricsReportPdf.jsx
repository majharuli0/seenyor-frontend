import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import { Button } from '../ui/button';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#111',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reportTitle: {
    fontSize: 13,
    marginTop: 4,
    textDecoration: 'underline',
  },
  dateRange: {
    fontSize: 10,
    marginTop: 4,
    color: '#555',
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    borderBottom: '1 solid #ccc',
    paddingBottom: 3,
  },
  infoBoxContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  infoBox: {
    width: '49.9%',
    backgroundColor: '#f0f0f0',
    padding: 8,
    marginBottom: 2,
    fontWeight: 600,
    fontSize: '11px',
  },
  table: {
    display: 'table',
    width: '100%',
    border: '1 solid #ddd',
    borderRadius: 3,
    marginTop: 5,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderRight: '0.5 solid #ddd',
    padding: 4,
  },
  tableColHeader: {
    width: '25%',
    borderRight: '0.5 solid #ddd',
    backgroundColor: '#f0f0f0',
    padding: 4,
  },
  tableCellHeader: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  tableCell: {
    fontSize: 9,
  },
  noData: {
    fontSize: 9,
    fontStyle: 'italic',
    color: '#777',
    marginTop: 4,
  },
});

const summaryData = {
  companyName: 'Yo Yo Monitoring ST.',
  startDate: 'Oct 01, 2025',
  endDate: 'Oct 21, 2025',
  totalAlerts: 0,
  avgResponseTime: '0s',
  slaCompliance: '0%',
  deviceUptime: '0%',
};

const generateSampleData = () => {
  const days = Array.from({ length: 30 }, (_, i) =>
    dayjs()
      .subtract(29 - i, 'day')
      .format('YYYY-MM-DD')
  );
  const alertTypes = ['Device Offline Alert', 'Fall Alert'];
  const sampleData = [];

  days.forEach((day) => {
    const alertCount = Math.floor(Math.random() * 12) + 8;

    for (let i = 0; i < alertCount; i++) {
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      const responseTime = Math.floor(Math.random() * 25) + 5;
      const slaTime = 15;
      const compliance = responseTime <= slaTime;
      const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];

      sampleData.push({
        day,
        time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        hour: hour + minute / 60,
        responseTime,
        slaTime,
        alertId: `A${day.replace(/-/g, '')}${i + 1}`,
        compliance,
        alertType,
      });
    }
  });

  return sampleData;
};

// Sample data for new tables
const agentResolvingAlerts = [
  { Agent: 'Alice Johnson', 'True Alarms': 45, 'False Alarms': 12 },
  { Agent: 'Bob Smith', 'True Alarms': 38, 'False Alarms': 8 },
  { Agent: 'Charlie Lee', 'True Alarms': 52, 'False Alarms': 15 },
  { Agent: 'Dana White', 'True Alarms': 28, 'False Alarms': 5 },
  { Agent: 'Ethan Brown', 'True Alarms': 41, 'False Alarms': 10 },
  { Agent: 'Fiona Davis', 'True Alarms': 33, 'False Alarms': 7 },
  { Agent: 'George Miller', 'True Alarms': 49, 'False Alarms': 18 },
  { Agent: 'Hannah Wilson', 'True Alarms': 22, 'False Alarms': 4 },
];

const agentPerformanceWithSLA = [
  { Agent: 'Alice Johnson', 'Response Rate': '92%', 'SLA Compliance': '88%' },
  { Agent: 'Bob Smith', 'Response Rate': '87%', 'SLA Compliance': '85%' },
  { Agent: 'Charlie Lee', 'Response Rate': '95%', 'SLA Compliance': '92%' },
  { Agent: 'Dana White', 'Response Rate': '80%', 'SLA Compliance': '78%' },
  { Agent: 'Ethan Brown', 'Response Rate': '88%', 'SLA Compliance': '86%' },
  { Agent: 'Fiona Davis', 'Response Rate': '91%', 'SLA Compliance': '89%' },
  { Agent: 'George Miller', 'Response Rate': '84%', 'SLA Compliance': '82%' },
  { Agent: 'Hannah Wilson', 'Response Rate': '93%', 'SLA Compliance': '90%' },
];

const slaCompliance = Array.from({ length: 30 }, (_, i) => {
  const date = dayjs()
    .subtract(29 - i, 'day')
    .format('MMM DD');
  const compliance = Math.floor(Math.random() * 50) + 10;
  const nonCompliance = Math.floor(Math.random() * 50) + 10;
  const total = compliance + nonCompliance;
  const percent = ((compliance / total) * 100).toFixed(0) + '%';

  return { date, compliance, nonCompliance, percent };
});

const generateDailySLAData = () => {
  const rawData = generateSampleData();
  const grouped = {};

  rawData.forEach((item) => {
    if (!grouped[item.day]) {
      grouped[item.day] = {
        date: dayjs(item.day).format('MMM DD'),
        fallCount: 0,
        offlineCount: 0,
        totalAlerts: 0,
        slaMet: 0,
      };
    }

    grouped[item.day].totalAlerts++;
    if (item.alertType === 'Fall Alert') grouped[item.day].fallCount++;
    if (item.alertType === 'Device Offline Alert') grouped[item.day].offlineCount++;
    if (item.compliance) grouped[item.day].slaMet++;
  });

  const result = Object.values(grouped).map((day) => ({
    date: day.date,
    fallCount: day.fallCount,
    offlineCount: day.offlineCount,
    slaPercent:
      day.totalAlerts > 0 ? ((day.slaMet / day.totalAlerts) * 100).toFixed(1) + '%' : '0%',
  }));

  return result;
};

const slaDailySummary = generateDailySLAData();

const renderTable = (headers, rows) => (
  <View style={styles.table}>
    <View style={styles.tableRow}>
      {headers.map((h, i) => (
        <View
          key={i}
          style={{
            width: `${100 / headers.length}%`,
            padding: 6,
            borderBottom: '0.5 solid #ccc',
            borderRight: i < headers.length - 1 ? '0.5 solid #ccc' : 'none',
          }}
        >
          <Text style={styles.tableCellHeader}>{h}</Text>
        </View>
      ))}
    </View>

    {rows.map((row, i) => (
      <View key={i} style={styles.tableRow}>
        {Object.values(row).map((cell, j) => (
          <View
            key={j}
            style={{
              width: `${100 / headers.length}%`,
              padding: 6,
              borderBottom: '0.5 solid #ddd',
              borderRight: j < headers.length - 1 ? '0.5 solid #ddd' : 'none',
            }}
          >
            <Text style={styles.tableCell}>{cell}</Text>
          </View>
        ))}
      </View>
    ))}
  </View>
);

const AnalyticsReportDocument = ({
  basicInfo = {},
  agentResolvingAlerts = [],
  agentPerformanceWithSLA = [],
  slaCompliance = [],
}) => (
  <Document>
    <Page size='A4' style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.companyName}>{basicInfo.companyName}</Text>
        <Text style={styles.reportTitle}>Agents Performance Report</Text>
        <Text style={styles.dateRange}>
          {basicInfo.startDate} → {basicInfo.endDate}
        </Text>
      </View>

      <View style={styles.infoBoxContainer}>
        <View style={styles.infoBox}>
          <Text>Total Alerts Handled: {basicInfo.totalAlerts}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text>Avg. Response Time: {basicInfo.avgResponseTime}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text>SLA Compliance: {basicInfo.slaCompliance}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text>False Alerts: {basicInfo.falseAlerts}</Text>
        </View>
      </View>

      {/* Agent By Resolving Alert with True/False Count */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Agent Alert Summary</Text>
        {agentResolvingAlerts.length > 0 ? (
          renderTable(['Agent', 'True Alarms', 'False Alarms'], agentResolvingAlerts)
        ) : (
          <Text style={styles.noData}>No data available.</Text>
        )}
      </View>

      {/* Agent Performance with SLA and Response Rate */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Agent Performance</Text>
        {agentPerformanceWithSLA.length > 0 ? (
          renderTable(['Agent', 'Response Rate %', 'SLA Compliance %'], agentPerformanceWithSLA)
        ) : (
          <Text style={styles.noData}>No data available.</Text>
        )}
      </View>

      {/* SLA Compliance Report (kept as it is) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SLA Compliance Report</Text>
        {slaCompliance.length > 0 ? (
          renderTable(['Date', 'Compliant', 'Non-Compliant', 'SLA %'], slaCompliance)
        ) : (
          <Text style={styles.noData}>No data available.</Text>
        )}
      </View>
    </Page>
  </Document>
);

const MatricsReportPdf = ({ pdfProps = {} }) => (
  <PDFDownloadLink
    document={
      <AnalyticsReportDocument
        basicInfo={pdfProps.basicInfo}
        agentResolvingAlerts={pdfProps.agentResolvingAlerts}
        agentPerformanceWithSLA={pdfProps.agentPerformanceWithSLA}
        slaCompliance={pdfProps.slaCompliance}
      />
    }
    fileName='Analytics_Report.pdf'
  >
    {({ loading }) => <Button>{loading ? 'Generating...' : 'Export Report'}</Button>}
  </PDFDownloadLink>
);

export default MatricsReportPdf;
