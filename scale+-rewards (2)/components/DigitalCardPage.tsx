
import React, { useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import QRCode from 'react-qr-code';
import { CardCustomizationContext } from '../contexts/CardCustomizationContext';
import { QrCodeIcon as PageIcon, StarIcon } from './icons/Icons';

const DigitalCardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const cardContext = useContext(CardCustomizationContext);

  if (!currentUser) {
    return <div className="flex justify-center items-center h-full p-8"><p className="text-neutral-500 text-lg">Loading user data...</p></div>;
  }
  if (!cardContext) {
    return <div className="flex justify-center items-center h-full p-8"><p className="text-neutral-500 text-lg">Loading card settings...</p></div>;
  }

  const { cardSettings } = cardContext;
  const { logoUrl, coverImageUrl, cardTitle, primaryColor, secondaryColor } = cardSettings;

  const qrValue = currentUser.id;

  const cardStyle: React.CSSProperties = {
    backgroundColor: coverImageUrl ? 'transparent' : primaryColor,
    color: secondaryColor,
    backgroundImage: coverImageUrl ? `url(${coverImageUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const textShadowStyle: React.CSSProperties = {
    textShadow: '0px 1px 3px rgba(0,0,0,0.5)', 
  };
  
  const effectiveSecondaryColor = secondaryColor || '#FFFFFF';

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl max-w-2xl mx-auto">
       <div className="flex items-center mb-4 sm:mb-6 pb-3 border-b border-neutral-200">
        <PageIcon className="w-7 h-7 text-primary mr-2.5" />
        <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800">Your Rewards Card</h2>
      </div>

      <div 
        className="aspect-[9/16] sm:aspect-video max-w-md w-full mx-auto rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden relative"
        style={cardStyle}
      >
        {coverImageUrl && <div className="absolute inset-0 bg-black/30 z-0"></div>}

        <div className="relative z-10 flex flex-col h-full">
          {/* User Name (Left) and Points (Right) - TOP */}
          <section className="flex justify-between items-center pt-1 pb-2 sm:pt-2 sm:pb-3 text-sm sm:text-base">
            <div className="text-left">
              <p className="font-medium truncate" style={textShadowStyle}>{currentUser.name}</p>
            </div>
            <div className="text-right flex items-center">
              <StarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 mr-1.5" />
              <p className="font-medium" style={textShadowStyle}>{currentUser.points.toLocaleString()} Points</p>
            </div>
          </section>

          {/* Logo Centered */}
          <header className="flex justify-center items-center pt-2 pb-1 sm:pt-3 sm:pb-1.5"> {/* Reduced bottom padding */}
            {logoUrl ? (
              <img src={logoUrl} alt="Company Logo" className="h-10 sm:h-12 max-h-12 object-contain" style={{filter: `brightness(0) invert(${effectiveSecondaryColor === '#FFFFFF' ? 1 : 0})` }}/>
            ) : (
              <div className="h-10 sm:h-12"></div> // Placeholder for spacing if no logo
            )}
          </header>

          {/* Card Title Centered Below Logo */}
          <section className="text-center pt-0 pb-1 sm:pt-0 sm:pb-1.5"> {/* Reduced top padding */}
            <h1 className="text-base sm:text-lg font-semibold uppercase tracking-wider" style={textShadowStyle}>
              {cardTitle || "LOYALTY REWARDS"}
            </h1>
          </section>
          
          {/* Spacer to push QR to bottom */}
          <div className="flex-grow"></div> 

          {/* Footer with QR Code */}
          <footer className="pt-3 text-center">
            <div className="bg-white p-2.5 sm:p-3 rounded-lg inline-block shadow-md mx-auto">
              <QRCode value={qrValue} size={132} level="M" fgColor="#000000" bgColor="#FFFFFF" />
            </div>
            <p className="text-xs sm:text-sm mt-2 opacity-90" style={textShadowStyle}>Powered by ScalePlus Rewards</p>
          </footer>
        </div>
      </div>
      <p className="text-center text-neutral-500 text-xs sm:text-sm mt-6">
        Present this card to an administrator for transactions.
      </p>
    </div>
  );
};

export default DigitalCardPage;
