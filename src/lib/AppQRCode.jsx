'use client'
import React from 'react';
import QRCode from 'react-qr-code'; 

const AppQRCode = () => {
  const appUrl = "https://asha-beauty-parlour.vercel.app/";

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h1 className="text-xl text-zinc-600 font-bold mb-4">Scan to Open Asha Beauty-Parlour</h1>
      <QRCode value={appUrl} size={400} />
    </div>
  );
};

export default AppQRCode;
