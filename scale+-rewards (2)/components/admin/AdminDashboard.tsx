
import React, { useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLoyalty } from '../../hooks/useLoyalty';
import { Transaction, User } from '../../types';
import { ArrowPathIcon, ArrowUpCircleIcon, ArrowDownCircleIcon, PresentationChartLineIcon, StarIcon, UsersIcon, ListIcon } from '../icons/Icons';

interface MonthlyStat {
  monthYear: string; // "YYYY-MM"
  monthDisplay: string; // "Month YYYY"
  totalEarned: number;
  totalRedeemed: number;
}

const AdminDashboard: React.FC = () => {
  const { users } = useAuth();
  const { transactions } = useLoyalty(); // This gets all transactions from LoyaltyContext
  const [visibleActivities, setVisibleActivities] = useState(15);

  const {
    nonAdminUsers,
    nonAdminTransactions,
    monthlyStats,
    overallStats
  } = useMemo(() => {
    const filteredNonAdminUsers = users.filter(u => !u.isAdmin);
    const nonAdminUserIds = new Set(filteredNonAdminUsers.map(u => u.id));
    const filteredNonAdminTransactions = transactions
        .filter(tx => nonAdminUserIds.has(tx.userId))
        .sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());

    const statsMap = new Map<string, { earned: number; redeemed: number }>();
    let totalEarnedOverall = 0;
    let totalRedeemedOverall = 0;

    filteredNonAdminTransactions.forEach(tx => {
      const monthYear = `${tx.timestamp.getFullYear()}-${String(tx.timestamp.getMonth() + 1).padStart(2, '0')}`;
      if (!statsMap.has(monthYear)) {
        statsMap.set(monthYear, { earned: 0, redeemed: 0 });
      }
      const currentMonthStat = statsMap.get(monthYear)!;
      if (tx.type === 'earn') {
        currentMonthStat.earned += tx.points;
        totalEarnedOverall += tx.points;
      } else {
        currentMonthStat.redeemed += tx.points;
        totalRedeemedOverall += tx.points;
      }
    });

    const processedMonthlyStats: MonthlyStat[] = [];
    statsMap.forEach((value, key) => {
      const [year, month] = key.split('-');
      processedMonthlyStats.push({
        monthYear: key,
        monthDisplay: new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' }),
        totalEarned: value.earned,
        totalRedeemed: value.redeemed,
      });
    });
    processedMonthlyStats.sort((a, b) => b.monthYear.localeCompare(a.monthYear));

    return {
      nonAdminUsers: filteredNonAdminUsers,
      nonAdminTransactions: filteredNonAdminTransactions,
      monthlyStats: processedMonthlyStats,
      overallStats: {
        totalEarned: totalEarnedOverall,
        totalRedeemed: totalRedeemedOverall,
        activeUsers: filteredNonAdminUsers.length
      }
    };
  }, [users, transactions]);

  const getUserNameById = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const loadMoreActivities = () => {
    setVisibleActivities(prev => prev + 15);
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <section aria-labelledby="summary-stats-heading">
        <h3 id="summary-stats-heading" className="text-xl font-semibold text-neutral-700 mb-4 flex items-center">
            <PresentationChartLineIcon className="w-6 h-6 mr-2 text-primary"/> Program Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-lg shadow-lg text-white">
            <div className="flex items-center mb-1">
              <StarIcon className="w-6 h-6 mr-2 text-yellow-300" />
              <h4 className="text-lg font-medium opacity-90">Total Points Generated</h4>
            </div>
            <p className="text-3xl font-bold">{overallStats.totalEarned.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 rounded-lg shadow-lg text-white">
             <div className="flex items-center mb-1">
              <StarIcon className="w-6 h-6 mr-2 text-yellow-300" />
              <h4 className="text-lg font-medium opacity-90">Total Points Redeemed</h4>
            </div>
            <p className="text-3xl font-bold">{overallStats.totalRedeemed.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-lg shadow-lg text-white">
            <div className="flex items-center mb-1">
              <UsersIcon className="w-6 h-6 mr-2" />
              <h4 className="text-lg font-medium opacity-90">Active Customers</h4>
            </div>
            <p className="text-3xl font-bold">{overallStats.activeUsers.toLocaleString()}</p>
          </div>
        </div>
      </section>

      {/* Monthly Breakdown */}
      <section aria-labelledby="monthly-breakdown-heading">
        <h3 id="monthly-breakdown-heading" className="text-xl font-semibold text-neutral-700 mb-4 flex items-center">
            <ListIcon className="w-6 h-6 mr-2 text-secondary"/> Monthly Points Summary
        </h3>
        {monthlyStats.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-neutral-200 max-h-96">
            <table className="min-w-full table-auto">
              <thead className="bg-neutral-100 border-b border-neutral-300 sticky top-0">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Month</th>
                  <th className="py-3 px-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">Points Generated</th>
                  <th className="py-3 px-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">Points Redeemed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {monthlyStats.map(stat => (
                  <tr key={stat.monthYear} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 text-sm text-neutral-700 font-medium whitespace-nowrap">{stat.monthDisplay}</td>
                    <td className="py-3 px-4 text-sm text-green-600 font-semibold text-right whitespace-nowrap">
                      +{stat.totalEarned.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-red-600 font-semibold text-right whitespace-nowrap">
                      -{stat.totalRedeemed.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-neutral-50 rounded-lg border border-neutral-200">
            <ListIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">No monthly data available yet.</p>
          </div>
        )}
      </section>

      {/* All Non-Admin User Activity Feed */}
      <section aria-labelledby="activity-feed-heading">
        <h3 id="activity-feed-heading" className="text-xl font-semibold text-neutral-700 mb-4 flex items-center">
             <UsersIcon className="w-6 h-6 mr-2 text-accent"/> All Non-Admin User Activity
        </h3>
        {nonAdminTransactions.length > 0 ? (
          <>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-neutral-200">
              <table className="min-w-full table-auto">
                <thead className="bg-neutral-100 border-b border-neutral-300">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Date & Time</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">User</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Activity</th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {nonAdminTransactions.slice(0, visibleActivities).map(tx => (
                    <tr key={tx.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-4 text-sm text-neutral-500 whitespace-nowrap">
                        {new Date(tx.timestamp).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
                        <span className="block text-xs text-neutral-400">
                          {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-700 font-medium whitespace-nowrap">{getUserNameById(tx.userId)}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600">
                        <div className="flex items-center">
                            {tx.type === 'earn' ? 
                                <ArrowUpCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" /> : 
                                <ArrowDownCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                            }
                            {tx.description}
                        </div>
                      </td>
                      <td className={`py-3 px-4 text-sm font-semibold text-right whitespace-nowrap ${tx.type === 'earn' ? 'text-green-600' : 'text-red-500'}`}>
                        {tx.type === 'earn' ? '+' : '-'}{tx.points.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visibleActivities < nonAdminTransactions.length && (
              <div className="mt-6 text-center">
                <button
                  onClick={loadMoreActivities}
                  className="bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 flex items-center mx-auto"
                >
                  <ArrowPathIcon className="w-5 h-5 mr-2" />
                  Load More Activities
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 bg-neutral-50 rounded-lg border border-neutral-200">
            <UsersIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">No user activity recorded yet.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;