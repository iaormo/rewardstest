
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLoyalty } from '../hooks/useLoyalty';
import TierProgress from './TierProgress';
import { TIERS } from '../constants';
import { StarIcon, AwardIcon, ArrowUpCircleIcon, ArrowDownCircleIcon, ListIcon as HowToEarnIcon, CheckIcon } from './icons/Icons';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { currentTier, getTransactionsForCurrentUser, mechanics } = useLoyalty();
  
  if (!currentUser) return null;

  const recentTransactions = getTransactionsForCurrentUser().slice(0, 5);
  const nextTier = TIERS.find(t => t.minPoints > currentUser.points);
  const activeMechanics = mechanics.filter(m => m.isActive);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 sm:gap-8">
      <div className="lg:col-span-5 bg-white p-6 rounded-xl shadow-xl space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-neutral-200">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-2 sm:mb-0">My Dashboard</h2>
          <div className="flex items-center space-x-2 text-md font-medium bg-neutral-100 px-3 py-1.5 rounded-lg">
              {currentTier.icon ? React.cloneElement(currentTier.icon, { className: "w-6 h-6 text-secondary-dark" }) : <AwardIcon className="w-6 h-6 text-secondary-dark"/>}
              <span className="text-neutral-700">{currentTier.name} Tier</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-lg font-medium opacity-90 mb-1">Current Points</h3>
            <p className="text-4xl font-bold flex items-center">
              <StarIcon className="w-8 h-8 mr-2 text-yellow-300" />
              {currentUser.points.toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-secondary to-secondary-dark text-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-lg font-medium opacity-90 mb-1">Points to Next Tier</h3>
            {nextTier ? (
              <>
                  <p className="text-4xl font-bold">
                  {(nextTier.minPoints - currentUser.points).toLocaleString()}
                  </p>
                  <p className="text-xs opacity-80">to reach {nextTier.name}</p>
              </>
            ) : (
              <p className="text-xl font-semibold mt-2">You're at the top tier!</p>
            )}
          </div>
        </div>
        
        <TierProgress currentPoints={currentUser.points} currentTier={currentTier} tiers={TIERS} />

        <div>
          <h3 className="text-xl font-semibold text-neutral-700 mb-4">Recent Activity</h3>
          {recentTransactions.length > 0 ? (
            <ul className="space-y-3">
              {recentTransactions.map(tx => (
                <li key={tx.id} className="flex justify-between items-center p-3.5 bg-neutral-50 hover:bg-neutral-100 rounded-lg shadow-sm transition-all duration-200">
                  <div className="flex items-center">
                    {tx.type === 'earn' ? 
                      <ArrowUpCircleIcon className="w-6 h-6 text-green-500 mr-3" /> : 
                      <ArrowDownCircleIcon className="w-6 h-6 text-red-500 mr-3" />
                    }
                    <div>
                      <p className="font-medium text-neutral-800">{tx.description}</p>
                      <p className="text-xs text-neutral-500">{new Date(tx.timestamp).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <span className={`font-semibold text-sm ${tx.type === 'earn' ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.type === 'earn' ? '+' : '-'}{tx.points.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-500 py-4 text-center">No recent activity to display.</p>
          )}
        </div>
      </div>

      {/* How to Earn Points Section */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-xl space-y-4">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-5 pb-4 border-b border-neutral-200 flex items-center">
          <HowToEarnIcon className="w-7 h-7 mr-2 text-primary" />
          How to Earn Points
        </h2>
        {activeMechanics.length > 0 ? (
            <ul className="space-y-4">
            {activeMechanics.map(mechanic => (
                <li key={mechanic.id} className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg shadow-sm">
                <h3 className="text-md font-semibold text-neutral-700 flex items-center">
                    <CheckIcon className="w-5 h-5 mr-2 text-secondary" /> 
                    {mechanic.title}
                </h3>
                <p className="text-sm text-neutral-600 mt-1 pl-7">{mechanic.description}</p>
                </li>
            ))}
            </ul>
        ) : (
            <p className="text-neutral-500 text-center py-6">
                Details on how to earn points will be listed here.
                Check back soon or contact support for more information.
            </p>
        )}
        <p className="text-xs text-neutral-500 pt-4 border-t border-neutral-200 mt-6">
            Points are typically added by an administrator based on these activities.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
