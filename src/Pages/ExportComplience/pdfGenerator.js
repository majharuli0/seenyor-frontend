import { pdf } from '@react-pdf/renderer';
import { PDFDocument } from 'pdf-lib';

import AlarmReportTemplate from './components/AlarmReportTemplate';
import VisitReportTemplate from './components/VisitReportTemplate';
const ROWS_PER_PAGE = 20;

const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

// Generate visit report with pagination
export const generateVisitReport = async (data, filters) => {
  const { visits, dateRange, selectedResidents } = data;
  const chunks = chunkArray(visits, 25);
  const totalPages = chunks.length || 1;

  const documents = [];

  for (let i = 0; i < chunks.length; i++) {
    const pageData = {
      visits: chunks[i],
      dateRange,
    };

    const doc = VisitReportTemplate({
      data: pageData,
      filters,
      pageNumber: i + 1,
      totalPages,
      selectedResidentNames: selectedResidents,
    });

    documents.push(doc);
  }

  // If no data, create empty page
  if (chunks.length === 0) {
    const doc = VisitReportTemplate({
      data: { visits: [], dateRange },
      filters,
      pageNumber: 1,
      totalPages: 1,
      selectedResidentNames: selectedResidents,
    });
    documents.push(doc);
  }

  return documents;
};

// Generate alarm report with pagination
export const generateAlarmReport = async (data, filters) => {
  const { alarms, dateRange, totalAlarms, avgResponseTime, selectedResidents, selectedNurses } =
    data;
  const chunks = chunkArray(alarms, ROWS_PER_PAGE);
  const totalPages = chunks.length || 1;

  const documents = [];

  for (let i = 0; i < chunks.length; i++) {
    const pageData = {
      alarms: chunks[i],
      dateRange,
      totalAlarms,
      avgResponseTime,
    };
    console.log(filters);

    const doc = AlarmReportTemplate({
      data: pageData,
      filters,
      pageNumber: i + 1,
      totalPages,
      selectedResidentNames: selectedResidents,
      selectedNurseNames: selectedNurses,
    });

    documents.push(doc);
  }

  // If no data, create empty page
  if (chunks.length === 0) {
    const doc = AlarmReportTemplate({
      data: { alarms: [], dateRange, totalAlarms: 0, avgResponseTime: 0 },
      filters,
      pageNumber: 1,
      totalPages: 1,
    });
    documents.push(doc);
  }

  return documents;
};

// Main generator
export const generatePDF = async (reportType, data, filters) => {
  try {
    let documents;

    if (reportType === 'visits') {
      documents = await generateVisitReport(data, filters);
    } else if (reportType === 'alarms') {
      documents = await generateAlarmReport(data, filters);
    } else {
      throw new Error('Invalid report type');
    }

    if (!documents || documents.length === 0) {
      throw new Error('No documents to generate');
    }

    // If only one doc, just return it
    if (documents.length === 1) {
      return await pdf(documents[0]).toBlob();
    }

    // Merge multiple PDFs
    const mergedPdf = await PDFDocument.create();

    for (const doc of documents) {
      const blob = await pdf(doc).toBlob();
      const buffer = await blob.arrayBuffer();
      const tempPdf = await PDFDocument.load(buffer);

      const copiedPages = await mergedPdf.copyPages(tempPdf, tempPdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    return new Blob([mergedBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Download PDF function
export const downloadPDF = async (reportType, data, filters) => {
  try {
    const pdfBlob = await generatePDF(reportType, data, filters);

    // Create download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportType}-compliance-report-${new Date().toISOString().split('T')[0]}.pdf`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};
