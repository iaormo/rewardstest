
import React, { useState, useEffect } from 'react';
import { Mechanic } from '../../types';
import Modal from '../Modal';
import { ListIcon, InformationCircleIcon, CheckIcon } from '../icons/Icons';

interface MechanicFormModalProps {
  mechanic: Partial<Mechanic>;
  isNew: boolean;
  onClose: () => void;
  onSave: (mechanic: Mechanic) => void;
}

const MechanicFormModal: React.FC<MechanicFormModalProps> = ({ mechanic, isNew, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Mechanic>>(mechanic);
  const [errors, setErrors] = useState<Partial<Record<keyof Mechanic, string>>>({});

  useEffect(() => {
    setFormData(prev => ({ ...prev, ...mechanic, isActive: mechanic.isActive === undefined ? true : mechanic.isActive }));
    setErrors({});
  }, [mechanic]);

  const validateField = (name: keyof Mechanic, value: any): string | undefined => {
    if (name === "title" && (!value || String(value).trim() === "")) {
      return "Mechanic title is required.";
    }
    if (name === "description" && (!value || String(value).trim() === "")) {
      return "Description is required.";
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let processedValue: string | boolean = value;

    if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    if (errors[name as keyof Mechanic]) {
        setErrors(prev => ({...prev, [name as keyof Mechanic]: validateField(name as keyof Mechanic, processedValue)}));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    const error = validateField(name as keyof Mechanic, value);
    setErrors(prev => ({...prev, [name as keyof Mechanic]: error}));
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentErrors: Partial<Record<keyof Mechanic, string>> = {};
    (Object.keys(formData) as Array<keyof Mechanic>).forEach(key => {
        if (key === 'title' || key === 'description') { // Only validate these explicitly for now
            const error = validateField(key, formData[key]);
            if(error) currentErrors[key] = error;
        }
    });
    if(!formData.title) currentErrors.title = validateField("title", formData.title);
    if(!formData.description) currentErrors.description = validateField("description", formData.description);


    setErrors(currentErrors);

    if (Object.keys(currentErrors).some(key => currentErrors[key as keyof Mechanic] !== undefined)) {
      return;
    }
    onSave(formData as Mechanic); 
  };

  const commonInputClass = "block w-full border-transparent rounded-md shadow-sm py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-neutral-700 text-white placeholder-neutral-400";
  const errorInputClass = "border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500";
  
  return (
    <Modal title={isNew ? "Add New Earning Mechanic" : `Edit Mechanic: ${mechanic.title || ''}`} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className={`${commonInputClass} ${errors.title ? errorInputClass : ''}`}
            value={formData.title || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-describedby={errors.title ? "title-error" : undefined}
            placeholder="E.g., Complete Your Profile"
          />
          {errors.title && <p id="title-error" className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            className={`${commonInputClass} ${errors.description ? errorInputClass : ''}`}
            value={formData.description || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-describedby={errors.description ? "description-error" : undefined}
            placeholder="Explain how users can earn points with this mechanic."
          />
           {errors.description && <p id="description-error" className="mt-1 text-xs text-red-600">{errors.description}</p>}
        </div>
        
        <div className="flex items-center">
            <input
                type="checkbox"
                name="isActive"
                id="isActive"
                className="h-4 w-4 text-primary border-neutral-300 rounded focus:ring-primary"
                checked={formData.isActive === undefined ? true : formData.isActive}
                onChange={handleChange}
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-neutral-700">
                Active <span className="text-xs text-neutral-500">(Visible to customers)</span>
            </label>
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
            <ListIcon className="w-5 h-5 mr-2"/>
            {isNew ? 'Add Mechanic' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MechanicFormModal;
