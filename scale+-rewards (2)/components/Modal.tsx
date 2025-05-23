import React, { ReactNode, useEffect } from 'react';
import { XMarkIcon } from './icons/Icons';

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl'; // Optional size prop
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose, size = 'md' }) => {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', // Default
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} transform transition-all duration-300 animate-scaleUp
                    flex flex-col max-h-[90vh]`}
        onClick={handleModalContentClick}
      >
        <div className="flex justify-between items-center p-5 border-b border-neutral-200 sticky top-0 bg-white rounded-t-xl z-10">
          <h3 id="modal-title" className="text-xl font-semibold text-neutral-800">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-neutral-500 hover:text-neutral-700 transition-colors p-1 rounded-full hover:bg-neutral-100 active:bg-neutral-200"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-5 sm:p-6 overflow-y-auto">
          {children}
        </div>
      </div>
      {/* Fixed: Removed non-standard jsx and global props from style tag */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
        .animate-scaleUp { animation: scaleUp 0.25s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Modal;