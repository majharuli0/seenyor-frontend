import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import { getResponseTime } from '@/utils/helper';

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

  statsBox: { flexDirection: 'column', maxWidth: 180, width: '100%' },
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
    width: '100%',
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
  timeCol: { width: '25%' },
  exitCol: { width: '25%' },
  durationCol: { width: '25%' },
  roomCol: { width: '25%' },

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

const VisitReportTemplate = ({
  data,
  filters,
  pageNumber,
  totalPages,
  selectedResidentNames = [],
}) => {
  const { visits, dateRange } = data;
  const from = dateRange?.from || '-';
  const to = dateRange?.to || '-';
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* Header */}
        {pageNumber === 1 && (
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.smallGray}>COMPLIANCE REPORT</Text>
              <Text style={styles.largeBlack}>Eldery Nursing Home care, UK</Text>
              <Text style={styles.dateText}>From {from}</Text>
              <Text style={styles.dateText}>To {to}</Text>
            </View>
          </View>
        )}

        {/* Selection Box */}
        {pageNumber === 1 && (
          <View style={styles.selectionBox}>
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
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, styles.timeCol]}>
              <Text style={styles.tableHeaderText}>Time of Visit</Text>
            </View>
            <View style={[styles.tableColHeader, styles.exitCol]}>
              <Text style={styles.tableHeaderText}>Exit Time</Text>
            </View>
            <View style={[styles.tableColHeader, styles.durationCol]}>
              <Text style={styles.tableHeaderText}>Visit Duration</Text>
            </View>
            <View style={[styles.tableColHeader, styles.roomCol]}>
              <Text style={styles.tableHeaderText}>Room Number</Text>
            </View>
          </View>

          {/* Table Data */}
          {visits.map((visit, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={[styles.tableCol, styles.timeCol]}>
                <Text style={styles.tableCell}>
                  {dayjs(visit.time_of_visit).format('HH:mm:ss')}
                </Text>
              </View>
              <View style={[styles.tableCol, styles.exitCol]}>
                <Text style={styles.tableCell}>
                  {(visit?.exit_time && dayjs(visit?.exit_time).format('HH:mm:ss')) || '-'}
                </Text>
              </View>
              <View style={[styles.tableCol, styles.durationCol]}>
                <Text style={styles.tableCell}>
                  {' '}
                  {getResponseTime(visit?.time_of_visit, visit?.exit_time)}
                </Text>
              </View>
              <View style={[styles.tableCol, styles.roomCol]}>
                <Text style={styles.tableCell}>{visit.room_no}</Text>
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

export default VisitReportTemplate;
