import React, { useState, useEffect } from 'react';
import { Reward } from '../../types';
import Modal from '../Modal';
import { GiftIcon, StarIcon, LinkIcon, HashtagIcon, InformationCircleIcon } from '../icons/Icons'; // Added more icons

interface RewardFormModalProps {
  reward: Partial<Reward>;
  isNew: boolean;
  onClose: () => void;
  onSave: (reward: Reward) => void;
}

const RewardFormModal: React.FC<RewardFormModalProps> = ({ reward, isNew, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Reward>>(reward);
  const [errors, setErrors] = useState<Partial<Record<keyof Reward, string>>>({});

  useEffect(() => {
    setFormData(reward); 
    setErrors({}); // Clear errors when reward prop changes
  }, [reward]);

  const validateField = (name: keyof Reward, value: any): string | undefined => {
    if (name === "name" && (!value || String(value).trim() === "")) {
      return "Reward name is required.";
    }
    if (name === "pointsRequired") {
        const num = Number(value);
        if (value === undefined || isNaN(num) || num < 0) {
            return "Points required must be a valid non-negative number.";
        }
    }
    if (name === "stock" && value !== undefined && value !== '') { // stock is optional
        const num = Number(value);
        if (isNaN(num) || num < 0) {
            return "Stock must be a valid non-negative number if specified.";
        }
    }
    if (name === "imageUrl" && value && String(value).trim() !== "") {
      try {
        new URL(String(value));
      } catch (_) {
        return "Please enter a valid URL for the image.";
      }
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement; // Assert type for name property
    let processedValue: string | number | undefined = value;
    
    if (name === 'pointsRequired' || name === 'stock') {
      processedValue = value === '' ? undefined : parseFloat(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    if (errors[name as keyof Reward]) {
        setErrors(prev => ({...prev, [name as keyof Reward]: validateField(name as keyof Reward, processedValue)}));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    const error = validateField(name as keyof Reward, name === 'pointsRequired' || name === 'stock' ? (value === '' ? undefined : parseFloat(value)) : value);
    setErrors(prev => ({...prev, [name as keyof Reward]: error}));
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentErrors: Partial<Record<keyof Reward, string>> = {};
    (Object.keys(formData) as Array<keyof Reward>).forEach(key => {
        const error = validateField(key, formData[key]);
        if(error) currentErrors[key] = error;
    });
    // Validate required fields if not touched
    if(!formData.name) currentErrors.name = validateField("name", formData.name);
    if(formData.pointsRequired === undefined) currentErrors.pointsRequired = validateField("pointsRequired", formData.pointsRequired);


    setErrors(currentErrors);

    if (Object.keys(currentErrors).some(key => currentErrors[key as keyof Reward] !== undefined)) {
      return;
    }
    onSave(formData as Reward); 
  };

  const commonInputClass = "block w-full border-transparent rounded-md shadow-sm py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-neutral-700 text-white placeholder-neutral-400";
  const errorInputClass = "border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500";
  const iconClass = "h-5 w-5 text-neutral-300";


  return (
    <Modal title={isNew ? "Add New Reward" : `Edit Reward: ${reward.name || ''}`} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
            Reward Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className={`${commonInputClass} ${errors.name ? errorInputClass : ''}`}
            value={formData.name || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-describedby={errors.name ? "name-error" : undefined}
            placeholder="E.g. Free Coffee"
          />
          {errors.name && <p id="name-error" className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            className={`${commonInputClass} ${errors.description ? errorInputClass : ''}`}
            value={formData.description || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-describedby={errors.description ? "description-error" : undefined}
            placeholder="Describe the reward"
          />
           {errors.description && <p id="description-error" className="mt-1 text-xs text-red-600">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
            <label htmlFor="pointsRequired" className="block text-sm font-medium text-neutral-700 mb-1">
                Points Required <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <StarIcon className={iconClass} aria-hidden="true" />
                </div>
                <input
                    type="number"
                    name="pointsRequired"
                    id="pointsRequired"
                    className={`${commonInputClass} pl-10 ${errors.pointsRequired ? errorInputClass : ''}`}
                    value={formData.pointsRequired === undefined ? '' : formData.pointsRequired}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="0"
                    placeholder="0"
                    aria-describedby={errors.pointsRequired ? "pointsRequired-error" : undefined}
                />
            </div>
            {errors.pointsRequired && <p id="pointsRequired-error" className="mt-1 text-xs text-red-600">{errors.pointsRequired}</p>}
            </div>

            <div>
            <label htmlFor="stock" className="block text-sm font-medium text-neutral-700 mb-1">
                Stock <span className="text-xs text-neutral-500">(Optional)</span>
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HashtagIcon className={iconClass} aria-hidden="true" />
                </div>
                <input
                    type="number"
                    name="stock"
                    id="stock"
                    className={`${commonInputClass} pl-10 ${errors.stock ? errorInputClass : ''}`}
                    value={formData.stock === undefined ? '' : formData.stock}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="0"
                    placeholder="Leave blank for unlimited"
                    aria-describedby={errors.stock ? "stock-error" : undefined}
                />
            </div>
            {errors.stock && <p id="stock-error" className="mt-1 text-xs text-red-600">{errors.stock}</p>}
            </div>
        </div>
        
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-neutral-700 mb-1">
            Image URL <span className="text-xs text-neutral-500">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className={iconClass} aria-hidden="true" />
            </div>
            <input
                type="url"
                name="imageUrl"
                id="imageUrl"
                className={`${commonInputClass} pl-10 ${errors.imageUrl ? errorInputClass : ''}`}
                value={formData.imageUrl || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://example.com/image.png"
                aria-describedby={errors.imageUrl ? "imageUrl-error" : undefined}
            />
          </div>
          {errors.imageUrl && <p id="imageUrl-error" className="mt-1 text-xs text-red-600">{errors.imageUrl}</p>}
        </div>

        <div className="flex justify-end space-x-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-neutral-200 text-neutral-800 rounded-lg hover:bg-neutral-300 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg shadow hover:shadow-md transition font-medium flex items-center"
          >
            <GiftIcon className="w-5 h-5 mr-2"/>
            {isNew ? 'Add Reward' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RewardFormModal;