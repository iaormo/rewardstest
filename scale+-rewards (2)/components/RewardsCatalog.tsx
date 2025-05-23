import React, { useState } from 'react';
import { useLoyalty } from '../hooks/useLoyalty';
import RewardCard from './RewardCard';
import Modal from './Modal';
import { Reward } from '../types';
import { useAuth } from '../hooks/useAuth';
import { CheckIcon, GiftIcon, AlertTriangleIcon } from './icons/Icons'; // Added AlertTriangleIcon

const RewardsCatalog: React.FC = () => {
  const { rewards, redeemReward } = useLoyalty();
  const { currentUser } = useAuth();
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const handleRedeemClick = (reward: Reward) => {
    if (!currentUser) {
        setFeedback({type: 'error', message: "You must be logged in to redeem rewards."});
        setShowFeedbackModal(true);
        return;
    }
    if (currentUser.points < (reward.pointsRequired || 0)) {
        setFeedback({type: 'error', message: "You don't have enough points for this reward."});
        setShowFeedbackModal(true);
        return;
    }
    if (reward.stock !== undefined && reward.stock <= 0) {
        setFeedback({type: 'error', message: "This reward is out of stock."});
        setShowFeedbackModal(true);
        return;
    }
    setSelectedReward(reward);
  };

  const confirmRedeem = async () => {
    if (!selectedReward || !currentUser) return;

    setIsRedeeming(true);
    setFeedback(null);
    try {
      await redeemReward(selectedReward.id);
      setFeedback({type: 'success', message: `Successfully redeemed "${selectedReward.name}"!`});
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "An unknown error occurred.";
      setFeedback({ type: 'error', message: `Error redeeming: ${errMsg}` });
    } finally {
      setIsRedeeming(false);
      setSelectedReward(null); // Close confirmation modal
      setShowFeedbackModal(true); // Show feedback modal
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl">
      <div className="flex items-center mb-6 sm:mb-8 pb-4 border-b border-neutral-200">
        <GiftIcon className="w-8 h-8 text-primary mr-3" />
        <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-800">Rewards Catalog</h2>
      </div>
      
      {rewards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rewards.map((reward) => (
            <RewardCard 
              key={reward.id} 
              reward={reward} 
              onRedeem={() => handleRedeemClick(reward)}
              userPoints={currentUser?.points || 0}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
            <GiftIcon className="w-20 h-20 text-neutral-300 mx-auto mb-6" />
            <p className="text-xl text-neutral-500 font-medium">No Rewards Available</p>
            <p className="text-neutral-400 mt-1">Please check back later, or contact support if you expect to see rewards.</p>
        </div>
      )}

      {selectedReward && !showFeedbackModal && (
        <Modal title={`Redeem ${selectedReward.name}?`} onClose={() => setSelectedReward(null)}>
          <p className="text-neutral-600 mb-2">This will cost <span className="font-bold text-accent">{selectedReward.pointsRequired?.toLocaleString()} points</span>.</p>
          <p className="text-neutral-600 mb-6">Your current balance is <span className="font-bold text-primary">{currentUser?.points.toLocaleString()} points</span>.</p>
          {selectedReward.stock !== undefined && <p className="text-sm text-neutral-500 mb-1">Stock remaining: {selectedReward.stock}</p>}
          <div className="flex justify-end space-x-3 pt-3">
            <button
              onClick={() => setSelectedReward(null)}
              className="px-5 py-2.5 bg-neutral-200 text-neutral-800 rounded-lg hover:bg-neutral-300 transition font-medium"
              disabled={isRedeeming}
            >
              Cancel
            </button>
            <button
              onClick={confirmRedeem}
              className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-md hover:shadow-lg transition font-medium disabled:opacity-60 flex items-center"
              disabled={isRedeeming || (currentUser && currentUser.points < (selectedReward.pointsRequired || 0)) || (selectedReward.stock !== undefined && selectedReward.stock <=0)}
            >
              {isRedeeming ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : <GiftIcon className="w-5 h-5 mr-2"/>}
              Confirm Redemption
            </button>
          </div>
        </Modal>
      )}

      {showFeedbackModal && feedback && (
         <Modal 
            title={feedback.type === 'error' ? "Redemption Failed" : "Redemption Successful!"}
            onClose={() => {
                setShowFeedbackModal(false);
                setFeedback(null);
            }}
        >
          <div className="text-center py-2">
            {feedback.type === 'success' && <CheckIcon className="w-16 h-16 text-green-500 mx-auto mb-4"/>}
            {feedback.type === 'error' && <AlertTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4"/>}
            <p className={`text-lg ${feedback.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {feedback.message}
            </p>
          </div>
         </Modal>
      )}
    </div>
  );
};

export default RewardsCatalog;