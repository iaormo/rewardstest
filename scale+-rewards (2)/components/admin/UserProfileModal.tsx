import React from 'react';
import Modal from '../Modal';
import { User, Tier } from '../../types';
import { useLoyalty } from '../../hooks/useLoyalty'; // To get tier details
import { UserCircleIcon, StarIcon, AwardIcon, IdentificationIcon, HashtagIcon } from '../icons/Icons'; // Added more icons

interface UserProfileModalProps {
  user: User;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
  const { getTierById } = useLoyalty();
  const tier = getTierById(user.tierId);

  const formatDate = (date: Date | undefined): string => {
    if (!date) return 'Date not available';
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const DetailItem: React.FC<{ label: string, value: string | number | undefined, icon?: React.ReactNode, highlight?: boolean }> = ({ label, value, icon, highlight = false }) => (
    <div className={`py-3 px-1 ${highlight ? 'bg-primary/5 rounded-md' : ''}`}>
      <dt className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center">
        {icon && <span className="mr-2 opacity-70">{icon}</span>}
        {label}
      </dt>
      <dd className={`mt-1 text-sm font-semibold ${highlight ? 'text-primary-dark' : 'text-neutral-800'}`}>
        {value === undefined || value === '' ? <span className="italic text-neutral-400">Not provided</span> : String(value)}
      </dd>
    </div>
  );


  return (
    <Modal title={`User Profile: ${user.name}`} onClose={onClose} size="md">
      <div className="p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 pb-6 border-b border-neutral-200 gap-4">
          <div className="flex-shrink-0 h-20 w-20 sm:h-24 sm:w-24 bg-neutral-200 rounded-full flex items-center justify-center shadow-md">
            <UserCircleIcon className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
          </div>
          <div className="text-center sm:text-left sm:ml-2">
            <h3 className="text-2xl font-bold text-neutral-900">{user.name}</h3>
            <p className="text-sm text-neutral-600">{user.email}</p>
            {user.isAdmin && <span className="mt-1 inline-block bg-accent/20 text-accent-dark text-xs font-semibold px-2 py-0.5 rounded-full">Administrator</span>}
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
          <DetailItem label="User ID" value={user.id} icon={<HashtagIcon className="w-4 h-4" />} />
          <DetailItem label="Phone Number" value={user.phone} icon={<IdentificationIcon className="w-4 h-4" />} />
          <DetailItem label="Customer Since" value={formatDate(user.registrationDate)} icon={<UserCircleIcon className="w-4 h-4" />} />
          
          <div className="sm:col-span-2 my-2 border-t border-neutral-200"></div>
          
          <DetailItem 
            label="Current Points" 
            value={user.points.toLocaleString()} 
            icon={<StarIcon className="w-4 h-4 text-yellow-500" />} 
            highlight 
          />
          {tier && (
            <DetailItem 
                label="Current Tier" 
                value={tier.name} 
                icon={tier.icon ? React.cloneElement(tier.icon, { className: "w-4 h-4" }) : <AwardIcon className="w-4 h-4" />} 
                highlight
            />
          )}
        </dl>

        <div className="mt-8 pt-6 border-t border-neutral-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-md hover:shadow-lg transition font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserProfileModal;