import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet
} from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 20,
    fontFamily: 'Helvetica',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1a237e',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
  },
  eventCard: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
    border: '2px solid #1976d2',
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
    textAlign: 'center',
    marginBottom: 10,
  },
  eventDate: {
    fontSize: 14,
    color: '#ff6f00',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  leftColumn: {
    flex: 1,
    marginRight: 20,
  },
  rightColumn: {
    flex: 1,
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: '#495057',
    width: 80,
    marginRight: 10,
  },
  infoValue: {
    fontSize: 14,
    color: '#212121',
    fontWeight: 'bold',
    flex: 1,
  },
  priceBox: {
    backgroundColor: '#4caf50',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  priceLabel: {
    fontSize: 12,
    color: '#ffffff',
    marginBottom: 8,
  },
  priceAmount: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  priceSubtext: {
    fontSize: 10,
    color: '#ffffff',
    marginBottom: 5,
  },
  quantityText: {
    fontSize: 12,
    color: '#ffffff',
  },
  bookingSection: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  notesSection: {
    backgroundColor: '#ff6f00',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  notesTitle: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  notesItem: {
    fontSize: 10,
    color: '#ffffff',
    marginBottom: 3,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#495057',
    marginBottom: 5,
  },
  footerCopyright: {
    fontSize: 10,
    color: '#6c757d',
  },
  separator: {
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: '#1a237e',
    marginVertical: 15,
  },
});

const TicketPDFDocument = ({ bookingData }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>EVENTHUB</Text>
          <Text style={styles.headerSubtitle}>Digital Event Ticket</Text>
        </View>

        {/* Event Details Card */}
        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>{bookingData.eventTitle}</Text>
          <Text style={styles.eventDate}>{bookingData.eventDate}</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Left Column - Event Details */}
          <View style={styles.leftColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>VENUE:</Text>
              <Text style={styles.infoValue}>{bookingData.venue}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>TICKET TYPE:</Text>
              <Text style={styles.infoValue}>{bookingData.ticketName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>QUANTITY:</Text>
              <Text style={styles.infoValue}>{bookingData.quantity}</Text>
            </View>
          </View>

          {/* Right Column - QR Code Space */}
          <View style={styles.rightColumn}>
            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>BOOKING DETAILS</Text>
              <Text style={styles.priceAmount}>Qty: {bookingData.quantity}</Text>
              <Text style={styles.priceSubtext}>Ticket Confirm</Text>
              <Text style={styles.quantityText}>Ref: {bookingData.paymentIntentId.substring(0, 12)}</Text>
            </View>
          </View>
        </View>

        {/* Booking Information */}
        <View style={styles.bookingSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>BOOKING ID:</Text>
            <Text style={styles.infoValue}>{bookingData.paymentIntentId}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>CUSTOMER:</Text>
            <Text style={styles.infoValue}>{bookingData.customerEmail}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>BOOKING DATE:</Text>
            <Text style={styles.infoValue}>{new Date().toLocaleDateString('en-IE')}</Text>
          </View>
        </View>

        {/* Important Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>IMPORTANT INFORMATION</Text>
          <Text style={styles.notesItem}>• Arrive 15 minutes before the event starts</Text>
          <Text style={styles.notesItem}>• Bring valid ID (18+ years required)</Text>
          <Text style={styles.notesItem}>• Present this ticket at venue entry</Text>
          <Text style={styles.notesItem}>• This booking is non-refundable</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.separator} />
          <Text style={styles.footerText}>Thank you for choosing EventHub!</Text>
          <Text style={styles.footerCopyright}>© 2024 EventHub • www.eventhub.com</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default TicketPDFDocument;
