// src/app/components/ToasterClient.tsx
'use client'; // Đây là chỉ thị để Next.js biết đây là Client Component

import { Toaster } from 'react-hot-toast';

const ToasterClient = () => {
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      containerStyle={{
        top: 20,
        right: 20,
        zIndex: 9999
      }}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '14px',
          maxWidth: '350px',
          zIndex: 9999
        },
        success: {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '14px',
            maxWidth: '350px',
            zIndex: 9999
          },
        },
        error: {
          duration: 3000,
          style: {
            background: '#EF4444',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '14px',
            maxWidth: '350px',
            zIndex: 9999
          },
        },
      }}
    />
  );
};

export default ToasterClient;
