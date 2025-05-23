import React, { useState } from 'react';
import { useLoyalty } from '../../hooks/useLoyalty';
import { Reward } from '../../types';
import Modal from '../Modal';
import RewardFormModal from './RewardFormModal';
import { PencilIcon, TrashIcon, PlusCircleIcon, GiftIcon, EyeIcon, EyeSlashIcon } from '../icons/Icons'; // Added Eye icons

const RewardManagement: React.FC = () => {
  const { rewards, addReward, updateReward, deleteReward: deleteRewardFromContext } = useLoyalty();
  const [editingReward, setEditingReward] = useState<Reward | Partial<Reward> | null>(null);
  const [isNewReward, setIsNewReward] = useState(false);
  const [rewardToDelete, setRewardToDelete] = useState<Reward | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFullDescriptionId, setShowFullDescriptionId] = useState<string | null>(null);


  const handleOpenAddModal = () => {
    setIsNewReward(true);
    setEditingReward({ name: '', description: '', pointsRequired: 0, stock: undefined, imageUrl: '' });
  };

  const handleOpenEditModal = (reward: Reward) => {
    setIsNewReward(false);
    setEditingReward(reward);
  };

  const handleCloseModal = () => {
    setEditingReward(null);
    setIsNewReward(false);
  };

  const handleSaveReward = (rewardData: Reward) => {
    if (isNewReward) {
      addReward(rewardData as Omit<Reward, 'id'>);
    } else {
      updateReward(rewardData);
    }
    handleCloseModal();
  };

  const handleDeleteReward = (reward: Reward) => {
    setRewardToDelete(reward);
  };

  const confirmDelete = () => {
    if (rewardToDelete) {
      deleteRewardFromContext(rewardToDelete.id);
      setRewardToDelete(null);
    }
  };
  
  const toggleDescription = (id: string) => {
    setShowFullDescriptionId(showFullDescriptionId === id ? null : id);
  };

  const filteredRewards = rewards.filter(reward => 
    reward.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reward.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <section aria-labelledby="reward-management-heading">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-4">
        <h3 id="reward-management-heading" className="text-xl sm:text-2xl font-semibold text-neutral-700">Manage Rewards ({filteredRewards.length})</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <input 
            type="text"
            placeholder="Search rewards..."
            className="px-4 py-2 border border-neutral-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm flex-grow sm:flex-grow-0 sm:w-auto max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleOpenAddModal}
            className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition flex items-center whitespace-nowrap"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" /> Add Reward
          </button>
        </div>
      </div>
      
      {filteredRewards.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-neutral-200">
          <table className="min-w-full table-auto">
            <thead className="bg-neutral-100 border-b border-neutral-300">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-700 sm:pl-6">Reward Name</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-700">Points</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-700">Stock</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-700 max-w-xs">Description</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-left text-sm font-semibold text-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {filteredRewards.map((reward) => (
                <tr key={reward.id} className="hover:bg-neutral-50/70 transition-colors duration-150">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6">
                    <div className="flex items-center">
                      {reward.imageUrl ? 
                        <img src={reward.imageUrl} alt={reward.name || ""} className="w-8 h-8 rounded-sm mr-3 object-cover bg-neutral-200" onError={(e) => e.currentTarget.style.display='none'}/> : 
                        <GiftIcon className="w-6 h-6 text-neutral-400 mr-3"/> 
                      }
                      {reward.name || 'N/A'}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">{(reward.pointsRequired || 0).toLocaleString()}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">{reward.stock === undefined ? 'Unlimited' : reward.stock.toLocaleString()}</td>
                  <td className="px-3 py-4 text-sm text-neutral-500 max-w-xs">
                     <div className="flex items-start justify-between">
                        <p className={showFullDescriptionId === reward.id ? 'whitespace-normal' : 'truncate'}>
                            {reward.description || <span className="italic text-neutral-400">No description</span>}
                        </p>
                        {(reward.description && reward.description.length > 50) && (
                             <button onClick={() => toggleDescription(reward.id)} className="ml-2 text-primary hover:underline text-xs flex-shrink-0">
                                {showFullDescriptionId === reward.id ? <EyeSlashIcon className="w-4 h-4"/> : <EyeIcon className="w-4 h-4"/>}
                            </button>
                        )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(reward)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1.5 rounded-md hover:bg-blue-100/70"
                        aria-label={`Edit ${reward.name || 'reward'}`}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReward(reward)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1.5 rounded-md hover:bg-red-100/70"
                        aria-label={`Delete ${reward.name || 'reward'}`}
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
            <GiftIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-xl text-neutral-500 font-medium">No Rewards Found</p>
            <p className="text-neutral-400 mt-1">
              {searchTerm ? "No rewards match your search. " : "No rewards configured yet. "} 
              Click "Add New Reward" to get started.
            </p>
        </div>
      )}

      {editingReward && (
        <RewardFormModal
          reward={editingReward}
          isNew={isNewReward}
          onClose={handleCloseModal}
          onSave={handleSaveReward}
        />
      )}

      {rewardToDelete && (
        <Modal title="Confirm Deletion" onClose={() => setRewardToDelete(null)} size="sm">
          <p className="text-neutral-600 mb-1">
            Are you sure you want to delete the reward <strong className="text-neutral-800">"{rewardToDelete.name}"</strong>?
          </p>
          <p className="text-sm text-red-600 mb-6">This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setRewardToDelete(null)}
              className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow hover:shadow-md transition font-medium"
            >
              Delete Reward
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default RewardManagement;