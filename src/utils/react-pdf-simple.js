import { pdf } from '@react-pdf/renderer';
import React from 'react';
import QRCode from 'qrcode';

// Create a simple PDF component inline
const TicketDocument = ({ bookingData }) => {
  const colors = {
    primary: '#1a237e',
    secondary: '#3948ab',
    accent: '#ff6f00',
    success: '#4caf50',
    lightGray: '#f8f9fa',
    darkGray: '#495057',
    white: '#ffffff',
    black: '#212121',
    lightBlue: '#e3f2fd'
  };

  const Document = ({ children }) => children;
  const Page = ({ style, children }) => ({ page: { ...style, children } });
  const Text = ({ style, children }) => ({ text: { ...style, content: children } });
  const View = ({ style, children }) => ({ view: { ...style, children } });

  return {
    content: [
      {
        layout: 'landscape',
        pageSize: 'A4',
        styles: {
          page: {
            backgroundColor: colors.white,
            padding: [20, 20, 20, 20],
            fontFamily: 'Helvetica'
          },
          header: {
            backgroundColor: colors.primary,
            padding: 20,
            marginBottom: 20,
            color: colors.white
          },
          headerTitle: {
            fontSize: 32,
            color: colors.white,
            bold: true,
            alignment: 'center',
            marginBottom: 5
          },
          headerSubtitle: {
            fontSize: 16,
            color: colors.white,
            alignment: 'center'
          },
          eventCard: {
            backgroundColor: colors.lightBlue,
            padding: 20,
            marginBottom: 20,
            borderRadius: 8,
            border: [2, 'solid', colors.primary]
          },
