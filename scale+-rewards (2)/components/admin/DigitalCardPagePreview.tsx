
import React from 'react';
import QRCode from 'react-qr-code';
import { CardSettings, User } from '../../types'; 
import { StarIcon } from '../icons/Icons'; 

interface DigitalCardPagePreviewProps {
  settings: Omit<CardSettings, 'numberOfStamps'>; 
  isModalPreview?: boolean; 
}

const DigitalCardPagePreview: React.FC<DigitalCardPagePreviewProps> = ({ settings, isModalPreview = false }) => {
  const { logoUrl, coverImageUrl, cardTitle, primaryColor, secondaryColor } = settings;

  const mockUser: Partial<User> = { name: 'Jane Preview', id: 'preview-user-123' };
  const mockPoints = 1250; 
  
  const qrValue = mockUser.id || 'preview-qr';

  const cardBaseStyle: React.CSSProperties = {
    backgroundColor: coverImageUrl ? 'transparent' : primaryColor,
    color: secondaryColor, 
    position: 'relative', 
    overflow: 'hidden', 
    width: '100%',
    paddingBottom: isModalPreview ? '177.78%' : '160%', 
  };
  
  const cardCoverStyle: React.CSSProperties = coverImageUrl ? {
    backgroundImage: `url(${coverImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'absolute',
    inset: 0,
    zIndex: 0,
  } : {};

  const textShadowStyle: React.CSSProperties = {
    textShadow: '0px 1px 2px rgba(0,0,0,0.6)',
  };

  const effectiveSecondaryColor = secondaryColor || '#FFFFFF';

  // Adjust sizes for preview context
  const qrSize = isModalPreview ? 100 : 70; 
  const logoHeight = isModalPreview ? '2.5rem' : '2rem'; 
  const titleFontSize = isModalPreview ? '0.85rem' : '0.7rem';
  const namePointsFontSize = isModalPreview ? '0.8rem' : '0.65rem';
  const starIconSize = isModalPreview ? 'w-4 h-4' : 'w-3.5 h-3.5';
  const poweredByFontSize = isModalPreview ? '0.6rem' : '0.5rem';
  const qrPadding = isModalPreview ? 'p-1.5 sm:p-2' : 'p-1 sm:p-1.5';


  return (
    <div className={`rounded-xl shadow-xl w-full`} style={cardBaseStyle}>
      <div style={cardCoverStyle}></div>
      {coverImageUrl && <div className="absolute inset-0 bg-black/30 z-[1]"></div>}

      <div className={`absolute inset-0 p-3 sm:p-4 flex flex-col z-[2]`}>
        {/* User Name (Left) and Points (Right) - TOP */}
        <section className="flex justify-between items-center pt-0.5 pb-1 sm:pt-1 sm:pb-1.5" style={{fontSize: namePointsFontSize}}>
          <div className="text-left">
            <p className="font-medium truncate" style={{...textShadowStyle, color: effectiveSecondaryColor}}>{mockUser.name}</p>
          </div>
          <div className="text-right flex items-center">
            <StarIcon className={`${starIconSize} text-yellow-300 mr-1`} />
            <p className="font-medium" style={{...textShadowStyle, color: effectiveSecondaryColor}}>{mockPoints.toLocaleString()} Points</p>
          </div>
        </section>

        {/* Logo Centered */}
        <header className="flex justify-center items-center pt-1 pb-0.5 sm:pt-1.5 sm:pb-1"> {/* Reduced bottom padding */}
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="object-contain max-h-8" style={{height: logoHeight, filter: `brightness(0) invert(${effectiveSecondaryColor === '#FFFFFF' ? 1 : 0})`}}/>
          ) : (
            <div style={{height: logoHeight}}></div> 
          )}
        </header>

        {/* Card Title Centered Below Logo */}
        <section className="text-center pt-0 pb-0.5 sm:pt-0 sm:pb-0.5"> {/* Reduced top padding */}
          <h1 className="font-semibold uppercase tracking-wider truncate" style={{ ...textShadowStyle, color: effectiveSecondaryColor, fontSize: titleFontSize }}>
            {cardTitle || "LOYALTY REWARDS"}
          </h1>
        </section>
        
        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* QR Code Footer - BOTTOM */}
        <footer className="text-center">
          <div className={`bg-white ${qrPadding} rounded-md inline-block shadow-sm mx-auto`}>
            <QRCode value={qrValue} size={qrSize} level="M" fgColor="#000000" bgColor="#FFFFFF" />
          </div>
          <p className="mt-0.5 opacity-90" style={{...textShadowStyle, color: effectiveSecondaryColor, fontSize: poweredByFontSize}}>
            Powered by ScalePlus Rewards
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DigitalCardPagePreview;
