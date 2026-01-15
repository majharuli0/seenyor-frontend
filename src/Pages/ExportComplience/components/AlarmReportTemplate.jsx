import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { getAlertInfoViaEventDetails, getResponseTime } from '@/utils/helper';

// Register Poppins font
Font.register({
  family: 'Poppins',
  fonts: [
    { src: '/fonts/Poppins-Thin.ttf', fontWeight: 100 },
    { src: '/fonts/Poppins-ExtraLight.ttf', fontWeight: 200 },
    { src: '/fonts/Poppins-Light.ttf', fontWeight: 300 },
    { src: '/fonts/Poppins-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Poppins-Medium.ttf', fontWeight: 500 },
    { src: '/fonts/Poppins-SemiBold.ttf', fontWeight: 600 },
    { src: '/fonts/Poppins-Bold.ttf', fontWeight: 700 },
    { src: '/fonts/Poppins-ExtraBold.ttf', fontWeight: 800 },
    { src: '/fonts/Poppins-Black.ttf', fontWeight: 900 },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Poppins',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerLeft: { flexDirection: 'column' },
  smallGray: { fontSize: 12, color: '#8C8C8C', marginBottom: 2 },
  largeBlack: {
    fontSize: 20,
    fontWeight: 500,
    color: '#2B2B2B',
    marginBottom: 2,
  },
  dateText: { fontSize: 12, color: '#2B2B2B' },

  statsBox: { flexDirection: 'column', maxWidth: 250, width: '100%' },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 4,
    marginBottom: 4,
    borderBottom: 1,
    borderColor: '#D9D9D9',
  },
  statRowLast: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { fontSize: 12, color: '#5D5D5D' },
  statValue: { fontSize: 14, fontWeight: 500, color: '#000000' },

  selectionBox: {
    padding: 6,
    backgroundColor: '#F3F4F6',
    marginBottom: 10,
    borderRadius: 4,
  },
  selectionLine: { marginBottom: 3 },
  selectionBold: { fontSize: 10, fontWeight: 600, color: '#374151' },
  selectionText: { fontSize: 10, color: '#1F2937' },

  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#E5E7EB',
    marginTop: 4,
  },
  tableRow: { flexDirection: 'row' },
  tableColHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    padding: 4,
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#E5E7EB',
    padding: 4,
  },
  alarmNameCol: { width: '14%' },
  logsCol: { width: '25%' },
  residentCol: { width: '13%' },
  roomCol: { width: '7%' },
  responseCol: { width: '10%' },
  resolvedCol: { width: '13%' },
  commentsCol: { width: '18%' },
  tableHeaderText: { fontSize: 9, fontWeight: 700, color: '#374151' },
  tableCell: { fontSize: 9, color: '#1F2937' },

  footer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    borderTop: 0.5,
    borderColor: '#CCCCCC',
    paddingTop: 6,
    textAlign: 'center',
  },
  footerText: { fontSize: 9, fontWeight: 500, color: '#2B2B2B' },
});

const AlarmReportTemplate = ({
  data,
  filters,
  pageNumber,
  totalPages,
  selectedNurseNames = [],
  selectedResidentNames = [],
}) => {
  const { alarms, dateRange, totalAlarms, avgResponseTime } = data;
  const from = dateRange?.from || '-';
  const to = dateRange?.to || '-';
  console.log(filters);

  return (
    <Document>
      <Page size='A3' style={styles.page}>
        {/* Header */}
        {pageNumber === 1 && (
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.smallGray}>COMPLIANCE REPORT</Text>
              <Text style={styles.largeBlack}>Eldery Nursing Home care, UK</Text>
              <Text style={styles.dateText}>From {from}</Text>
              <Text style={styles.dateText}>To {to}</Text>
            </View>

            <View style={styles.statsBox}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total Alarms</Text>
                <Text style={styles.statValue}>{totalAlarms}</Text>
              </View>
              {(filters?.alarms?.includes('fall_detected') || filters?.alarms?.length == 0) && (
                <View style={styles.statRowLast}>
                  <Text style={styles.statLabel}>Avg. Response Time</Text>
                  <Text style={styles.statValue}>{avgResponseTime}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Selection Box */}
        {pageNumber === 1 && (
          <View style={styles.selectionBox}>
            <View style={styles.selectionLine}>
              <Text>
                <Text style={styles.selectionBold}>With Nurse Involved: </Text>
                <Text style={styles.selectionText}>
                  {selectedNurseNames.length ? selectedNurseNames.join(', ') : 'All Nurses'}
                </Text>
              </Text>
            </View>
            <View style={styles.selectionLine}>
              <Text>
                <Text style={styles.selectionBold}>With Resident Involved: </Text>
                <Text style={styles.selectionText}>
                  {selectedResidentNames.length
                    ? selectedResidentNames.join(', ')
                    : 'All Residents'}
                </Text>
              </Text>
            </View>
          </View>
        )}

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, styles.alarmNameCol]}>
              <Text style={styles.tableHeaderText}>Alarm Name</Text>
            </View>
            <View style={[styles.tableColHeader, styles.logsCol]}>
              <Text style={styles.tableHeaderText}>Logs</Text>
            </View>
            <View style={[styles.tableColHeader, styles.residentCol]}>
              <Text style={styles.tableHeaderText}>Resident Name</Text>
            </View>
            <View style={[styles.tableColHeader, styles.roomCol]}>
              <Text style={styles.tableHeaderText}>Room No.</Text>
            </View>
            <View style={[styles.tableColHeader, styles.responseCol]}>
              <Text style={styles.tableHeaderText}>Response Time</Text>
            </View>
            <View style={[styles.tableColHeader, styles.resolvedCol]}>
              <Text style={styles.tableHeaderText}>Resolved By</Text>
            </View>
            <View style={[styles.tableColHeader, styles.commentsCol]}>
              <Text style={styles.tableHeaderText}>Comments</Text>
            </View>
          </View>

          {alarms?.map((alarm, idx) => (
            <View style={styles.tableRow} key={idx}>
              <View style={[styles.tableCol, styles.alarmNameCol]}>
                <Text style={styles.tableCell}>{getAlertInfoViaEventDetails(alarm)?.title}</Text>
              </View>
              <View style={[styles.tableCol, styles.logsCol]}>
                <Text style={styles.tableCell}>
                  Alarm detected at {new Date(alarm?.created_at).toLocaleTimeString()}{' '}
                  {alarm?.response_details
                    ? `• Responded At ${new Date(
                        alarm?.response_details?.created_at
                      ).toLocaleTimeString()}`
                    : ''}{' '}
                  {alarm?.closed_at
                    ? `• Resolved At ${new Date(alarm?.closed_at).toLocaleTimeString()}`
                    : ''}
                </Text>
              </View>
              <View style={[styles.tableCol, styles.residentCol]}>
                <Text style={styles.tableCell}>{alarm?.elderly_name}</Text>
              </View>
              <View style={[styles.tableCol, styles.roomCol]}>
                <Text style={styles.tableCell}>{alarm?.room_no}</Text>
              </View>
              <View style={[styles.tableCol, styles.responseCol]}>
                <Text style={styles.tableCell}>
                  {' '}
                  {alarm?.response_details?.created_at ? (
                    getResponseTime(alarm?.created_at, alarm?.response_details?.created_at)
                  ) : (
                    <Text style={{ opacity: 0.4 }}> Not Vsited Yet</Text>
                  )}
                </Text>
              </View>
              <View style={[styles.tableCol, styles.resolvedCol]}>
                <Text style={styles.tableCell}>
                  {' '}
                  {alarm?.closed_by || <Text style={{ opacity: 0.4 }}>Unresolved</Text>}
                </Text>
              </View>
              <View style={[styles.tableCol, styles.commentsCol]}>
                <Text style={styles.tableCell}>
                  {' '}
                  {alarm?.comment || <Text style={{ opacity: 0.4 }}>No Comments</Text>}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Page {pageNumber} of {totalPages}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default AlarmReportTemplate;
