import React from 'react';
import { Tier } from '../types';
import { AwardIcon, StarIcon } from './icons/Icons'; // Added StarIcon

interface TierProgressProps {
  currentPoints: number;
  currentTier: Tier;
  tiers: Tier[];
}

const TierProgress: React.FC<TierProgressProps> = ({ currentPoints, currentTier, tiers }) => {
  const currentTierIndex = tiers.findIndex(t => t.id === currentTier.id);
  const nextTier = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;

  let progressPercentage = 0;
  if (nextTier) {
    const pointsInCurrentTierRange = Math.max(0, currentPoints - currentTier.minPoints);
    const pointsForNextTierRange = nextTier.minPoints - currentTier.minPoints;
    if (pointsForNextTierRange > 0) {
         progressPercentage = Math.min(100, (pointsInCurrentTierRange / pointsForNextTierRange) * 100);
    } else { 
        progressPercentage = pointsInCurrentTierRange >= 0 ? 100: 0;
    }
  } else {
    progressPercentage = 100; // Max tier
  }

  return (
    <div className="my-6 p-5 bg-neutral-50 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-neutral-700 mb-1">Membership Tier Progress</h3>
      <p className="text-sm text-neutral-500 mb-3">
        You are currently in the <span className="font-semibold text-secondary-dark">{currentTier.name}</span> tier.
      </p>
      <div className="flex items-center justify-between text-xs text-neutral-600 mb-1 font-medium">
        <span className="flex items-center">
          {currentTier.icon ? React.cloneElement(currentTier.icon, {className:"w-4 h-4 mr-1"}) : <AwardIcon className="w-4 h-4 mr-1"/> }
          {currentTier.name}
        </span>
        {nextTier && (
          <span className="flex items-center">
            {nextTier.icon ? React.cloneElement(nextTier.icon, {className:"w-4 h-4 mr-1"}) : <AwardIcon className="w-4 h-4 mr-1"/> }
            {nextTier.name}
          </span>
        )}
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-3.5 dark:bg-neutral-700 overflow-hidden">
        <div
          className="bg-gradient-to-r from-secondary-light to-secondary h-3.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress to next tier: ${progressPercentage.toFixed(0)}%`}
        ></div>
      </div>
      <div className="flex items-center justify-between text-xs text-neutral-500 mt-1.5">
        <span>{currentTier.minPoints.toLocaleString()} pts</span>
        {nextTier ? (
          <span>{nextTier.minPoints.toLocaleString()} pts</span>
        ) : (
          <span className="font-semibold text-green-600">Max Tier Achieved!</span>
        )}
      </div>
       {nextTier && (
        <p className="text-sm text-center text-neutral-600 mt-4">
          You need <span className="font-bold text-primary">{Math.max(0, nextTier.minPoints - currentPoints).toLocaleString()}</span> more points to reach {nextTier.name} tier.
        </p>
      )}
      {!nextTier && currentTier && (
         <p className="text-sm text-center text-green-600 font-semibold mt-4 flex items-center justify-center">
            <StarIcon className="w-5 h-5 mr-1.5 text-yellow-400"/> Congratulations! You've reached the highest tier: {currentTier.name}!
        </p>
      )}
    </div>
  );
};

export default TierProgress;