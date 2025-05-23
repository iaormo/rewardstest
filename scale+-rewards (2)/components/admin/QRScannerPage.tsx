import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { AlertTriangleIcon, QrCodeIcon, CheckIcon } from '../icons/Icons';

interface QRScannerPageProps {
  onScanSuccess: (decodedText: string) => void;
}

const QRScannerPage: React.FC<QRScannerPageProps> = ({ onScanSuccess }) => {
  const scannerRegionId = "qr-code-scanner-page-region";
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [scanStatus, setScanStatus] = useState<string>("Initializing scanner...");
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [lastScannedId, setLastScannedId] = useState<string | null>(null);

  useEffect(() => {
    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode(scannerRegionId, { verbose: false });
    }
    const qrCode = html5QrCodeRef.current;

    let unmounted = false;

    const startScanner = async () => {
      if (unmounted || qrCode.getState() === Html5QrcodeScannerState.SCANNING || qrCode.getState() === Html5QrcodeScannerState.PAUSED ) {
        return;
      }
      try {
        setScanStatus("Requesting camera permissions...");
        setErrorStatus(null);
        setLastScannedId(null);
        await qrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const minEdgePercentage = 0.7;
              const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
              const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
              return { width: qrboxSize, height: qrboxSize };
            },
            aspectRatio: 1.0,
          },
          (decodedText, _decodedResult) => {
            if (unmounted) return;
            // Temporarily stop/pause scanner to prevent multiple rapid scans and process this one
            if (qrCode.getState() === Html5QrcodeScannerState.SCANNING) {
                 qrCode.pause(true); 
            }
            setLastScannedId(decodedText);
            setScanStatus(`User ID Scanned: ${decodedText}. Navigating...`);
            onScanSuccess(decodedText); 
            // The parent (AdminPortal) will handle navigation. 
            // Scanner will be stopped by unmount or if user navigates away.
            // If we want to allow multiple scans on this page, we would resume.
            // For now, assume navigation happens.
          },
          (errorMessage) => { // On error
            if (unmounted) return;
            // This callback can be frequent. Only show persistent errors.
            // setErrorStatus(`Scanning issue: ${errorMessage}`);
            if(qrCode.getState() === Html5QrcodeScannerState.SCANNING) {
                setScanStatus("Scanning for QR Code...");
            }
          }
        );
        if (unmounted) return;
        setScanStatus("Scanner active. Point camera at a user's QR code.");
      } catch (err) {
        if (unmounted) return;
        console.error("Error starting QR scanner:", err);
        const message = (err instanceof Error) ? err.message : String(err);
        setErrorStatus(`Failed to start scanner: ${message}. Ensure camera access is allowed and no other app is using it.`);
        setScanStatus("Scanner failed to start.");
      }
    };

    startScanner();

    return () => {
      unmounted = true;
      if (qrCode && qrCode.getState() !== Html5QrcodeScannerState.NOT_STARTED) {
        qrCode.stop().catch(err => {
          console.error("Failed to stop QR scanner on unmount:", err);
        });
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="p-4 flex flex-col items-center bg-neutral-50 rounded-lg shadow-inner">
      <h3 className="text-lg font-semibold text-neutral-700 mb-4 flex items-center">
        <QrCodeIcon className="w-6 h-6 mr-2 text-primary" />
        Scan User QR Code
      </h3>
      <div 
        id={scannerRegionId} 
        className="w-full max-w-md h-auto aspect-[4/3] sm:aspect-square bg-neutral-900 rounded-lg overflow-hidden border-4 border-neutral-300 shadow-lg mb-4 relative"
      >
        {/* The library will inject the video stream here */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-3/4 h-3/4 border-2 border-dashed border-white/50 rounded-md"></div>
        </div>
      </div>
      
      {errorStatus && (
        <div className="my-3 p-3 bg-red-100 text-red-700 rounded-md text-sm flex items-center w-full max-w-md animate-fadeIn">
          <AlertTriangleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>{errorStatus}</span>
        </div>
      )}
      {lastScannedId && !errorStatus && (
         <div className="my-3 p-3 bg-green-100 text-green-700 rounded-md text-sm flex items-center w-full max-w-md animate-fadeIn">
            <CheckIcon className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>Successfully Scanned ID: {lastScannedId}. Redirecting...</span>
        </div>
      )}
      <p className={`mt-1 text-sm text-center ${errorStatus ? 'text-red-600' : 'text-neutral-600'}`}>
        {scanStatus}
      </p>
      <p className="text-xs text-neutral-500 mt-4 max-w-md text-center">
        Position the user's QR code within the viewfinder. The system will automatically detect it.
        If you encounter issues, ensure your browser has camera permissions enabled for this site.
      </p>
        <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        #${scannerRegionId} video { width: 100% !important; height: 100% !important; object-fit: cover; }
      `}</style>
    </div>
  );
};

export default QRScannerPage;