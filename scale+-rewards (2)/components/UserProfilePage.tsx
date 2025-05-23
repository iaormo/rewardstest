
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';
import { UserCircleIcon, IdentificationIcon, HashtagIcon, PencilIcon, ArrowUpTrayIcon, CameraIcon, CheckIcon, XMarkIcon } from './icons/Icons';

const UserProfilePage: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Pick<User, 'name' | 'email' | 'phone'>>>({});
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
      });
      setProfileImagePreview(currentUser.profileImageUrl || null);
    }
  }, [currentUser]);

  const handleEditToggle = () => {
    if (isEditing) { // Means "Cancel" was clicked
      if (currentUser) {
        setFormData({
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone,
        });
        setProfileImagePreview(currentUser.profileImageUrl || null);
        setProfileImageFile(null);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!currentUser) return;

    let newProfileImageUrl = currentUser.profileImageUrl;

    if (profileImageFile) {
      newProfileImageUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(profileImageFile);
      });
    }
    
    const updatedData = {
      name: formData.name || currentUser.name,
      email: formData.email || currentUser.email,
      phone: formData.phone || currentUser.phone,
      profileImageUrl: newProfileImageUrl,
    };

    updateUserProfile(currentUser.id, updatedData);
    setIsEditing(false);
    setProfileImageFile(null); // Reset file after saving
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return 'Date not available';
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const DetailItem: React.FC<{ label: string, value: string | undefined, icon?: React.ReactElement<{ className?: string }>, helpText?: string }> = ({ label, value, icon, helpText }) => (
    <div className="py-3 px-1">
      <dt className="text-sm font-medium text-neutral-500 flex items-center">
        {icon && React.cloneElement(icon, { className: "w-5 h-5 mr-2 text-neutral-400"})}
        {label}
      </dt>
      <dd className="mt-1 text-lg text-neutral-800">
        {value || <span className="italic text-neutral-400">Not provided</span>}
      </dd>
      {helpText && <p className="mt-0.5 text-xs text-neutral-400">{helpText}</p>}
    </div>
  );
  
  const EditableField: React.FC<{label: string, name: keyof Pick<User, 'name' | 'email' | 'phone'>, value: string | undefined, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, icon?: React.ReactElement<{ className?: string }>}> = 
  ({label, name, value, onChange, type = "text", icon}) => (
    <div className="py-2">
      <label htmlFor={name} className="block text-sm font-medium text-neutral-600 flex items-center mb-1">
        {icon && React.cloneElement(icon, { className: "w-4 h-4 mr-2 text-neutral-400"})}
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value || ''}
        onChange={onChange}
        className="mt-1 block w-full px-3 py-2.5 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
      />
    </div>
  );

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <p className="text-neutral-500 text-lg">Loading your profile information...</p>
      </div>
    );
  }
  
  const avatarContent = () => {
    if (profileImagePreview) {
        return <img src={profileImagePreview} alt="Profile Preview" className="h-full w-full object-cover" />;
    }
    if (currentUser.profileImageUrl) {
      return <img src={currentUser.profileImageUrl} alt={currentUser.name} className="h-full w-full object-cover" />;
    }
    return <span className="text-2xl sm:text-3xl font-bold text-white">{currentUser.name.substring(0, 1).toUpperCase()}</span>;
  };


  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-neutral-200">
        <div className="flex items-center">
          <UserCircleIcon className="w-8 h-8 text-primary mr-3 flex-shrink-0" />
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-800">My Profile</h1>
        </div>
        {!isEditing && (
          <button
            onClick={handleEditToggle}
            className="flex items-center bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150"
            aria-label="Edit Profile"
          >
            <PencilIcon className="w-5 h-5 mr-2" /> Edit Profile
          </button>
        )}
      </header>

      <div className="space-y-6">
        {/* Avatar and Basic Info */}
        <div className="p-4 sm:p-6 bg-neutral-50 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="relative group">
                <div className="h-24 w-24 sm:h-28 sm:w-28 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                    {avatarContent()}
                </div>
                {isEditing && (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                        aria-label="Change profile photo"
                    >
                        <CameraIcon className="w-8 h-8 text-white" />
                    </button>
                )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              aria-hidden="true"
            />
            <div className={isEditing ? 'w-full sm:w-auto flex-grow' : 'text-center sm:text-left'}>
              {isEditing ? (
                <EditableField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} icon={<UserCircleIcon />} />
              ) : (
                <>
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">{currentUser.name}</h2>
                  <p className="text-sm text-neutral-600">{currentUser.email}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-neutral-200/80">
          {isEditing ? (
            <div className="space-y-4">
              <EditableField label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} icon={<IdentificationIcon />} />
              <EditableField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} icon={<HashtagIcon />} />
              <div>
                  <dt className="text-sm font-medium text-neutral-600 flex items-center mb-1">
                     <UserCircleIcon className="w-4 h-4 mr-2 text-neutral-400"/> Customer Since
                  </dt>
                  <dd className="mt-1 text-lg text-neutral-500 bg-neutral-100 p-2.5 rounded-md"> {/* Readonly field style */}
                    {formatDate(currentUser.registrationDate)}
                  </dd>
              </div>
            </div>
          ) : (
            <dl className="divide-y divide-neutral-200">
              <DetailItem label="Full Name" value={currentUser.name} icon={<UserCircleIcon />} />
              <DetailItem label="Email Address" value={currentUser.email} icon={<IdentificationIcon />} />
              <DetailItem label="Phone Number" value={currentUser.phone} icon={<HashtagIcon />} />
              <DetailItem label="Customer Since" value={formatDate(currentUser.registrationDate)} icon={<UserCircleIcon />} />
            </dl>
          )}
        </div>

        {isEditing && (
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              onClick={handleEditToggle} // This now acts as Cancel
              className="flex items-center justify-center px-5 py-2.5 bg-neutral-200 text-neutral-800 rounded-lg hover:bg-neutral-300 transition font-medium"
            >
              <XMarkIcon className="w-5 h-5 mr-2"/> Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              className="flex items-center justify-center px-5 py-2.5 bg-secondary hover:bg-secondary-dark text-white rounded-lg shadow hover:shadow-md transition font-medium"
            >
              <CheckIcon className="w-5 h-5 mr-2"/> Save Changes
            </button>
          </div>
        )}
      </div>

      {!isEditing && (
        <p className="text-center text-neutral-500 text-sm mt-8">
          This information is used for your Scale+ Rewards account.
        </p>
      )}
    </div>
  );
};

export default UserProfilePage;