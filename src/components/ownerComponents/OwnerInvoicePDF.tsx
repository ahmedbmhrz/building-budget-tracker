'use client'

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { OwnerBalance } from "@/lib/calculations"

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '1pt solid #e2e8f0',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 14,
    color: '#0f172a',
    marginTop: 4,
  },
  table: {
    width: 'auto',
    marginTop: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableHeader: {
    backgroundColor: '#f8fafc',
    padding: 8,
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
    color: '#334155',
  },
  col1: { width: '40%' },
  col2: { width: '30%', textAlign: 'right' },
  col3: { width: '30%', textAlign: 'right' },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 16,
  },
  summaryValue: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    width: 80,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#94a3b8',
    borderTop: '1pt solid #e2e8f0',
    paddingTop: 10,
  }
})

export const OwnerInvoiceDocument = ({ owner, year }: { owner: OwnerBalance, year: number }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Building Maintenance Invoice</Text>
        <Text style={styles.subtitle}>Budget Cycle: {year}</Text>
      </View>

      <View style={{ flexDirection: 'row', marginBottom: 30 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Billed To</Text>
          <Text style={styles.value}>{owner.full_name}</Text>
          {owner.phone && <Text style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{owner.phone}</Text>}
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={styles.label}>Date Generated</Text>
          <Text style={styles.value}>{new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0f172a' }}>Property Breakdown</Text>
      
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.col1, { fontWeight: 'bold' }]}>Unit</Text>
          <Text style={[styles.tableCell, styles.col2, { fontWeight: 'bold' }]}>Details</Text>
          <Text style={[styles.tableCell, styles.col3, { fontWeight: 'bold' }]}>Assessed Due</Text>
        </View>
        
        {owner.units.map((unit, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.col1]}>Unit {unit.unit_number}</Text>
            <Text style={[styles.tableCell, styles.col2]}>{unit.sqft} sqft ({unit.percentage}% share)</Text>
            <Text style={[styles.tableCell, styles.col3]}>${Number(unit.unit_due).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 20 }}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Assessed:</Text>
          <Text style={styles.summaryValue}>${Number(owner.total_owed).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Paid:</Text>
          <Text style={[styles.summaryValue, { color: '#059669' }]}>-${Number(owner.total_paid).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { fontWeight: 'bold', color: '#0f172a' }]}>Outstanding Balance:</Text>
          <Text style={styles.summaryValue}>${Number(owner.outstanding_balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>Please make checks payable to Building Management.</Text>
        <Text style={{ marginTop: 4 }}>For questions regarding this invoice, please contact the administration office.</Text>
      </View>
    </Page>
  </Document>
)
