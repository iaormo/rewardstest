import React from 'react';
import QRCode from 'react-qr-code'; // Changed import
import Modal from '../Modal';
import { User } from '../../types';
import { UserCircleIcon } from '../icons/Icons';

interface UserQRCodeModalProps {
  user: User;
  onClose: () => void;
}

const UserQRCodeModal: React.FC<UserQRCodeModalProps> = ({ user, onClose }) => {
  const qrValue = user.id; // Encode user ID

  return (
    <Modal title={`QR Code for ${user.name}`} onClose={onClose} size="sm">
      <div className="flex flex-col items-center p-4">
        <div className="mb-6 p-4 bg-white border border-neutral-300 rounded-lg shadow-inner inline-block">
          {/* Changed QRCodeCanvas to QRCode and adjusted props */}
          <QRCode value={qrValue} size={200} level="H" fgColor="#000000" bgColor="#FFFFFF" />
        </div>
        <div className="text-center">
          <UserCircleIcon className="w-12 h-12 text-primary mx-auto mb-2" />
          <p className="text-xl font-semibold text-neutral-800">{user.name}</p>
          <p className="text-sm text-neutral-600">{user.email}</p>
          <p className="mt-4 text-xs text-neutral-500">
            Scan this QR code to quickly identify the user.
          </p>
        </div>
         <button
            type="button"
            onClick={onClose}
            className="mt-8 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg shadow hover:shadow-md transition font-medium"
          >
            Close
          </button>
      </div>
    </Modal>
  );
};

export default UserQRCodeModal;