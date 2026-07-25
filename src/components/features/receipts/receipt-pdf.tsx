/**
 * Premium university-style A4 receipt PDF.
 * Uses @react-pdf/renderer for PDF generation.
 */

import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { ReceiptPDFData } from "@/types/receipt";

// ── Register Inter font (using standard Helvetica as fallback until fonts are loaded) ──
// In production, register Inter TTF files:
// Font.register({
//   family: "Inter",
//   fonts: [
//     { src: "/fonts/Inter-Regular.ttf", fontWeight: 400 },
//     { src: "/fonts/Inter-Medium.ttf", fontWeight: 500 },
//     { src: "/fonts/Inter-SemiBold.ttf", fontWeight: 600 },
//     { src: "/fonts/Inter-Bold.ttf", fontWeight: 700 },
//   ],
// });

// ── Colors ──────────────────────────────────────────────────────────

const C = {
  primary: "#10556D",
  primaryLight: "#E6F0F3",
  gold: "#F5A926",
  white: "#FFFFFF",
  textDark: "#0F172A",
  textBody: "#334155",
  textMuted: "#94A3B8",
  borderLight: "#E2E8F0",
  bgLight: "#F8FAFC",
};

// ── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: C.textBody,
    position: "relative",
  },

  // ── Header ──────────────────────────────────────────────────────

  header: {
    backgroundColor: C.primary,
    paddingTop: "15mm",
    paddingBottom: "12mm",
    paddingLeft: "15mm",
    paddingRight: "15mm",
    position: "relative",
  },
  headerLogoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  headerLogo: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 9,
    fontFamily: "Helvetica",
    color: C.white,
    opacity: 0.8,
    marginTop: 2,
  },
  headerAddress: {
    fontSize: 7.5,
    fontFamily: "Helvetica",
    color: C.white,
    opacity: 0.6,
    marginTop: 4,
    marginBottom: 10,
  },
  goldLine: {
    height: 2,
    backgroundColor: C.gold,
    width: "100%",
    marginBottom: 10,
  },
  receiptTitle: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    letterSpacing: 1.5,
    textAlign: "center",
  },
  receiptMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  receiptMeta: {
    fontSize: 8,
    fontFamily: "Helvetica",
    color: C.white,
    opacity: 0.85,
  },

  // ── Body ────────────────────────────────────────────────────────

  body: {
    padding: "15mm",
    flex: 1,
  },
  twoColumns: {
    flexDirection: "row",
    gap: 10,
  },
  column: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.primary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
    paddingBottom: 4,
    marginBottom: 8,
  },
  fieldRow: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 7,
    fontFamily: "Helvetica",
    color: C.textMuted,
    marginBottom: 1,
  },
  fieldValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.textDark,
  },
  amountRow: {
    marginTop: 4,
    padding: 6,
    backgroundColor: C.primaryLight,
    borderRadius: 2,
  },
  amountValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: C.primary,
  },

  // ── Amount in Words ────────────────────────────────────────────

  amountWordsSection: {
    marginTop: "12mm",
    paddingTop: "6mm",
    borderTopWidth: 1,
    borderTopColor: C.borderLight,
  },
  amountWordsLabel: {
    fontSize: 7,
    fontFamily: "Helvetica",
    color: C.textMuted,
    marginBottom: 2,
  },
  amountWordsValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.textBody,
  },

  // ── Remarks ──────────────────────────────────────────────────────

  remarksSection: {
    marginTop: "6mm",
  },

  // ── Watermark ──────────────────────────────────────────────────

  watermarkContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-15deg)",
    opacity: 0.04,
  },
  watermarkText: {
    fontSize: 72,
    fontFamily: "Helvetica-Bold",
    color: C.primary,
  },

  // ── Footer ─────────────────────────────────────────────────────

  footer: {
    position: "absolute",
    bottom: "15mm",
    left: "15mm",
    right: "15mm",
    borderTopWidth: 1,
    borderTopColor: C.borderLight,
    paddingTop: "8mm",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  disclaimer: {
    fontSize: 6,
    fontFamily: "Helvetica",
    color: C.textMuted,
    flex: 1,
  },
  signatureBlock: {
    flexDirection: "row",
    gap: "8mm",
  },
  signatureBoxWrapper: {
    alignItems: "center",
  },
  signatureBox: {
    width: "28mm",
    height: "14mm",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: C.bgLight,
    borderRadius: 2,
  },
  signatureBoxText: {
    fontSize: 5,
    fontFamily: "Helvetica",
    color: "#CBD5E1",
    textAlign: "center",
  },
  signatureLabel: {
    fontSize: 6,
    fontFamily: "Helvetica",
    color: C.textMuted,
    textAlign: "center",
    marginTop: 2,
  },
});

// ── Component ──────────────────────────────────────────────────────

interface ReceiptPDFProps {
  data: ReceiptPDFData;
}

export function ReceiptPDF({ data }: ReceiptPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <View style={styles.watermarkContainer} fixed>
          <Text style={styles.watermarkText}>LS</Text>
        </View>

        {/* ── Header ─────────────────────────────────────────── */}
        <View style={styles.header} fixed>
          <View style={styles.headerLogoRow}>
            <Text style={styles.headerLogo}>⬢ LeapStart</Text>
          </View>
          <Text style={styles.headerSubtitle}>School of Technology</Text>
          <Text style={styles.headerAddress}>
            123 Education Lane, Bangalore - 560001{'\n'}
            Phone: +91 98765 43210 | Email: accounts@leapstart.edu
          </Text>
          <View style={styles.goldLine} />
          <Text style={styles.receiptTitle}>PAYMENT RECEIPT</Text>
          <View style={styles.receiptMetaRow}>
            <Text style={styles.receiptMeta}>
              Receipt #: {data.receiptNo}
            </Text>
            <Text style={styles.receiptMeta}>
              Date: {data.date}
            </Text>
          </View>
        </View>

        {/* ── Body ────────────────────────────────────────────── */}
        <View style={styles.body}>
          <View style={styles.twoColumns}>
            {/* Left: Student Details */}
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Student Details</Text>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Student Name</Text>
                <Text style={styles.fieldValue}>{data.studentName}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Parent / Guardian</Text>
                <Text style={styles.fieldValue}>{data.parentName}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Application ID</Text>
                <Text style={styles.fieldValue}>{data.applicationId}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Program</Text>
                <Text style={styles.fieldValue}>{data.program}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Academic Year</Text>
                <Text style={styles.fieldValue}>{data.academicYear}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Mobile</Text>
                <Text style={styles.fieldValue}>{data.mobile}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Email</Text>
                <Text style={styles.fieldValue}>{data.email}</Text>
              </View>
            </View>

            {/* Right: Payment Details */}
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Payment Details</Text>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Payment Type</Text>
                <Text style={styles.fieldValue}>{data.paymentType}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Payment Mode</Text>
                <Text style={styles.fieldValue}>{data.paymentMode}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Payment Date</Text>
                <Text style={styles.fieldValue}>{data.paymentDate}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Transaction ID</Text>
                <Text style={styles.fieldValue}>
                  {data.transactionId || "\u2014"}
                </Text>
              </View>
              <View style={[styles.fieldRow, styles.amountRow]}>
                <Text style={styles.fieldLabel}>Amount</Text>
                <Text style={styles.amountValue}>
                  {"\u20B9"} {data.amount.toLocaleString("en-IN")}
                </Text>
              </View>
            </View>
          </View>

          {/* Amount in Words */}
          <View style={styles.amountWordsSection}>
            <Text style={styles.amountWordsLabel}>Amount in words:</Text>
            <Text style={styles.amountWordsValue}>{data.amountInWords}</Text>
          </View>

          {/* Remarks */}
          {data.remarks && (
            <View style={styles.remarksSection}>
              <Text style={styles.fieldLabel}>Remarks:</Text>
              <Text style={styles.fieldValue}>{data.remarks}</Text>
            </View>
          )}
        </View>

        {/* ── Footer ───────────────────────────────────────────── */}
        <View style={styles.footer} fixed>
          <Text style={styles.disclaimer}>
            This is a computer-generated receipt. Valid without signature.
          </Text>
          <View style={styles.signatureBlock}>
            {/* QR Code Placeholder */}
            <View style={styles.signatureBoxWrapper}>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureBoxText}>QR Code</Text>
              </View>
              <Text style={styles.signatureLabel}>QR Code</Text>
            </View>

            {/* Digital Signature Placeholder */}
            <View style={styles.signatureBoxWrapper}>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureBoxText}>Digital{"\n"}Signature</Text>
              </View>
              <Text style={styles.signatureLabel}>Digital Signature</Text>
            </View>

            {/* Official Seal Placeholder */}
            <View style={styles.signatureBoxWrapper}>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureBoxText}>Official{"\n"}Seal</Text>
              </View>
              <Text style={styles.signatureLabel}>Official Seal</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
