
import React, { useState } from 'react';
import { useLoyalty } from '../../hooks/useLoyalty';
import { Mechanic } from '../../types';
import Modal from '../Modal';
import MechanicFormModal from './MechanicFormModal';
import { PencilIcon, TrashIcon, PlusCircleIcon, ListIcon, EyeIcon, EyeSlashIcon, CheckIcon as ActiveIcon, XMarkIcon as InactiveIcon } from '../icons/Icons';

const MechanicsManagement: React.FC = () => {
  const { mechanics, addMechanic, updateMechanic, deleteMechanic: deleteMechanicFromContext } = useLoyalty();
  const [editingMechanic, setEditingMechanic] = useState<Mechanic | Partial<Mechanic> | null>(null);
  const [isNewMechanic, setIsNewMechanic] = useState(false);
  const [mechanicToDelete, setMechanicToDelete] = useState<Mechanic | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFullDescriptionId, setShowFullDescriptionId] = useState<string | null>(null);

  const handleOpenAddModal = () => {
    setIsNewMechanic(true);
    setEditingMechanic({ title: '', description: '', isActive: true });
  };

  const handleOpenEditModal = (mechanic: Mechanic) => {
    setIsNewMechanic(false);
    setEditingMechanic(mechanic);
  };

  const handleCloseModal = () => {
    setEditingMechanic(null);
    setIsNewMechanic(false);
  };

  const handleSaveMechanic = (mechanicData: Mechanic) => {
    if (isNewMechanic) {
      addMechanic(mechanicData as Omit<Mechanic, 'id'>);
    } else {
      updateMechanic(mechanicData);
    }
    handleCloseModal();
  };

  const handleDeleteMechanic = (mechanic: Mechanic) => {
    setMechanicToDelete(mechanic);
  };

  const confirmDelete = () => {
    if (mechanicToDelete) {
      deleteMechanicFromContext(mechanicToDelete.id);
      setMechanicToDelete(null);
    }
  };
  
  const toggleDescription = (id: string) => {
    setShowFullDescriptionId(showFullDescriptionId === id ? null : id);
  };

  const filteredMechanics = mechanics.filter(mechanic => 
    mechanic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mechanic.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section aria-labelledby="mechanics-management-heading">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-4">
        <h3 id="mechanics-management-heading" className="text-xl sm:text-2xl font-semibold text-neutral-700">Manage Earning Mechanics ({filteredMechanics.length})</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <input 
            type="text"
            placeholder="Search mechanics..."
            className="px-4 py-2 border border-neutral-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm flex-grow sm:flex-grow-0 sm:w-auto max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleOpenAddModal}
            className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition flex items-center whitespace-nowrap"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" /> Add Mechanic
          </button>
        </div>
      </div>
      
      {filteredMechanics.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-neutral-200">
          <table className="min-w-full table-auto">
            <thead className="bg-neutral-100 border-b border-neutral-300">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-700 sm:pl-6">Title</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-700 max-w-md">Description</th>
                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-neutral-700">Status</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-left text-sm font-semibold text-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {filteredMechanics.map((mechanic) => (
                <tr key={mechanic.id} className="hover:bg-neutral-50/70 transition-colors duration-150">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6">
                    {mechanic.title}
                  </td>
                  <td className="px-3 py-4 text-sm text-neutral-500 max-w-md">
                     <div className="flex items-start justify-between">
                        <p className={showFullDescriptionId === mechanic.id ? 'whitespace-normal' : 'truncate'}>
                            {mechanic.description || <span className="italic text-neutral-400">No description</span>}
                        </p>
                        {(mechanic.description && mechanic.description.length > 70) && ( // Show toggle if description is long
                             <button onClick={() => toggleDescription(mechanic.id)} className="ml-2 text-primary hover:underline text-xs flex-shrink-0 p-1">
                                {showFullDescriptionId === mechanic.id ? <EyeSlashIcon className="w-4 h-4"/> : <EyeIcon className="w-4 h-4"/>}
                            </button>
                        )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm
                                      ${mechanic.isActive ? 'bg-green-100 text-green-700 ring-1 ring-inset ring-green-200' : 'bg-red-100 text-red-700 ring-1 ring-inset ring-red-200'}`}>
                      {mechanic.isActive ? <ActiveIcon className="w-3 h-3 mr-1" /> : <InactiveIcon className="w-3 h-3 mr-1" />}
                      {mechanic.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(mechanic)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1.5 rounded-md hover:bg-blue-100/70"
                        aria-label={`Edit ${mechanic.title}`}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMechanic(mechanic)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1.5 rounded-md hover:bg-red-100/70"
                        aria-label={`Delete ${mechanic.title}`}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
         <div className="text-center py-12 bg-white rounded-lg shadow-md border border-neutral-200">
            <ListIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-xl text-neutral-500 font-medium">No Earning Mechanics Found</p>
            <p className="text-neutral-400 mt-1">
              {searchTerm ? "No mechanics match your search. " : "No earning mechanics configured yet. "} 
              Click "Add Mechanic" to create one.
            </p>
        </div>
      )}

      {editingMechanic && (
        <MechanicFormModal
          mechanic={editingMechanic}
          isNew={isNewMechanic}
          onClose={handleCloseModal}
          onSave={handleSaveMechanic}
        />
      )}

      {mechanicToDelete && (
        <Modal title="Confirm Deletion" onClose={() => setMechanicToDelete(null)} size="sm">
          <p className="text-neutral-600 mb-1">
            Are you sure you want to delete the mechanic <strong className="text-neutral-800">"{mechanicToDelete.title}"</strong>?
          </p>
          <p className="text-sm text-red-600 mb-6">This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setMechanicToDelete(null)}
              className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow hover:shadow-md transition font-medium"
            >
              Delete Mechanic
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default MechanicsManagement;
