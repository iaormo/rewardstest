
import React, { useState, useContext, useCallback, ChangeEvent, useEffect } from 'react';
import { CardCustomizationContext } from '../../contexts/CardCustomizationContext';
import { CardSettings } from '../../types';
import { UploadIcon, PaintBrushIcon, TrashIcon, EyeIcon, XMarkIcon, CheckIcon, AlertTriangleIcon } from '../icons/Icons';
import DigitalCardPagePreview from './DigitalCardPagePreview'; 

const CardDesignSettingsPage: React.FC = () => {
  const context = useContext(CardCustomizationContext);
  if (!context) {
    throw new Error('CardDesignSettingsPage must be used within a CardCustomizationProvider');
  }
  const { cardSettings, updateCardSettings, resetCardSettings } = context;

  const [localSettings, setLocalSettings] = useState<Omit<CardSettings, 'numberOfStamps'>>(cardSettings);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(cardSettings.logoUrl);
  const [coverPreview, setCoverPreview] = useState<string | undefined>(cardSettings.coverImageUrl);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Effect to update local state if context changes (e.g., after reset)
  useEffect(() => {
    setLocalSettings(cardSettings);
    setLogoPreview(cardSettings.logoUrl);
    setCoverPreview(cardSettings.coverImageUrl);
  }, [cardSettings]);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fileType: 'logoUrl' | 'coverImageUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLocalSettings(prev => ({ ...prev, [fileType]: base64String }));
        if (fileType === 'logoUrl') setLogoPreview(base64String);
        if (fileType === 'coverImageUrl') setCoverPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (fileType: 'logoUrl' | 'coverImageUrl') => {
    setLocalSettings(prev => ({ ...prev, [fileType]: undefined }));
    if (fileType === 'logoUrl') setLogoPreview(undefined);
    if (fileType === 'coverImageUrl') setCoverPreview(undefined);
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    setSaveFeedback(null);
    // Simulate API call
    setTimeout(() => {
      try {
        updateCardSettings(localSettings);
        setSaveFeedback({type: 'success', message: "Card design settings saved successfully!"});
      } catch (error) {
        console.error("Error saving card settings:", error);
        setSaveFeedback({type: 'error', message: "Failed to save settings. Please try again."});
      } finally {
        setIsSaving(false);
        setTimeout(() => setSaveFeedback(null), 4000); // Clear feedback after 4 seconds
      }
    }, 1000); // Simulate 1 second delay
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset all card design settings to default? This cannot be undone.")) {
        resetCardSettings();
        // localSettings will be updated by the useEffect watching cardSettings
        setSaveFeedback({type: 'success', message: "Settings reset to default."});
        setTimeout(() => setSaveFeedback(null), 4000);
    }
  };
  
  const commonInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";
  const commonLabelClass = "block text-sm font-medium text-neutral-700";

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl sm:text-2xl font-semibold text-neutral-700 flex items-center">
          <PaintBrushIcon className="w-7 h-7 mr-2 text-primary" />
          Customize Digital Card Design
        </h3>
         <button
          onClick={() => setShowPreviewModal(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition flex items-center"
          disabled={isSaving}
        >
          <EyeIcon className="w-5 h-5 mr-2" />
          Preview Card
        </button>
      </div>

      {saveFeedback && (
        <div className={`p-3 mb-4 rounded-md text-sm flex items-center ${saveFeedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {saveFeedback.type === 'success' ? <CheckIcon className="w-5 h-5 mr-2" /> : <AlertTriangleIcon className="w-5 h-5 mr-2" />}
          {saveFeedback.message}
           <button onClick={() => setSaveFeedback(null)} className="ml-auto text-lg font-semibold leading-none opacity-70 hover:opacity-100">&times;</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-neutral-50 rounded-lg shadow">
        {/* Settings Form */}
        <div className="space-y-6">
          <div>
            <label htmlFor="cardTitle" className={commonLabelClass}>Card Title</label>
            <input type="text" name="cardTitle" id="cardTitle" value={localSettings.cardTitle} onChange={handleInputChange} className={commonInputClass} placeholder="E.g., MY REWARDS CARD" />
          </div>
          
          <div>
            <label htmlFor="primaryColor" className={commonLabelClass}>Card Primary Color (Background/Accent)</label>
            <input type="color" name="primaryColor" id="primaryColor" value={localSettings.primaryColor} onChange={handleInputChange} className={`${commonInputClass} h-10 p-1`} />
             <p className="text-xs text-neutral-500 mt-1">Used if no cover image is set, or for some card accents.</p>
          </div>

          <div>
            <label htmlFor="secondaryColor" className={commonLabelClass}>Card Secondary Color (Text/Icons)</label>
            <input type="color" name="secondaryColor" id="secondaryColor" value={localSettings.secondaryColor} onChange={handleInputChange} className={`${commonInputClass} h-10 p-1`} />
            <p className="text-xs text-neutral-500 mt-1">Main color for text and icons on the card for contrast.</p>
          </div>

          <div>
            <label className={commonLabelClass}>Company Logo</label>
            <input type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={(e) => handleFileChange(e, 'logoUrl')} className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary-dark hover:file:bg-primary/20" />
            {logoPreview && (
              <div className="mt-2 p-2 border rounded-md inline-block bg-white relative">
                <img src={logoPreview} alt="Logo Preview" className="h-16 max-w-xs object-contain" />
                <button onClick={() => handleRemoveImage('logoUrl')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-700" aria-label="Remove logo">
                    <XMarkIcon className="w-4 h-4"/>
                </button>
              </div>
            )}
             <p className="text-xs text-neutral-500 mt-1">Recommended: Small, transparent background (PNG/SVG).</p>
          </div>

          <div>
            <label className={commonLabelClass}>Card Cover Image</label>
            <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleFileChange(e, 'coverImageUrl')} className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary-dark hover:file:bg-primary/20" />
            {coverPreview && (
              <div className="mt-2 p-2 border rounded-md inline-block bg-white relative">
                <img src={coverPreview} alt="Cover Preview" className="h-24 max-w-xs object-contain" />
                 <button onClick={() => handleRemoveImage('coverImageUrl')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-700" aria-label="Remove cover image">
                    <XMarkIcon className="w-4 h-4"/>
                </button>
              </div>
            )}
             <p className="text-xs text-neutral-500 mt-1">This will be the background of the digital card. Recommended aspect ratio around 16:9 or 2:1.</p>
          </div>
        </div>
        
        <div className="bg-neutral-200 p-4 rounded-lg flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-neutral-500 mb-2 text-center">Live Preview (Simplified)</p>
          <div className="w-full max-w-sm transform scale-75 origin-top">
             <DigitalCardPagePreview settings={localSettings as CardSettings} />
          </div>
          <p className="text-xs text-neutral-400 mt-2 text-center">Click "Preview Card" button for a full-size modal preview.</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-end items-center gap-3 pt-6 border-t border-neutral-300">
        <button
          onClick={handleResetToDefaults}
          disabled={isSaving}
          className="text-sm text-red-600 hover:text-red-800 font-medium py-2 px-4 rounded-lg hover:bg-red-100/50 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <TrashIcon className="w-4 h-4 mr-1.5" />
          Reset to Defaults
        </button>
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition flex items-center disabled:opacity-60 disabled:cursor-not-allowed min-w-[160px] justify-center"
        >
          {isSaving ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <CheckIcon className="w-5 h-5 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
      
      {showPreviewModal && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowPreviewModal(false)}
        >
          <div 
            className="bg-transparent rounded-xl w-full max-w-md sm:max-w-lg"
            onClick={(e) => e.stopPropagation()} 
          >
             <DigitalCardPagePreview settings={localSettings as CardSettings} isModalPreview={true} />
             <button 
                onClick={() => setShowPreviewModal(false)} 
                className="mt-4 mx-auto block bg-white/80 hover:bg-white text-neutral-800 font-semibold py-2 px-5 rounded-lg shadow-lg"
            >Close Preview</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardDesignSettingsPage;
