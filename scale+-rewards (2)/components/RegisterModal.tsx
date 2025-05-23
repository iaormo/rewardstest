
import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';
import { UserPlusIcon, IdentificationIcon, HashtagIcon, UserCircleIcon, AlertTriangleIcon } from './icons/Icons';

interface RegisterModalProps {
  onClose: () => void;
  onRegisterSuccess: (newUser: User) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onRegisterSuccess }) => {
  const { registerUser } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ fullName?: string; email?: string; phone?: string }>({});

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = (): boolean => {
    const newFieldErrors: { fullName?: string; email?: string; phone?: string } = {};
    let isValid = true;

    if (!fullName.trim()) {
      newFieldErrors.fullName = 'Full Name is required.';
      isValid = false;
    }
    if (!email.trim()) {
      newFieldErrors.email = 'Email is required.';
      isValid = false;
    } else if (!validateEmail(email)) {
      newFieldErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }
    // Phone is optional, so no specific validation here unless format is enforced
    // if (phone.trim() && !/^\d{10}$/.test(phone.trim())) { // Example: 10 digit phone
    //   newFieldErrors.phone = 'Please enter a valid 10-digit phone number.';
    //   isValid = false;
    // }

    setFieldErrors(newFieldErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const newUser = await registerUser(fullName, email, phone);
      onRegisterSuccess(newUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred during registration.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const commonInputClass = "block w-full border-transparent rounded-md shadow-sm py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-neutral-700 text-white placeholder-neutral-400";
  const errorInputClass = "border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500";
  const iconClass = "h-5 w-5 text-neutral-300";

  return (
    <Modal title="Create New Account" onClose={onClose} size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 flex items-center">
            <AlertTriangleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
           <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircleIcon className={iconClass} aria-hidden="true" />
            </div>
            <input
                type="text"
                name="fullName"
                id="fullName"
                className={`${commonInputClass} pl-10 ${fieldErrors.fullName ? errorInputClass : ''}`}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="E.g. Jane Doe"
                aria-describedby={fieldErrors.fullName ? "fullName-error" : undefined}
                disabled={isLoading}
            />
          </div>
          {fieldErrors.fullName && <p id="fullName-error" className="mt-1 text-xs text-red-600">{fieldErrors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IdentificationIcon className={iconClass} aria-hidden="true" />
            </div>
            <input
                type="email"
                name="email"
                id="email"
                className={`${commonInputClass} pl-10 ${fieldErrors.email ? errorInputClass : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                disabled={isLoading}
            />
          </div>
          {fieldErrors.email && <p id="email-error" className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
            Phone Number <span className="text-xs text-neutral-500">(Optional)</span>
          </label>
           <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HashtagIcon className={iconClass} aria-hidden="true" />
            </div>
            <input
                type="tel"
                name="phone"
                id="phone"
                className={`${commonInputClass} pl-10 ${fieldErrors.phone ? errorInputClass : ''}`}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="E.g. 555-123-4567"
                aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                disabled={isLoading}
            />
          </div>
          {fieldErrors.phone && <p id="phone-error" className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-neutral-200 text-neutral-800 rounded-lg hover:bg-neutral-300 transition font-medium w-full sm:w-auto disabled:opacity-70"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-secondary hover:bg-secondary-dark text-white rounded-lg shadow hover:shadow-md transition font-medium flex items-center justify-center w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <UserPlusIcon className="w-5 h-5 mr-2" />
                Create Account
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RegisterModal;
