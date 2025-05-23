import React from 'react';
import { Reward } from '../types';
import { StarIcon, GiftIcon, XCircleIcon } from './icons/Icons'; // Added XCircleIcon

interface RewardCardProps {
  reward: Reward;
  onRedeem: (reward: Reward) => void;
  userPoints: number;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward, onRedeem, userPoints }) => {
  const pointsRequired = reward.pointsRequired || 0;
  const canAfford = userPoints >= pointsRequired;
  const isOutOfStock = reward.stock !== undefined && reward.stock <= 0;

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1
                  ${(!canAfford || isOutOfStock) ? 'opacity-70' : ''} ${isOutOfStock ? 'grayscale-[30%]' : ''}`}
    >
      {reward.imageUrl ? (
        <div className="w-full h-48 overflow-hidden bg-neutral-200">
            <img 
                src={reward.imageUrl} 
                alt={reward.name || 'Reward image'} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300x200/E2E8F0/94A3B8?text=Image+Not+Found')}
            />
        </div>
      ) : (
        <div className="w-full h-48 flex items-center justify-center bg-neutral-100">
            <GiftIcon className="w-16 h-16 text-neutral-300" />
        </div>
      )}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-neutral-800 mb-1.5 truncate" title={reward.name}>{reward.name || 'Unnamed Reward'}</h3>
        <p className="text-sm text-neutral-600 mb-3 flex-grow min-h-[40px] line-clamp-2" title={reward.description}>{reward.description || 'No description available.'}</p>
        
        <div className="flex items-center text-accent font-bold text-lg mb-3">
          <StarIcon className="w-5 h-5 mr-1.5" />
          {pointsRequired.toLocaleString()} Points
        </div>

        {reward.stock !== undefined && (
          <p className={`text-xs mb-3 font-medium ${reward.stock > 10 ? 'text-green-600' : reward.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
            {isOutOfStock ? 'Out of stock' : `${reward.stock} left in stock`}
          </p>
        )}
        
        <button
          onClick={() => onRedeem(reward)}
          disabled={!canAfford || isOutOfStock}
          className={`w-full mt-auto bg-secondary hover:bg-secondary-dark text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 
                      disabled:bg-neutral-300 disabled:cursor-not-allowed disabled:text-neutral-500 disabled:shadow-none
                      flex items-center justify-center`}
          aria-label={isOutOfStock ? `Reward ${reward.name} is out of stock` : !canAfford ? `Not enough points for ${reward.name}` : `Redeem ${reward.name}`}
        >
          {isOutOfStock ? (
            <>
              <XCircleIcon className="w-5 h-5 mr-2"/> Out of Stock
            </>
          ) : canAfford ? (
            <>
              <GiftIcon className="w-5 h-5 mr-2"/> Redeem
            </>
          ) : (
            'Not Enough Points'
          )}
        </button>
      </div>
    </div>
  );
};

export default RewardCard;